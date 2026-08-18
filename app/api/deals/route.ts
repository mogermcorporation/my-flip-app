import { NextResponse } from 'next/server';

async function getEbayAccessToken() {
  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;

  if (!appId || !certId) {
    throw new Error('eBay App ID or Cert ID is missing in environment variables.');
  }

  const credentials = Buffer.from(`${appId}:${certId}`).toString('base64');

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to obtain eBay access token:', errorData);
    throw new Error('Failed to obtain eBay access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'sneakers';
    const searchQuery = searchParams.get('q');
    const isFeatured = searchParams.get('featured') === 'true';

    const token = await getEbayAccessToken();

    // Mapping categories to strict search terms with negative filters to exclude cheap items
    const categoryQueries: Record<string, string> = {
      sneakers: 'Nike Jordan Yeezy sneaker -keychain -mini -miniature -display -box',
      streetwear: 'Supreme Fear of God Hoodie -keychain -sticker -pin',
      laptops: 'Gaming Laptop RTX MacBook Pro -case -skin -cover',
      handhelds: 'Steam Deck Asus ROG Ally Nintendo Switch OLED -case -cover',
      battlestation: 'Gaming Monitor Mechanical Keyboard -cable -wristrest',
      collectibles: 'Bearbrick Kaws Figure Funko Grail -keychain',
    };

    let query = searchQuery || categoryQueries[category] || categoryQueries['sneakers'];

    if (isFeatured) {
      query = 'Air Jordan 4 Retro -keychain -mini';
    }

    // Set a minimum price of $50 to filter out cheap novelty items
    const ebayUrl = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
      query
    )}&limit=12&filter=price:[50..],priceCurrency:USD`;

    const ebayRes = await fetch(ebayUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      },
    });

    if (!ebayRes.ok) {
      const errorText = await ebayRes.text();
      console.error('eBay Browse API Error:', errorText);
      return NextResponse.json([], { status: ebayRes.status });
    }

    const ebayData = await ebayRes.json();
    const items = ebayData.itemSummaries || [];

    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Error in /api/deals route:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
