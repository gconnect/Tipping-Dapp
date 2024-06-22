// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = { fs: false, path: false, stream: false, constants: false };
    return config;
  },
  images: {
    domains: ['images.unsplash.com', 'brown-clinical-python-573.mypinata.cloud', 'gateway.pinata.cloud'],
  },

};


export default nextConfig;
