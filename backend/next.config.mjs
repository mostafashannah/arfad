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
  // Pages and the stylesheet are re-checked on every visit, so a new deploy or an admin edit is never hidden behind a stale cached copy.
  async headers() {
    const revalidate = [{ key: "Cache-Control", value: "no-cache, must-revalidate" }];
    return [
      { source: "/", headers: revalidate },
      { source: "/:page*.html", headers: revalidate },
      { source: "/ar", headers: revalidate },
      { source: "/ar/:page*.html", headers: revalidate },
      { source: "/styles.css", headers: revalidate },
      { source: "/styles-ar.css", headers: revalidate },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: "/ar", destination: "/ar/index.html" },
        { source: "/ar/", destination: "/ar/index.html" },
      ],
    };
  },
};
export default nextConfig;
