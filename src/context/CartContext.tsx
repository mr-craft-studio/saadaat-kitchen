import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Deal } from '../types/index.ts';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Product | Deal, quantity?: number, instructions?: string) => void;
  reorderItems: (items: { productId: string; name: string; price: number; quantity: number; instructions?: string; image?: string; category?: string }[]) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateInstructions: (productId: string, instructions: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('saadaat_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('saadaat_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  const addToCart = (item: Product | Deal, quantity: number = 1, instructions?: string) => {
    // If it's a product without confirmed price, do not allow adding
    if ('priceConfirmed' in item && (!item.priceConfirmed || item.price === null)) {
      return;
    }

    const price = item.price;
    if (price === null || price === undefined) return;

    const name = 'name' in item ? item.name : item.title;
    const category = 'category' in item ? item.category : 'deals';

    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.productId === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (instructions) {
          updated[existingIndex].specialInstructions = instructions;
        }
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: item.id,
            name,
            price,
            quantity,
            image: item.image,
            category,
            specialInstructions: instructions
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const reorderItems = (items: { productId: string; name: string; price: number; quantity: number; instructions?: string; image?: string; category?: string }[]) => {
    if (!items || items.length === 0) return;

    setCart(prev => {
      const updated = [...prev];
      for (const item of items) {
        const existingIndex = updated.findIndex(i => i.productId === item.productId);
        if (existingIndex >= 0) {
          updated[existingIndex].quantity += item.quantity;
          if (item.instructions) {
            updated[existingIndex].specialInstructions = item.instructions;
          }
        } else {
          updated.push({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
            category: item.category || 'general',
            specialInstructions: item.instructions
          });
        }
      }
      return updated;
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const updateInstructions = (productId: string, instructions: string) => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, specialInstructions: instructions } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        reorderItems,
        removeFromCart,
        updateQuantity,
        updateInstructions,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
