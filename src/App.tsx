/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Product, Deal, Order, ProductCategory } from './types/index.ts';

// Components
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton.tsx';
import { AIChatbot } from './components/AIChatbot.tsx';
import { MobileBottomBar } from './components/MobileBottomBar.tsx';

// Views
import { HomeView } from './views/HomeView.tsx';
import { MenuView } from './views/MenuView.tsx';
import { CheckoutView } from './views/CheckoutView.tsx';
import { OrderConfirmationView } from './views/OrderConfirmationView.tsx';
import { TrackOrderView } from './views/TrackOrderView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { FAQView } from './views/FAQView.tsx';
import { PrivacyView, TermsView, RefundView, NotFoundView } from './views/PolicyViews.tsx';
import { AdminLoginView } from './views/AdminLoginView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { RecentOrdersView } from './views/RecentOrdersView.tsx';
import { UserProfileView } from './views/UserProfileView.tsx';

function MainApp() {
  const { isAuthenticated } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch initial public products and deals
  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, dealRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/deals')
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (dealRes.ok) setDeals(await dealRes.json());
      } catch (e) {
        console.error('Failed to load menu data:', e);
      }
    }
    fetchData();
  }, [currentView]);

  // Sync window hash or routing if appropriate
  const handleNavigate = (view: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  const handleTrackOrderFromConfirmation = (orderNum: string) => {
    setTrackingOrderNumber(orderNum);
    handleNavigate('track-order');
  };

  const handleOrderSuccess = (order: Order) => {
    setLastPlacedOrder(order);
    handleNavigate('order-confirmation');
  };

  // Check if current view is admin dashboard
  if (currentView === 'admin-dashboard') {
    if (!isAuthenticated) {
      return (
        <AdminLoginView
          onLoginSuccess={() => setCurrentView('admin-dashboard')}
          onBackToWebsite={() => setCurrentView('home')}
        />
      );
    }
    return (
      <AdminDashboardView
        onBackToWebsite={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'admin-login') {
    return (
      <AdminLoginView
        onLoginSuccess={() => setCurrentView('admin-dashboard')}
        onBackToWebsite={() => setCurrentView('home')}
      />
    );
  }

  // Determine active view content
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            products={products}
            deals={deals}
            onSelectCategory={(catId) => {
              handleNavigate(catId);
            }}
            onOpenDetails={(p) => setSelectedProduct(p)}
            onNavigate={handleNavigate}
          />
        );

      case 'menu':
        return (
          <MenuView
            products={products}
            deals={deals}
            initialCategory="all"
            onOpenDetails={(p) => setSelectedProduct(p)}
          />
        );

      // Specific Category Pages
      case 'tikka-bbq':
      case 'rolls':
      case 'burgers':
      case 'sandwiches':
      case 'fried-chicken':
      case 'fries-sides':
      case 'deals':
        return (
          <MenuView
            products={products}
            deals={deals}
            initialCategory={currentView as ProductCategory}
            onOpenDetails={(p) => setSelectedProduct(p)}
          />
        );

      case 'checkout':
      case 'cart':
        return (
          <CheckoutView
            onBackToMenu={() => handleNavigate('menu')}
            onOrderSuccess={handleOrderSuccess}
          />
        );

      case 'order-confirmation':
        if (!lastPlacedOrder) {
          return (
            <NotFoundView onBackToMenu={() => handleNavigate('menu')} />
          );
        }
        return (
          <OrderConfirmationView
            order={lastPlacedOrder}
            onTrackOrder={handleTrackOrderFromConfirmation}
            onBackToMenu={() => handleNavigate('menu')}
            onViewRecentOrders={() => handleNavigate('recent-orders')}
          />
        );

      case 'track-order':
        return (
          <TrackOrderView
            initialOrderNumber={trackingOrderNumber}
            onBackToMenu={() => handleNavigate('menu')}
            onViewRecentOrders={() => handleNavigate('recent-orders')}
          />
        );

      case 'recent-orders':
        return (
          <RecentOrdersView
            onNavigate={handleNavigate}
            onTrackOrder={handleTrackOrderFromConfirmation}
          />
        );

      case 'profile':
      case 'loyalty':
        return (
          <UserProfileView
            onNavigate={handleNavigate}
            onTrackOrder={handleTrackOrderFromConfirmation}
          />
        );

      case 'about':
        return <AboutView onNavigate={handleNavigate} />;

      case 'contact':
        return <ContactView />;

      case 'faq':
        return <FAQView />;

      case 'privacy':
        return <PrivacyView onBackToMenu={() => handleNavigate('menu')} />;

      case 'terms':
        return <TermsView onBackToMenu={() => handleNavigate('menu')} />;

      case 'refund':
        return <RefundView onBackToMenu={() => handleNavigate('menu')} />;

      default:
        return <NotFoundView onBackToMenu={() => handleNavigate('menu')} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {renderView()}
      </main>

      {/* Global Luxury Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => handleNavigate('checkout')}
      />

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Floating AI Customer Support Assistant */}
      <AIChatbot onNavigate={handleNavigate} />

      {/* Native App-like Mobile Bottom Navigation Bar */}
      <MobileBottomBar currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
