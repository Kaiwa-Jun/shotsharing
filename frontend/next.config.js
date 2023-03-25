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
  webpackDevMiddleware: (config) => {
    // ファイルシステムのポーリングを有効にし、監視間隔を 300 ミリ秒に設定
    config.watchOptions = {
      poll: 300,
      aggregateTimeout: 300,
    };
    return config;
  },
};
