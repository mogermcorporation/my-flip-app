import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  const category = searchParams.get('category') || 'sneakers';
  const customQuery = searchParams.get('q');

  // Search queries for featured hero items vs standard category filters
  const featuredQuery = 'Jordan 1 Retro High OR ROG Zephyrus G16 OR Steam Deck OLED';
  const searchQueries: Record<string, string> = {
    sneakers: 'Jordan 1 OR Yeezy 350 OR Nike Dunk Low',
    streetwear: 'Supreme hoodie OR Fear of God Essentials OR Stussy',
    laptops: 'ROG Zephyrus OR Razer Blade OR Alienware',
    handhelds: 'Steam Deck OLED OR ROG Ally',
    battlestation: 'OLED Gaming Monitor OR SteelSeries Wireless',
    collectibles: 'Pokemon Booster Box Sealed OR Vintage Camcorder',
  };

  const rawQuery = featured === 'true' 
    ? featuredQuery 
    : (customQuery && customQuery.trim() !== '' ? customQuery : (searchQueries[category] || searchQueries.sneakers));

  const query = encodeURIComponent(rawQuery);

  try {
    const authHeader = Buffer.from(
      `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
    ).toString('base64');

    const tokenRes = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
      next: { revalidate: 3600 },
    });

    const { access_token } = await tokenRes.json();

    const ebayRes = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${query}&limit=${featured === 'true' ? '4' : '16'}&filter=buyingOptions:{FIXED_PRICE}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        },
        next: { revalidate: 300 },
      }
    );

    const data = await ebayRes.json();
    return NextResponse.json(data.itemSummaries || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
