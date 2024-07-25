import dbConnect from '@/config/database';
import ExtractUrl from '@/models/ExtractUrl';

export const generateSitemap = async () => {
  await dbConnect();

  // Fetch the list of URLs you want to include in the sitemap
  const urls = await ExtractUrl.find({}, '_id url').exec();

  // Generate the XML content for the sitemap
  const sitemap = urls.map((urlDoc) => {
    const formattedUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${formatUrlForDisplay(urlDoc.url)}_${urlDoc._id.toString()}`;
    return `<url>
      <loc>${formattedUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap}
  </urlset>`;
};

// Function to format the URL for display (to be used for the sitemap URLs)
const formatUrlForDisplay = (url) => {
  try {
    const urlObject = new URL(url);
    let hostname = urlObject.hostname.replace(/^www\./, ''); // Remove 'www.'
    hostname = hostname.replace(/\./g, '_'); // Replace dots with underscores
    return hostname;
  } catch (error) {
    console.error('Error formatting URL:', error);
    return url;
  }
};
