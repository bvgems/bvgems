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
    "/custom-jewelry",
    "/custom-jewelry/*",
    "/design-your-jewelry",
    "/design-your-jewelry/*",
    "/jewelry-details",
    "/jewelry-details/*",
    "/product-details",
    "/free-size-gemstone-details/*",
    "/apply-account", // Deprecated, using /trade/apply instead
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
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
          "/custom-jewelry",
          "/design-your-jewelry",
          "/jewelry-details/*",
          "/product-details*",
          "/free-size-gemstone-details/*"
        ],
      },
    ],
  },

  transform: async (config, path) => {
    // Default values
    let priority = 0.7;
    let changefreq = "weekly";

    // Homepage
    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    }

    // Trade hub & application
    if (
      [
        "/trade",
        "/trade/apply",
        "/trade/memo-program",
        "/trade/layouts",
        "/trade/beads",
      ].includes(path) || path.startsWith("/trade/")
    ) {
      priority = 0.9;
      changefreq = "daily";
    }

    // Collections / Categories
    if (
      [
        "/calibrated-stones",
        "/free-size-gemstones",
        "/precious-beads",
        "/colorstone-layouts",
        "/jewelry"
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
        "/customer-support/faqs",
        "/customer-support/store-policy",
        "/customer-support/gemstones-by-locations",
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
    await config.transform(config, "/calibrated-stones"),
    await config.transform(config, "/free-size-gemstones"),
    await config.transform(config, "/precious-beads"),
    await config.transform(config, "/finished-bead-necklaces"),
    await config.transform(config, "/colorstone-layouts"),
    await config.transform(config, "/jewelry"),
    await config.transform(config, "/trade"),
    await config.transform(config, "/trade/apply"),
    await config.transform(config, "/trade/memo-program"),
    await config.transform(config, "/trade/layouts"),
    await config.transform(config, "/trade/beads"),
    await config.transform(config, "/trade-shows"),
    await config.transform(config, "/customer-support/about-us"),
    await config.transform(config, "/customer-support/contact-us"),
    await config.transform(config, "/customer-support/education"),
    await config.transform(config, "/customer-support/faqs"),
    await config.transform(config, "/customer-support/store-policy"),
    await config.transform(config, "/customer-support/gemstones-by-locations"),
  ],
};
