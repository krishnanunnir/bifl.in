import type { NextConfig } from "next";

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rpyjfiwqicynqtyrqhjy.supabase.co";

let supabaseUrl: URL;
try {
  supabaseUrl = new URL(rawSupabaseUrl);
} catch {
  supabaseUrl = new URL("https://rpyjfiwqicynqtyrqhjy.supabase.co");
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/items",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products",
        destination: "/",
        permanent: true,
      },
    ];
  },
  poweredByHeader: false,
  images: {
    imageSizes: [32, 48, 64, 96, 128, 192, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseUrl.hostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
    maximumRedirects: 0,
    maximumResponseBody: 5_000_000,
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: ${supabaseUrl.origin} https://images.unsplash.com https://m.media-amazon.com`,
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.posthog.com https://*.i.posthog.com",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
