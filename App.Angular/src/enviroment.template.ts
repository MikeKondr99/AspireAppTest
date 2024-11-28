export const environment = {
  production: true,
  envName: 'dev',
  OTEL_EXPORTER_OTLP_ENDPOINT: '${OTEL_EXPORTER_OTLP_ENDPOINT}',
  OTEL_EXPORTER_OTLP_HEADERS: '${OTEL_EXPORTER_OTLP_HEADERS}'
};
