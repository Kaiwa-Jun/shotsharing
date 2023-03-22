module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:3000/api/:path*", // Use 'backend' instead of 'localhost'
      },
    ];
  },
};
