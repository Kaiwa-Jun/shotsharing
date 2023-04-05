module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "shotsharing.s3.ap-northeast-1.amazonaws.com",
    ],
  },
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
