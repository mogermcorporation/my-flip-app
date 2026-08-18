'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface Deal {
  itemId: string;
  title: string;
  price?: { value: string; currency: string };
  itemWebUrl?: string;
  image?: { imageUrl: string };
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

  // Helper function to build working eBay affiliate URLs
  const getAffiliateUrl = (itemWebUrl?: string) => {
    if (!itemWebUrl) return 'https://www.ebay.com';
    const campaignId = process.env.NEXT_PUBLIC_EPN_CAMPAIGN_ID || '';
    if (campaignId) {
      return `https://www.ebay.com/itm/redirect?target=${encodeURIComponent(
        itemWebUrl
      )}&mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=${campaignId}&toolid=10001`;
    }
    return itemWebUrl;
  };

  // Load Top Featured Vault Items
  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/deals?featured=true');
        const data = await res.json();
        setFeaturedDeals(Array.isArray(data) ? data : []);
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
    <main className="min-h-screen bg-neutral-950 text-white font-sans scroll-smooth">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 text-center text-xs font-bold uppercase tracking-widest flex justify-between px-6 items-center flex-wrap gap-2">
        <span>⚡ Next Vault Drop: Friday @ 6 PM EST | Verified Authentic Gear</span>
        <div className="flex gap-4 mx-auto sm:mx-0">
          <Link href="/blog" className="underline hover:text-neutral-200 transition">
            Flip Blog
          </Link>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-200 transition"
          >
            Facebook Community
          </a>
        </div>
      </div>

      {/* Semantic Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 border-b border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Flip Culture Logo"
            className="h-14 w-14 rounded-full border border-purple-500/30 shadow-lg shadow-purple-600/20 object-cover"
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight italic bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-purple-400">
              FLIP CULTURE
            </h1>
            <p className="text-neutral-400 text-xs mt-0.5 font-medium tracking-wide">
              TECH • GAMING • STREETWEAR • DEALS
            </p>
          </div>
        </div>

        <nav className="flex gap-6 text-xs font-bold uppercase tracking-wider items-center flex-wrap justify-center">
          <a href="#featured" className="text-neutral-400 hover:text-white transition">
            Featured
          </a>
          <a href="#about" className="text-neutral-400 hover:text-white transition">
            About
          </a>
          <a href="#contact" className="text-neutral-400 hover:text-white transition">
            Email Us
          </a>
          <Link href="/blog" className="text-neutral-400 hover:text-white transition">
            Blog
          </Link>
        </nav>
      </header>

      {/* FEATURED SECTION */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            🔥 Featured Vault Drops
            <span className="text-xs bg-purple-600 px-2 py-0.5 rounded text-white font-normal uppercase">
              Top Picked
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDeals.map((item) => (
            <div
              key={item.itemId}
              className="bg-neutral-900 border-2 border-purple-600/50 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-purple-900/20 hover:border-purple-500 transition"
            >
              <div>
                <div className="h-44 bg-neutral-950 rounded-lg overflow-hidden mb-3 border border-neutral-800 flex items-center justify-center p-2 relative">
                  {item.image ? (
                    <img
                      src={item.image.imageUrl}
                      alt={item.title}
                      className="h-full object-contain"
                    />
                  ) : (
                    <span className="text-neutral-600 text-xs">Featured Item</span>
                  )}
                  <span className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    VAULT PICK
                  </span>
                </div>
                <h3 className="font-bold text-sm line-clamp-2 text-white">
                  {item.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-lg font-extrabold text-emerald-400">
                  ${item.price?.value || 'N/A'}
                </span>
                <a
                  href={getAffiliateUrl(item.itemWebUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  View Drop
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH & CATEGORY FEED */}
      <section className="max-w-7xl mx-auto px-6 py-10 border-t border-neutral-800">
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specific grails (e.g. 'Jordan 4', 'RTX 4090')..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="submit"
            className="bg-white text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-neutral-200 transition"
          >
            Search
          </button>
        </form>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
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
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeCategory === tab.id && !activeSearch
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-neutral-900 animate-pulse rounded-xl border border-neutral-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map((item) => (
              <div
                key={item.itemId}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition group"
              >
                <div>
                  <div className="relative h-48 w-full bg-neutral-950 rounded-lg overflow-hidden mb-4 border border-neutral-800 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-contain p-2 group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <span className="text-neutral-600 text-xs">No Image</span>
                    )}
                    <span className="absolute top-2 left-2 bg-black/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      VERIFIED
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm line-clamp-2 text-neutral-200 group-hover:text-white">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 block">
                      Buy It Now
                    </span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      ${item.price?.value || 'N/A'}
                    </span>
                  </div>

                  <a
                    href={getAffiliateUrl(item.itemWebUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-4 py-2 rounded-lg transition"
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
      <footer className="border-t border-neutral-800 py-12 text-center text-neutral-500 text-xs">
        <p>© {new Date().getFullYear()} Flip Culture. All rights reserved.</p>
      </footer>
    </main>
  );
}
