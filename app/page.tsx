'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface Deal {
  itemId: string;
  title: string;
  price?: { value: string; currency: string };
  itemWebUrl?: string;
  image?: { imageUrl: string };
  additionalImages?: { imageUrl: string }[];
}

export default function FlipCultureHome() {
  const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('sneakers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // Helper to extract working product image URL
  const getItemImageUrl = (item: Deal) => {
    if (item.image?.imageUrl) return item.image.imageUrl;
    if (item.additionalImages && item.additionalImages.length > 0) {
      return item.additionalImages[0].imageUrl;
    }
    return '/logo.png'; // Fallback image if eBay returns no thumbnail
  };

  // Direct, safe affiliate URL builder
  const getAffiliateUrl = (itemWebUrl?: string) => {
    if (!itemWebUrl) return 'https://www.ebay.com';

    const cleanUrl = itemWebUrl.split('?')[0];
    const campaignId = process.env.NEXT_PUBLIC_EPN_CAMPAIGN_ID || '';

    if (campaignId && campaignId.trim() !== '') {
      return `${cleanUrl}?mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=${campaignId.trim()}&toolid=10001&customid=flipculture`;
    }

    return cleanUrl;
  };

  // Load Top Featured Vault Items (Locked to 3 items)
  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/deals?featured=true');
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeaturedDeals(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured deals:', err);
      }
    }
    loadFeatured();
  }, []);

  // Load Main Feed Items
  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      try {
        const endpoint = activeSearch
          ? `/api/deals?q=${encodeURIComponent(activeSearch)}`
          : `/api/deals?category=${activeCategory}`;

        const res = await fetch(endpoint);
        const data = await res.json();
        setDeals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load category deals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, [activeCategory, activeSearch]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery);
    }
  };

  const handleCategorySelect = (id: string) => {
    setSearchQuery('');
    setActiveSearch('');
    setActiveCategory(id);
  };

  // Client-Side Netlify Form Submission
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });
      setFormSubmitted(true);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans scroll-smooth selection:bg-purple-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-2.5 text-center text-xs font-black uppercase tracking-widest flex justify-between px-6 items-center flex-wrap gap-2 shadow-md">
        <span className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          ⚡ LIVE VAULT DROP: REAL-TIME MARKETPLACE STREAMING
        </span>
        <div className="flex gap-6 mx-auto sm:mx-0 font-bold">
          <Link href="/blog" className="hover:text-neutral-200 transition underline underline-offset-4">
            Legit Check Blog
          </Link>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-200 transition"
          >
            Facebook Hub
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 border-b border-neutral-800/80 flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-md sticky top-0 z-50 bg-neutral-950/80">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <img
              src="/logo.png"
              alt="Flip Culture Logo"
              className="relative h-14 w-14 rounded-full border border-neutral-800 object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight italic bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-500">
              FLIP CULTURE
            </h1>
            <p className="text-neutral-400 text-[10px] font-bold tracking-widest uppercase mt-0.5">
              CURATED GRAILS • TECH • STREETWEAR
            </p>
          </div>
        </div>

        <nav className="flex gap-8 text-xs font-black uppercase tracking-widest items-center flex-wrap justify-center">
          <a href="#featured" className="text-neutral-400 hover:text-purple-400 transition">
            Featured
          </a>
          <a href="#feed" className="text-neutral-400 hover:text-purple-400 transition">
            Live Feed
          </a>
          <a href="#about" className="text-neutral-400 hover:text-purple-400 transition">
            About
          </a>
          <a href="#contact" className="text-neutral-400 hover:text-purple-400 transition">
            Contact
          </a>
          <Link href="/blog" className="text-neutral-400 hover:text-purple-400 transition">
            Blog
          </Link>
        </nav>
      </header>

      {/* HERO / FEATURED SECTION (Locked to 3 Items) */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-purple-400 font-bold text-xs uppercase tracking-widest block mb-1">
              PROMOTED SELECTION
            </span>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              🔥 The Vault Top 3 Drops
            </h2>
          </div>
          <p className="text-neutral-400 text-xs max-w-md">
            Hand-picked verified grails with real-time valuation metrics. Updated daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDeals.map((item, idx) => (
            <div
              key={item.itemId}
              className="relative group bg-neutral-900/90 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-2xl hover:border-purple-500 transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="relative z-10">
                <a
                  href={getAffiliateUrl(item.itemWebUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-56 bg-neutral-950 rounded-xl overflow-hidden mb-4 border border-neutral-800/80 flex items-center justify-center p-4 relative"
                >
                  <img
                    src={getItemImageUrl(item)}
                    alt={item.title}
                    className="h-full w-full object-contain group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase shadow-md">
                    VAULT #{idx + 1}
                  </span>
                </a>

                <a
                  href={getAffiliateUrl(item.itemWebUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-base line-clamp-2 text-white hover:text-purple-400 transition leading-snug"
                >
                  {item.title}
                </a>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    CURRENT VALUE
                  </span>
                  <span className="text-xl font-black text-emerald-400">
                    ${item.price?.value || 'N/A'}
                  </span>
                </div>

                <a
                  href={getAffiliateUrl(item.itemWebUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 uppercase tracking-wider"
                >
                  View Drop ➔
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH & CATEGORY FEED */}
      <section id="feed" className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black tracking-tight mb-2">Explore The Live Catalog</h2>
          <p className="text-neutral-400 text-xs">
            Query thousands of live marketplace listings with instant authenticity filters applied.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-3 mb-10">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grails (e.g. 'Jordan 4', 'RTX 4090')..."
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl px-5 py-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:opacity-90 transition shadow-lg shadow-purple-600/20"
          >
            Search
          </button>
        </form>

        {/* Category Selector Buttons */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {[
            { id: 'sneakers', label: '👟 Sneakers' },
            { id: 'streetwear', label: '🔥 Streetwear' },
            { id: 'laptops', label: '💻 Laptops' },
            { id: 'handhelds', label: '🎮 Handhelds' },
            { id: 'battlestation', label: '🎧 Battlestation' },
            { id: 'collectibles', label: '📦 Collectibles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleCategorySelect(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === tab.id && !activeSearch
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 scale-105'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Catalog Feed */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-neutral-900/50 animate-pulse rounded-2xl border border-neutral-800/80"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map((item) => (
              <div
                key={item.itemId}
                className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-700 hover:bg-neutral-900 transition duration-300 group"
              >
                <div>
                  <a
                    href={getAffiliateUrl(item.itemWebUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-48 w-full bg-neutral-950 rounded-xl overflow-hidden mb-4 border border-neutral-800/80 flex items-center justify-center block"
                  >
                    <img
                      src={getItemImageUrl(item)}
                      alt={item.title}
                      className="h-full w-full object-contain p-3 group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-black/80 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                      VERIFIED
                    </span>
                  </a>

                  <a
                    href={getAffiliateUrl(item.itemWebUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-sm line-clamp-2 text-neutral-200 hover:text-purple-400 transition"
                  >
                    {item.title}
                  </a>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase text-neutral-500 block">
                      BUY IT NOW
                    </span>
                    <span className="text-lg font-black text-emerald-400">
                      ${item.price?.value || 'N/A'}
                    </span>
                  </div>

                  <a
                    href={getAffiliateUrl(item.itemWebUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-neutral-200 text-black text-xs font-black px-4 py-2 rounded-xl transition uppercase tracking-wider"
                  >
                    View Drop
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800/80 py-12 text-center text-neutral-500 text-xs">
        <p>© {new Date().getFullYear()} Flip Culture. All rights reserved.</p>
      </footer>
    </main>
  );
}
