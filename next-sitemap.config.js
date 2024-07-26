/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://extractemailfromwebsite.com',
  generateRobotsTxt: true, // (optional) Generate a robots.txt file
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
  additionalPaths: async (config) => [
    await config.transform(config, '/emails-retrieved'),
  ],
  // Optional: Define custom transform function
  transform: async (config, path) => {
    return {
      loc: path, // The URL path
      changefreq: 'daily', // Change frequency
      priority: 0.7, // Priority
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
