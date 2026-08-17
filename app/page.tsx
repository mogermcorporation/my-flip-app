'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface Deal {
  itemId: string;
  title: string;
  price: { value: string; currency: string };
  itemWebUrl: string;
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

      {/* Semantic Header With Brand Logo */}
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
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Facebook Page
          </a>
        </nav>
      </header>

      {/* TOP FEATURED SECTION */}
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
          {featuredDeals.map((item) => {
            const epnUrl = `https://www.ebay.com/itm/redirect?target=${encodeURIComponent(
              item.itemWebUrl
            )}&mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=${
              process.env.NEXT_PUBLIC_EPN_CAMPAIGN_ID || ''
            }&toolid=10001`;

            return (
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
                    href={epnUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                  >
                    View Featured
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEARCH & CATEGORY FEED SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-10 border-t border-neutral-800">
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2 mb-8">
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

        {activeSearch && (
          <div className="mb-6 flex items-center justify-between max-w-xl mx-auto bg-neutral-900 p-3 rounded-lg border border-neutral-800">
            <p className="text-xs text-neutral-400">
              Results for: <span className="text-white font-bold">"{activeSearch}"</span>
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
              <div
                key={i}
                className="h-80 bg-neutral-900 animate-pulse rounded-xl border border-neutral-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map((item) => {
              const epnUrl = `https://www.ebay.com/itm/redirect?target=${encodeURIComponent(
                item.itemWebUrl
              )}&mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=${
                process.env.NEXT_PUBLIC_EPN_CAMPAIGN_ID || ''
              }&toolid=10001`;

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
                      <span className="text-[10px] uppercase text-neutral-500 block">
                        Buy It Now
                      </span>
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

      {/* SEMANTIC ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-16 border-t border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              About Flip Culture
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Flip Culture is a curated discovery platform built for collectors, sneakerheads, and tech enthusiasts. We aggregate verified, high-demand inventory directly from live marketplace streams—from deadstock Air Jordans and Yeezys to high-spec gaming laptops and rare streetwear.
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Whether you are looking to secure a hard-to-find grail or track real-time valuations before buying, Flip Culture delivers direct access to verified drops without the noise.
            </p>
          </div>

          <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">The Vault Standard</h3>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> 100% Real-Time Active Market Data
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Curated High-Margin & Rare Collections
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Direct Routing via Verified Authenticity Programs
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SEMANTIC EMAIL & CONTACT SECTION */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-16 border-t border-neutral-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Have Questions or a Custom Request?
          </h2>
          <p className="text-neutral-400 text-xs mt-2">
            Looking for a specific shoe size, GPU configuration, or rare piece? Send us a direct message below.
          </p>
        </div>

        {formSubmitted ? (
          <div className="bg-purple-900/30 border border-purple-500/50 p-8 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-emerald-400 mb-2">Message Sent!</h3>
            <p className="text-neutral-300 text-xs">
              Thank you for reaching out. The Flip Culture team will respond to your request shortly.
            </p>
          </div>
        ) : (
          <form
            name="contact-email"
            onSubmit={handleFormSubmit}
            className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl space-y-4"
          >
            <input type="hidden" name="form-name" value="contact-email" />

            <div>
              <label
                htmlFor="user-name"
                className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="user-name"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="user-email"
                className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="user-email"
                name="email"
                required
                placeholder="your-email@example.com"
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="user-message"
                className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2"
              >
                Message / Sourcing Request
              </label>
              <textarea
                id="user-message"
                name="message"
                rows={4}
                required
                placeholder="Tell us what item, size, or spec you are hunting for..."
                className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg transition disabled:opacity-50"
            >
              {formSubmitting ? 'Sending...' : 'Send Email Message'}
            </button>
          </form>
        )}
      </section>

      {/* SEMANTIC FOOTER */}
      <footer className="border-t border-neutral-800 py-12 text-center text-neutral-500 text-xs">
        <div className="max-w-xl mx-auto space-y-3 mb-6">
          <p>Connect With Us Directly:</p>
          <address className="not-italic flex justify-center gap-6 font-semibold text-neutral-300 flex-wrap">
            <a href="mailto:contact@flipculture.app" className="hover:text-purple-400 transition">
              Email Direct
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              Facebook Page
            </a>
            <a href="#contact" className="hover:text-purple-400 transition">
              Custom Sourcing Form
            </a>
          </address>
        </div>
        <p>© {new Date().getFullYear()} Flip Culture. All rights reserved.</p>
      </footer>
    </main>
  );
}
