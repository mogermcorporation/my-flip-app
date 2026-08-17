import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flip Culture Blog | Sourcing Guides, Legit Checks & Resale Trends',
  description:
    'Deep dives into flipping Air Jordans, sourcing high-spec gaming laptops, spot-checking vintage streetwear, and maximizing resale margins.',
};

const blogPosts = [
  {
    slug: 'how-to-spot-fake-jordan-1s',
    title: 'How to Spot Fake Air Jordan 1 Retros in 2026: The Complete Legit Check Guide',
    excerpt:
      'Crucial details on leather texture, heel shape, hourglass silhouettes, and Wings logo embossing before you buy or flip high-value pairs.',
    date: 'August 2026',
    category: 'Sneaker Legit Checks',
  },
  {
    slug: 'top-gaming-laptops-resale-value',
    title: 'Top 5 Gaming Laptops That Hold Their Resale Value Best',
    excerpt:
      'Why ASUS ROG Zephyrus, Razer Blade, and Steam Deck OLED models consistently yield high margins on the secondary market.',
    date: 'August 2026',
    category: 'Tech Resale Analysis',
  },
  {
    slug: 'sourcing-vintage-streetwear-grails',
    title: 'Sourcing Vintage Streetwear & Grails: Thrift to Marketplace Blueprint',
    excerpt:
      'How to evaluate tag dates, single-stitch construction, and authentic wear when flipping 90s apparel and hype streetwear.',
    date: 'August 2026',
    category: 'Sourcing Strategy',
  },
];

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 text-center text-xs font-bold uppercase tracking-widest flex justify-between px-6 items-center">
        <span>⚡ Flip Culture Field Guides & Market Insights</span>
        <Link href="/" className="underline hover:text-neutral-200 transition">
          Back to Storefront
        </Link>
      </div>

      <header className="max-w-4xl mx-auto px-6 py-12 border-b border-neutral-800 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight italic bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
          FLIP CULTURE BLOG
        </h1>
        <p className="text-neutral-400 text-sm mt-2 max-w-lg mx-auto">
          Market trends, legit checks, hardware reviews, and sourcing breakdowns for high-value flips.
        </p>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition"
          >
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
              <span className="bg-purple-600/20 text-purple-400 font-bold px-3 py-1 rounded-full border border-purple-500/30">
                {post.category}
              </span>
              <span>{post.date}</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3 hover:text-purple-400 transition">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed mb-6">{post.excerpt}</p>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
            >
              Read Full Breakdown →
            </Link>
          </article>
        ))}
      </section>

      <footer className="border-t border-neutral-800 py-12 text-center text-neutral-500 text-xs">
        <p>© {new Date().getFullYear()} Flip Culture. All rights reserved.</p>
      </footer>
    </main>
  );
}
