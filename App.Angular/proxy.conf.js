
const PROXY_CONFIG = [
  {
    "context": ["/api"],
    "target": process.env['services__app-api__http__0'],
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" }
  },
  {
    "context": ["/otel"],
    "target": process.env['OTEL_EXPORTER_OTLP_ENDPOINT'],
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": { "^/otel": "" }
  }
];

module.exports = PROXY_CONFIG;

