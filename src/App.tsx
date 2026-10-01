/**
 * KAMAL BUSINESS — Commercial Application
 * Kamal Enterprises & Kamal Industries
 * Dual-Firm Separable Architecture & Progressive Web App
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/public/Header';
import { Hero } from './components/public/Hero';
import { FirmsSection } from './components/public/FirmsSection';
import { CategoryStrip } from './components/public/CategoryStrip';
import { FeaturedProducts } from './components/public/FeaturedProducts';
import { ServiceSection } from './components/public/ServiceSection';
import { TrustSection } from './components/public/TrustSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { FirmCatalogueView } from './components/catalogue/FirmCatalogueView';
import { ProductDetailModal } from './components/catalogue/ProductDetailModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

function MainRouter() {
  const { view, currentUser, setShowLoginModal } = useApp();

  // STRICT PRIVATE ROUTE: Only an authenticated Admin or authorized staff user may access
  if (view === 'admin') {
    if (!currentUser) {
      // Unauthenticated access attempt: Redirect to Admin Login immediately
      return (
        <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
          <Header />
          <AdminLoginModal />
          <Footer />
          <OfflineIndicator />
        </div>
      );
    }
    return (
      <>
        <AdminLayout />
        <OfflineIndicator />
      </>
    );
  }

  if (view === 'catalogue') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Header />
        <div className="flex-1">
          <FirmCatalogueView />
        </div>
        <Footer />
        <ProductDetailModal />
        <AdminLoginModal />
        <OfflineIndicator />
      </div>
    );
  }

  // Default 'landing' view (Matching Approved Reference Image Top-to-Bottom)
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Header />
      <main className="flex-1">
        {/* 1. Large Photographic Hero */}
        <Hero />

        {/* 2. Kamal Enterprises + Kamal Industries Division Cards */}
        <FirmsSection />

        {/* 3. Compact Category/Service Discovery Row */}
        <CategoryStrip />

        {/* 4. Large Expert Service & Repair Photographic Section */}
        <ServiceSection />
      </main>
      {/* 5. Contact / Business Info & Premium Footer */}
      <Footer />

      <ProductDetailModal />
      <AdminLoginModal />
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
