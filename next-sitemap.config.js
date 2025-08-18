/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://bvgems.com", // <-- replace with your live domain
  generateRobotsTxt: true, // also generate robots.txt
  sitemapSize: 5000,
  exclude: [
    "/checkout",
    "/cart",
    "/payment-success",
    "/payment-cancelled",
    "/profile",
    "/apply-account",
    "/my-orders",
  ],
};
