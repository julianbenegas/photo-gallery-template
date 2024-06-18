/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "assets.basehub.com" }],
  },
};

export default nextConfig;
