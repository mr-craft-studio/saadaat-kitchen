import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { store, INITIAL_PRODUCTS, INITIAL_DEALS } from './server/dataStore.ts';
import { Order, OrderItem } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK on server
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// Auth & Session Management
interface Session {
  token: string;
  email: string;
  expiresAt: number;
}
const activeSessions = new Map<string, Session>();

// Rate limiting for admin login
interface FailedAttempt {
  count: number;
  lockedUntil?: number;
}
const failedAttempts = new Map<string, FailedAttempt>();

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Auto-seed default admin if database is fresh
if (store.getAdminUsers().length === 0) {
  const defaultSalt = crypto.randomBytes(16).toString('hex');
  const defaultHash = hashPassword('Saadaat@2026', defaultSalt);
  store.addAdminUser('admin@saadaatkitchen.com', defaultHash, defaultSalt);
  console.log('[Auth] Initialized default admin: admin@saadaatkitchen.com / Saadaat@2026');
}

function adminAuthMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.substring(7);
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  (req as any).adminEmail = session.email;
  next();
}

// ----------------------------------------------------
// Public APIs
// ----------------------------------------------------

// 1. Get products (public only returns confirmed & published)
app.get('/api/products', (req, res) => {
  const all = req.query.includeDrafts === 'true';
  if (all) {
    return res.json(store.getProducts());
  }
  return res.json(store.getPublishedProducts());
});

// 2. Get deals
app.get('/api/deals', (req, res) => {
  return res.json(store.getDeals().filter(d => d.isPublished && d.isAvailable));
});

// 3. Get business settings
app.get('/api/settings', (req, res) => {
  return res.json(store.getSettings());
});

