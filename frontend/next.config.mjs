/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Add 'serialport' to externals
    config.externals.push("serialport");

    // Disable error overlay in development
    if (dev) {
      config.devServer = {
        overlay: false,
      };
    }

    // Return the updated config
    return config;
  },
};

export default nextConfig;
