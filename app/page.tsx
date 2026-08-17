'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Deal {
  itemId: string;
  title: string;
  price: { value: string; currency: string };
  itemWebUrl: string;
  image?: { imageUrl: string };
}

export default function FlipCultureHome() {
  const [activeCategory, setActiveCategory] = useState<string>('sneakers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        console.error(err);
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

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 text-center text-xs font-bold uppercase tracking-widest">
        ⚡ Next Vault Drop: Friday @ 6 PM EST | Real-Time Verified Inventory
      </div>

      {/* Header & Search Engine */}
      <header className="max-w-7xl mx-auto px-6 py-10 text-center border-b border-neutral-800">
        <h1 className="text-5xl font-extrabold tracking-tight italic bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
          FLIP CULTURE
        </h1>
        <p className="mt-2 text-neutral-400 max-w-xl mx-auto text-sm">
          Curated streetwear grails, high-spec gaming rigs, and rare drops.
        </p>

        {/* Live Search Form */}
        <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specific grails (e.g. 'Jordan 4 Black Cat', 'RTX 4090')..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="submit"
            className="bg-white text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-neutral-200 transition"
          >
            Search
          </button>
        </form>

        {/* Expanded Category Selector */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
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
      </header>

      {/* Grid Display */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {activeSearch && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-neutral-400">
              Showing search results for: <span className="text-white font-bold">"{activeSearch}"</span>
            </p>
            <button
              onClick={() => handleCategorySelect('sneakers')}
              className="text-xs text-purple-400 hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-900 animate-pulse rounded-xl border border-neutral-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map((item) => {
              const epnUrl = `https://www.ebay.com/itm/redirect?target=${encodeURIComponent(
                item.itemWebUrl
              )}&mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=${process.env.NEXT_PUBLIC_EPN_CAMPAIGN_ID || ''}&toolid=10001`;

              return (
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
                      <span className="text-[10px] uppercase text-neutral-500 block">Buy It Now</span>
                      <span className="text-lg font-extrabold text-emerald-400">
                        ${item.price?.value || 'N/A'}
                      </span>
                    </div>

                    <a
                      href={epnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-4 py-2 rounded-lg transition"
                    >
                      View Drop
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
