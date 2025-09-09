/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.bvgems.com", // canonical domain
  generateRobotsTxt: true,
  sitemapSize: 5000,

  // Exclude non-SEO, private, and utility pages
  exclude: [
    "/checkout",
    "/cart",
    "/payment-success",
    "/payment-cancelled",
    "/profile",
    "/apply-account",
    "/my-orders",
    "/reset-password",
    "/api/*",
    "/admin/*",
  ],

  transform: async (config, path) => {
    // Default values
    let priority = 0.7;
    let changefreq = "weekly";

    // Homepage
    if (path === "/" || path === "/calibrated-faceted-gemstones/sapphire") {
      priority = 1.0;
      changefreq = "daily";
    }

    if (
      [
        "/jewelry/rings",
        "/jewelry/earrings",
        "/jewelry/necklaces",
        "/jewelry/bracelets",
      ].includes(path)
    ) {
      priority = 0.9;
      changefreq = "daily";
    }

    // Collections / Categories
    if (
      [
        "/loose-gemstones",
        "/free-size-gemstones",
        "/precious-beads",
        "/colorstone-layouts",
        "/custom-jewelry",
        "/gemstone-collection",
      ].includes(path)
    ) {
      priority = 0.8;
      changefreq = "weekly";
    }

    // Collections / Categories
    if (
      [
        "/loose-gemstones",
        "/free-size-gemstones",
        "/precious-beads",
        "/colorstone-layouts",
        "/custom-jewelry",
        "/gemstone-collection",
      ].includes(path)
    ) {
      priority = 0.8;
      changefreq = "weekly";
    }

    // Blog & content sections
    if (path.startsWith("/blogs") || path.startsWith("/news")) {
      priority = 0.6;
      changefreq = "daily"; // blog/news can update often
    }

    // Customer support / trust pages
    if (
      [
        "/customer-support/about-us",
        "/customer-support/contact-us",
        "/customer-support/education",
      ].includes(path)
    ) {
      priority = 0.5;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Add important paths explicitly
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
    await config.transform(config, "/loose-gemstones"),
    await config.transform(config, "/calibrated-faceted-gemstones/sapphire"),
    await config.transform(config, "/free-size-gemstones"),
    await config.transform(config, "/precious-beads"),
    await config.transform(config, "/colorstone-layouts"),
    await config.transform(config, "/custom-jewelry"),
    await config.transform(config, "/gemstone-collection"),
    await config.transform(config, "/customer-support/about-us"),
    await config.transform(config, "/customer-support/contact-us"),
    await config.transform(config, "/customer-support/education"),
  ],
};
