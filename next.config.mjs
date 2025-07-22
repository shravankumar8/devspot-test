/** @type {import('next').NextConfig} */
const nextConfig = {
 
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.cache = true; // Enable Webpack caching
    return config;
  },
  redirects: async () => [
    {
      source: "/:path*",
      has: [
        { type: "host", value: `www.${process.env.NEXT_PUBLIC_BASE_SITE_URL}` },
      ],
      destination: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/:path*`,
      permanent: true,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lppzrubgmjigmwcidgzh.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbnaslxybqdeosvgknbq.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dbaimdvhgbmmxfjaszcp.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "your-default-header-image-url.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3-alpha-sig.figma.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "auth.devspot.app",
        pathname: "/**",
      },
      { protocol: "https", hostname: "www.figma.com", pathname: "/**" },
      { protocol: "https", hostname: "example.com", pathname: "/**" },
      { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
      { protocol: "https", hostname: "devspot.app", pathname: "/**" },

      {
        protocol: "https",
        hostname: "tghdueftelokgfsaodcp.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