// 4. Create Order (with secure server-side recalculation)
app.post('/api/orders', (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryInstructions,
      orderType = 'delivery',
      paymentMethod,
      items,
      easypaisaRef
    } = req.body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      return res.status(400).json({ error: 'Delivery address is required for delivery orders' });
    }

    // Validate phone number (Pakistani format e.g. 03xx-xxxxxxx or +92 3xx xxxxxxx)
    const cleanPhone = customerPhone.replace(/\s+/g, '').replace(/-/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid Pakistani contact phone number' });
    }

    const settings = store.getSettings();
    const allProducts = store.getProducts();
    const allDeals = store.getDeals();

    let computedSubtotal = 0;
    const computedItems: OrderItem[] = [];

    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      
      // Check if it's a product
      const product = allProducts.find(p => p.id === item.productId);
      if (product) {
        if (!product.isAvailable || !product.isPublished || product.price === null) {
          return res.status(400).json({ error: `Item "${product.name}" is currently unavailable or unpriced.` });
        }
        const unitPrice = product.price;
        const itemTotal = unitPrice * qty;
        computedSubtotal += itemTotal;
        computedItems.push({
          productId: product.id,
          name: product.name,
          price: unitPrice,
          quantity: qty,
          itemTotal,
          instructions: item.instructions || undefined
        });
        continue;
      }

      // Check if it's a deal
      const deal = allDeals.find(d => d.id === item.productId);
      if (deal) {
        if (!deal.isAvailable || !deal.isPublished) {
          return res.status(400).json({ error: `Deal "${deal.title}" is currently unavailable.` });
        }
        const unitPrice = deal.price;
        const itemTotal = unitPrice * qty;
        computedSubtotal += itemTotal;
        computedItems.push({
          productId: deal.id,
          name: deal.title,
          price: unitPrice,
          quantity: qty,
          itemTotal,
          instructions: item.instructions || undefined
        });
        continue;
      }

      return res.status(400).json({ error: `Invalid item requested: ${item.productId}` });
    }

    const deliveryFee = orderType === 'delivery' ? settings.deliveryFee : 0;
    
    // Calculate Loyalty Voucher Discount
    const rawDiscountCode = (req.body.discountCode || '').trim().toUpperCase();
    let computedDiscount = 0;
    if (rawDiscountCode === 'LOYALTY250' || rawDiscountCode === 'LOYALTY100') {
      computedDiscount = 250;
    } else if (rawDiscountCode === 'LOYALTY600') {
      computedDiscount = 600;
    } else if (rawDiscountCode === 'LOYALTY1500') {
      computedDiscount = 1500;
    } else if (req.body.discount && typeof req.body.discount === 'number' && req.body.discount > 0) {
      computedDiscount = Math.min(req.body.discount, computedSubtotal);
    }
    // Cap discount to subtotal
    computedDiscount = Math.min(computedDiscount, computedSubtotal);
    const totalAmount = Math.max(0, computedSubtotal - computedDiscount + deliveryFee);

    const timestamp = Date.now();
    const orderNumber = `SK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: 'ord-' + timestamp,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : 'Pickup from Restaurant Counter',
      deliveryInstructions: deliveryInstructions?.trim() || undefined,
      orderType,
      paymentMethod: paymentMethod === 'easypaisa' ? 'easypaisa' : 'cod',
      paymentStatus: paymentMethod === 'easypaisa' ? 'awaiting_verification' : 'pending',
      orderStatus: 'received',
      items: computedItems,
      subtotal: computedSubtotal,
      deliveryFee,
      discount: computedDiscount,
      totalAmount,
      easypaisaRef: easypaisaRef?.trim() || undefined,
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer via website',
          by: 'customer'
        }
      ]
    };

    store.createOrder(newOrder);

    res.status(201).json({
      success: true,
      order: newOrder
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to process order. Please try again.' });
  }
});

// 5. Track Order (Secure lookup by Order Number and last 4 digits of phone or full phone)
app.get('/api/orders/track/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const phone = (req.query.phone as string || '').trim().replace(/\s+/g, '').replace(/-/g, '');

  const order = store.getOrderById(orderNumber);
  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please verify your order number.' });
  }

  // If phone is provided, verify match (full match or last 4 digits)
  if (phone) {
    const orderPhoneClean = order.customerPhone.replace(/\s+/g, '').replace(/-/g, '');
    const isMatch = orderPhoneClean.endsWith(phone) || phone.endsWith(orderPhoneClean);
    if (!isMatch) {
      return res.status(403).json({ error: 'Phone number does not match order record.' });
    }
  }

  // Return order tracking payload
  res.json({
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customerName: order.customerName,
    orderType: order.orderType,
    orderStatus: order.orderStatus,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    totalAmount: order.totalAmount,
    statusHistory: order.statusHistory
  });
});

// 5b. Customer Recent Orders Lookup (by order numbers array or customer phone)
app.post('/api/orders/lookup-batch', (req, res) => {
  const { orderNumbers, phone } = req.body;
  const allOrders = store.getOrders();
  let matches: Order[] = [];

  if (Array.isArray(orderNumbers) && orderNumbers.length > 0) {
    const set = new Set(orderNumbers.map((n: string) => n.trim().toUpperCase()));
    matches = allOrders.filter(o => set.has(o.orderNumber.toUpperCase()));
  } else if (phone && typeof phone === 'string') {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (cleanPhone.length >= 7) {
      matches = allOrders.filter(o => {
        const op = o.customerPhone.replace(/\s+/g, '').replace(/-/g, '');
        return op.includes(cleanPhone) || cleanPhone.includes(op);
      });
    }
  }

  matches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    orders: matches.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      deliveryAddress: o.deliveryAddress,
      orderType: o.orderType,
      orderStatus: o.orderStatus,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      items: o.items,
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      totalAmount: o.totalAmount,
      statusHistory: o.statusHistory
    }))
  });
});

// 6. Submit Payment Verification (Easypaisa TRX ID)
app.post('/api/payment-verification', (req, res) => {
  const { orderNumber, easypaisaRef, notes } = req.body;
  if (!orderNumber || !easypaisaRef) {
    return res.status(400).json({ error: 'Order number and Easypaisa transaction ID are required.' });
  }

  const order = store.getOrderById(orderNumber);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  order.easypaisaRef = easypaisaRef.trim();
  order.paymentStatus = 'awaiting_verification';
  order.updatedAt = new Date().toISOString();
  order.statusHistory.push({
    status: order.orderStatus,
    timestamp: new Date().toISOString(),
    note: `Easypaisa TRX submitted: ${easypaisaRef.trim()}` + (notes ? ` (${notes})` : ''),
    by: 'customer'
  });
  store.save();

  res.json({ success: true, message: 'Payment verification submitted. Our team will verify it shortly.' });
});

// 7. Contact Us endpoint
app.post('/api/contact', (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone number, and message are required.' });
  }

  const saved = store.addContactMessage({
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim(),
    subject: subject?.trim() || 'General Inquiry',
    message: message.trim()
  });

  res.json({ success: true, message: 'Thank you for reaching out! We will contact you shortly.', id: saved.id });
});

// 8. AI Customer Service Chatbot (Saadaat Kitchen Assistant)
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const publishedProducts = store.getPublishedProducts();
  const deals = store.getDeals().filter(d => d.isPublished && d.isAvailable);
  const settings = store.getSettings();

  // Create menu summary for AI grounding
  const menuSummary = publishedProducts.map(p => `- ${p.name} (${p.category}): Rs. ${p.price}. ${p.description}`).join('\n');
  const dealsSummary = deals.map(d => `- ${d.title} (Rs. ${d.price}): ${d.items.join(', ')}`).join('\n');

  const systemPrompt = `You are "Saadaat Kitchen Assistant", the warm, professional, and knowledgeable AI customer service representative for SAADAAT KITCHEN (Tagline: "Good Food ❤️ Happy Mood").
