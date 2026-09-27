import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FIRMS, CATEGORIES, BRANDS, PRODUCTS, PRODUCT_STOCKS } from '../../data/mockData';
import { FirmId } from '../../types';
import { ProductSilhouette } from '../common/BrandVisuals';
import { KamalLogo } from '../common/KamalLogo';

export const FirmCatalogueView: React.FC = () => {
  const {
    publicFirm,
    setPublicFirm,
    categoryFilter,
    setCategoryFilter,
    setSelectedProduct,
    navigateToHome,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');

  const firm = FIRMS[publicFirm];
  const isEnterprises = publicFirm === 'kamal-enterprises';

  // Categories applicable to this firm
  const availableCategories = useMemo(() => {
    return CATEGORIES.filter((c) => c.applicableFirms.includes(publicFirm));
  }, [publicFirm]);

  // Brands applicable to this firm
  const availableBrands = useMemo(() => {
    return BRANDS.filter((b) => b.applicableFirms.includes(publicFirm));
  }, [publicFirm]);

  // Filter products for this firm
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Must be applicable to current firm
      if (!product.applicableFirms.includes(publicFirm)) return false;

      // Category filter
      if (categoryFilter !== 'all' && product.categoryId !== categoryFilter) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          product.barcode.includes(q) ||
          product.subtitle.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Stock filter
      if (inStockOnly) {
        const stockRecord = PRODUCT_STOCKS.find(
          (s) => s.productId === product.id && s.firmId === publicFirm
        );
        if (!stockRecord || stockRecord.currentStock <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.indicativePrice - b.indicativePrice;
      if (sortBy === 'price_high') return b.indicativePrice - a.indicativePrice;
      return 0; // featured default
    });
  }, [publicFirm, categoryFilter, selectedBrand, searchQuery, inStockOnly, sortBy]);

  const switchFirm = (target: FirmId) => {
    setPublicFirm(target);
    setCategoryFilter('all');
    setSelectedBrand('all');
    window.location.hash = `#catalogue/${target}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Firm Header Sub-Banner */}
      <div
        className={`border-b transition-colors ${
          isEnterprises
            ? 'bg-gradient-to-r from-[#781D22]/10 via-[#FAF8F5] to-[#FAF8F5] border-[#781D22]/20'
            : 'bg-gradient-to-r from-stone-900/10 via-[#FAF8F5] to-[#FAF8F5] border-stone-300'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={navigateToHome}
                type="button"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to KAMAL Main Page</span>
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
                  Public Commercial Catalogue
                </span>
                <span className="text-stone-300">·</span>
                <span
                  className={`text-[11px] font-semibold ${
                    isEnterprises ? 'text-[#781D22]' : 'text-stone-800'
                  }`}
                >
                  No Customer Login Required
                </span>
              </div>

              <div className="mt-1">
                <KamalLogo
                  size="xl"
                  variant="light"
                  showSubtitle={true}
                  subtitleText={firm.name.toUpperCase()}
                />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-2xl font-light">
                {firm.description}
              </p>
            </div>

            {/* Sister firm switch toggle */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs shrink-0">
              <button
                onClick={() => switchFirm('kamal-enterprises')}
                type="button"
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isEnterprises
                    ? 'bg-[#781D22] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Kamal Enterprises
              </button>
              <button
                onClick={() => switchFirm('kamal-industries')}
                type="button"
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  !isEnterprises
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Kamal Industries
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Products Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search and sort toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-6 border-b border-stone-200">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, brand, SKU or barcode..."
              className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
            />
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Brand select */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-10 px-3 rounded-xl border border-stone-300 bg-white text-stone-700 focus:outline-none"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Sort order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 rounded-xl border border-stone-300 bg-white text-stone-700 focus:outline-none"
            >
              <option value="featured">Featured Order</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>

            {/* In stock toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              type="button"
              className={`h-10 px-3 rounded-xl border flex items-center gap-1.5 transition-all ${
                inStockOnly
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>In Showroom Only</span>
            </button>
          </div>
        </div>

        {/* Category Tabs (Segmented Buttons) */}
        <div className="py-4 overflow-x-auto no-scrollbar flex items-center gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              categoryFilter === 'all'
                ? isEnterprises
                  ? 'bg-[#781D22] text-white shadow-xs'
                  : 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/80'
            }`}
          >
            All Categories ({filteredProducts.length})
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? isEnterprises
                    ? 'bg-[#781D22] text-white shadow-xs'
                    : 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Count Unboxed Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-500 py-3">
          <span>
            Showing <strong className="text-stone-900 tabular-nums">{filteredProducts.length}</strong> items in{' '}
            <strong className="text-stone-900">{firm.name}</strong>
          </span>
          {categoryFilter !== 'all' && (
            <button
              onClick={() => setCategoryFilter('all')}
              className="text-[#781D22] hover:underline"
            >
              Clear category filter
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 my-6">
            <p className="text-stone-600 text-sm">No items found matching your filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('all');
                setCategoryFilter('all');
                setInStockOnly(false);
              }}
              type="button"
              className="mt-3 text-xs font-medium text-[#781D22] underline"
            >
              Reset all catalogue filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {filteredProducts.map((product) => {
              const stock = PRODUCT_STOCKS.find(
                (s) => s.productId === product.id && s.firmId === publicFirm
              );
              const inStock = stock && stock.currentStock > 0;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all cursor-pointer text-left"
                >
                  {/* Image Carrier */}
                  <div className="relative aspect-4/3 w-full bg-stone-50 border-b border-stone-100 overflow-hidden">
                    <ProductSilhouette type={product.categoryId} name={product.name} />

                    <div className="absolute top-3 left-3 text-[10px] font-medium px-2 py-0.5 rounded-sm bg-white/90 text-stone-700 shadow-2xs backdrop-blur-xs">
                      {product.brand}
                    </div>

                    <div
                      className={`absolute top-3 right-3 text-[10px] font-mono tracking-tight px-2 py-0.5 rounded-sm backdrop-blur-xs ${
                        inStock
                          ? 'bg-emerald-900/80 text-emerald-100'
                          : 'bg-stone-900/80 text-stone-200'
                      }`}
                    >
                      {inStock ? 'In Showroom' : 'Available on Order'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[#781D22] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {product.subtitle}
                      </p>

                      {/* Quiet 2-bullet feature snippet */}
                      <div className="mt-3 space-y-1 text-[11px] text-stone-600">
                        {product.features.slice(0, 2).map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-stone-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-serif font-bold text-stone-900 tabular-nums">
                          ₹{product.indicativePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-stone-400 line-through tabular-nums">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 group-hover:text-stone-950">
                        <span>View Specs</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
