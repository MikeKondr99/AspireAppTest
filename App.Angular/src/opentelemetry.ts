import { environment } from './environment';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
  WebTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';


export const configure = (OTEL_EXPORTER_OTLP_ENDPOINT: string, OTEL_EXPORTER_OTLP_HEADERS: string) => {
  console.log("OTEL CONFIGURATION START");
  console.log(OTEL_EXPORTER_OTLP_ENDPOINT);
  console.log(OTEL_EXPORTER_OTLP_HEADERS)
  console.log(OTEL_EXPORTER_OTLP_ENDPOINT + '/otel')
  const provider = new WebTracerProvider();

  // For demo purposes only, immediately log traces to the console
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));


  // Batch traces before sending them to HoneyComb
  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: OTEL_EXPORTER_OTLP_ENDPOINT + '/otel',

        headers: {
          'x-otlp-api-key': OTEL_EXPORTER_OTLP_HEADERS.split('=')[1]
        },

      }),
    ),
  );

  provider.register();

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-document-load': {},
        '@opentelemetry/instrumentation-user-interaction': {},
        '@opentelemetry/instrumentation-fetch': {},
        '@opentelemetry/instrumentation-xml-http-request': {},
      }),
    ],
  });
  console.log("OTEL CONFIGURATION END");
}