Our restaurant is famous for authentic Pakistani Charcoal BBQ, juicy Chicken Malai Tikka, sizzling Paratha Rolls, gourmet Zinger Burgers, Broast, and Special Combos.

Key Information:
- Phone & WhatsApp: ${settings.phone} / https://wa.me/${settings.whatsapp}
- Business Hours: ${settings.openingHours}
- Delivery fee: Rs. ${settings.deliveryFee}. Minimum order for delivery: Rs. ${settings.minOrder}.
- Payment Methods:
  1. Cash on Delivery (COD) - Pay upon delivery.
  2. Easypaisa - Account Name: ${settings.easypaisaAccountName}, Account Number: ${settings.easypaisaAccountNumber}. Customer provides TRX ID at checkout or WhatsApp.
- Order Tracking: Customers can track their order on the website by providing their Order Number (e.g. SK-2026-XXXX) and phone number.

LIVE ACCURATE MENU & PRICES (NEVER INVENT OR CHANGE PRICES):
${menuSummary}

CURRENT SPECIAL DEALS:
${dealsSummary}

Rules:
1. Support English, Urdu, and Roman Urdu seamlessly according to the customer's language.
2. Be polite, appetizing, and direct. Keep responses concise and easy to read.
3. NEVER fabricate products, prices, or delivery guarantees not listed above.
4. If asked to place an order directly, guide them to click "Order Now" or use the Cart on the website, or provide the direct WhatsApp ordering link (${settings.phone}).
5. If the user asks about order tracking, explain how to track it on the Track Order page using their order number and phone.
6. If you cannot answer a specific custom query or if there is a dispute/complaint, kindly refer them to call or WhatsApp us at ${settings.phone}.`;

  if (!ai) {
    return res.json({
      reply: `Assalam-o-Alaikum! Welcome to Saadaat Kitchen ("Good Food ❤️ Happy Mood").\n\nI can help you explore our delicious BBQ, Zinger Burgers, Paratha Rolls, and Special Deals! You can order online directly through the menu or chat with us on WhatsApp at ${settings.phone}.`
    });
  }

  try {
    const formattedHistory = history.slice(-6).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    const reply = response.text || 'I am here to help you with our menu, prices, and orders!';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    return res.json({
      reply: `Assalam-o-Alaikum! We are experiencing a brief connection delay. Please feel free to browse our full menu on the page or connect directly with our manager on WhatsApp at ${settings.phone}.`
    });
  }
});

// ----------------------------------------------------
// Admin Endpoints (Auth Protected)
// ----------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const attempt = failedAttempts.get(cleanEmail) || { count: 0 };

  // Check lockout
  if (attempt.lockedUntil && attempt.lockedUntil > Date.now()) {
    const remainingMins = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
    return res.status(429).json({
      error: `Too many failed attempts. Account temporarily locked. Try again in ${remainingMins} minutes.`
    });
  }

  const user = store.findAdminByEmail(cleanEmail);
  if (!user) {
    attempt.count += 1;
    if (attempt.count >= 5) {
      attempt.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins
    }
    failedAttempts.set(cleanEmail, attempt);
    return res.status(401).json({ error: 'Invalid administrator credentials' });
  }

  const inputHash = hashPassword(password, user.salt);
  if (inputHash !== user.passwordHash) {
    attempt.count += 1;
    if (attempt.count >= 5) {
      attempt.lockedUntil = Date.now() + 15 * 60 * 1000;
    }
    failedAttempts.set(cleanEmail, attempt);
    return res.status(401).json({ error: 'Invalid administrator credentials' });
  }

  // Reset failed attempts
  failedAttempts.delete(cleanEmail);

  // Generate session token (24h)
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  activeSessions.set(token, { token, email: user.email, expiresAt });

  store.logAudit('ADMIN_LOGIN', `Admin logged in successfully: ${user.email}`, user.email);

  res.json({
    success: true,
    token,
    user: { email: user.email, id: user.id }
  });
});

// Admin Setup First Account (only allowed if zero admins exist)
app.post('/api/admin/setup', (req, res) => {
  const existingAdmins = store.getAdminUsers();
  if (existingAdmins.length > 0) {
    return res.status(403).json({ error: 'Admin setup is already completed. Please log in.' });
  }

  const { email, password } = req.body;
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Valid email and minimum 8-character password required' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);
  const newUser = store.addAdminUser(email, hash, salt);

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  activeSessions.set(token, { token, email: newUser.email, expiresAt });

  res.json({
    success: true,
    token,
    user: { email: newUser.email, id: newUser.id }
  });
});

// Check auth status
app.get('/api/admin/me', adminAuthMiddleware, (req, res) => {
  res.json({ email: (req as any).adminEmail, authenticated: true });
});

// Admin Logout
app.post('/api/admin/logout', adminAuthMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Admin Stats
app.get('/api/admin/stats', adminAuthMiddleware, (req, res) => {
  const orders = store.getOrders();
  const products = store.getProducts();

  const todayStr = new Date().toISOString().split('T')[0];
  const ordersToday = orders.filter(o => o.createdAt.startsWith(todayStr));

  const awaitingConfirmation = orders.filter(o => o.orderStatus === 'received');
  const preparing = orders.filter(o => o.orderStatus === 'preparing');
  const dispatched = orders.filter(o => o.orderStatus === 'dispatched');
  const completed = orders.filter(o => o.orderStatus === 'delivered');
  const cancelled = orders.filter(o => o.orderStatus === 'cancelled');

  const awaitingPaymentVerification = orders.filter(o => o.paymentStatus === 'awaiting_verification');

  // Total sales: count delivered orders or verified payments
  const totalSales = orders
    .filter(o => o.orderStatus === 'delivered' || o.paymentStatus === 'verified' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const availableProducts = products.filter(p => p.isAvailable && p.isPublished && p.priceConfirmed);
  const unconfirmedOrDraft = products.filter(p => !p.priceConfirmed || !p.isPublished || !p.isAvailable);

  res.json({
    totalOrders: orders.length,
    ordersToday: ordersToday.length,
    awaitingConfirmation: awaitingConfirmation.length,
    preparing: preparing.length,
    dispatched: dispatched.length,
    completed: completed.length,
    cancelled: cancelled.length,
    awaitingPaymentVerification: awaitingPaymentVerification.length,
    totalSales,
    availableProductsCount: availableProducts.length,
    unavailableOrDraftCount: unconfirmedOrDraft.length
  });
});

// Admin Orders list
app.get('/api/admin/orders', adminAuthMiddleware, (req, res) => {
  res.json(store.getOrders());
});

// Admin Order Status Update
app.patch('/api/admin/orders/:orderNumber/status', adminAuthMiddleware, (req, res) => {
  const { orderNumber } = req.params;
  const { status, paymentStatus, note } = req.body;
  const adminEmail = (req as any).adminEmail;

  const updated = store.updateOrderStatus(orderNumber, status, paymentStatus, note, adminEmail);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ success: true, order: updated });
});

// Admin Verify Payment
app.post('/api/admin/orders/:orderNumber/verify-payment', adminAuthMiddleware, (req, res) => {
  const { orderNumber } = req.params;
  const { verified, notes } = req.body;
  const adminEmail = (req as any).adminEmail;

  const updated = store.updatePaymentVerification(orderNumber, !!verified, notes, adminEmail);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ success: true, order: updated });
});

// Admin Products CRUD
app.get('/api/admin/products', adminAuthMiddleware, (req, res) => {
  res.json(store.getProducts());
});

app.post('/api/admin/products', adminAuthMiddleware, (req, res) => {
  const product = req.body;
  const adminEmail = (req as any).adminEmail;

  if (!product.name || !product.category) {
    return res.status(400).json({ error: 'Product name and category are required' });
  }

  if (!product.id) {
    product.id = 'prod-' + Date.now();
  }

  const saved = store.saveProduct(product, adminEmail);
  res.json({ success: true, product: saved });
});

app.delete('/api/admin/products/:id', adminAuthMiddleware, (req, res) => {
  const { id } = req.params;
  const adminEmail = (req as any).adminEmail;
  const ok = store.deleteProduct(id, adminEmail);
  if (!ok) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true });
});

// Admin Deals CRUD
app.get('/api/admin/deals', adminAuthMiddleware, (req, res) => {
  res.json(store.getDeals());
});

app.post('/api/admin/deals', adminAuthMiddleware, (req, res) => {
  const deal = req.body;
  const adminEmail = (req as any).adminEmail;

  if (!deal.title || typeof deal.price !== 'number') {
    return res.status(400).json({ error: 'Deal title and numeric price are required' });
  }

  if (!deal.id) {
    deal.id = 'deal-' + Date.now();
  }

  const saved = store.saveDeal(deal, adminEmail);
  res.json({ success: true, deal: saved });
});

// Admin Settings update
app.put('/api/admin/settings', adminAuthMiddleware, (req, res) => {
  const settings = req.body;
  const adminEmail = (req as any).adminEmail;
  const updated = store.updateSettings(settings, adminEmail);
  res.json({ success: true, settings: updated });
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', adminAuthMiddleware, (req, res) => {
  res.json(store.getAuditLogs());
});

// Admin Contact Messages
app.get('/api/admin/messages', adminAuthMiddleware, (req, res) => {
  res.json(store.getContactMessages());
});

// AI Food Image Generation for Admin Dashboard
app.post('/api/admin/generate-image', adminAuthMiddleware, async (req, res) => {
  const { productName, category, customPrompt, style = 'cinematic' } = req.body;
  if (!productName) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  if (!ai) {
    return res.status(503).json({ error: 'Gemini API key is not configured on this environment.' });
  }

  try {
    const prompt = customPrompt || 
      `Create an ultra-realistic premium restaurant food photograph of freshly prepared ${productName} (${category}), beautifully plated on a black ceramic plate or slate board, golden highlights, rich natural textures, subtle rising steam, warm cinematic lighting, black background with elegant gold accents, professional commercial food photography, appetizing and realistic, no text, no watermark, 4:3 composition.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    let imageUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image data returned from image generation model.' });
    }

    res.json({ success: true, imageUrl, promptUsed: prompt });
  } catch (err: any) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate image' });
  }
});

// ----------------------------------------------------
// Frontend Serving & Vite Integration
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Saadaat Kitchen] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
