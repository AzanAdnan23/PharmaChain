/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add 'serialport' to externals
    config.externals.push("serialport");

    // Return the updated config
    return config;
  },
};

export default nextConfig;