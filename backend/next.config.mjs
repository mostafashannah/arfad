/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["geoip-country"],
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/index.html" }],
    };
  },
};
export default nextConfig;
