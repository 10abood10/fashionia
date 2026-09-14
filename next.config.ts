import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export: the page has no server work, so `npm run build` emits a
     plain HTML/CSS/JS bundle in ./out that any static host can serve. */
  output: "export",
  /* Emit /pay/index.html rather than /pay.html so every static host serves it. */
  trailingSlash: true,
  images: {
    /* The export target has no image optimizer. Unsplash already returns
       WebP/AVIF via the `auto=format` parameter on every URL in lib/data.ts. */
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
