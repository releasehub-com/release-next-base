/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "uploads-ssl.webflow.com",
      },
      ...(process.env.NEXT_PUBLIC_APP_BASE_URL ? [{
        protocol: new URL(process.env.NEXT_PUBLIC_APP_BASE_URL).protocol.replace(':', ''),
        hostname: new URL(process.env.NEXT_PUBLIC_APP_BASE_URL).hostname,
      }] : [])
    ],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;"
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      {
        source: "/terms-of-service",
        destination: "/legal/terms-of-service",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/legal/privacy-policy",
        permanent: true,
      },
      {
        source: "/security",
        destination: "/legal/security",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
