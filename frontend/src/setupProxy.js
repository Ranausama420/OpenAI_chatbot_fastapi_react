const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://gpt4-pdf-chatbot-langchain-7d12287.svc.asia-southeast1-gcp-free.pinecone.io',
      changeOrigin: true,
    })
  );
};
