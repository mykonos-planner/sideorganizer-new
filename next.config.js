/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Forza il rebuild
  generateBuildId: () => 'build-' + Date.now(),
}

module.exports = nextConfig
