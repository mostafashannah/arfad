/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    // Hostinger's build container limits threads; keep the build to one worker.
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
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
