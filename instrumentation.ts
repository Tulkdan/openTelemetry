import { NodeSDK } from '@opentelemetry/sdk-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'dice-server',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0',
  }),
  traceExporter: new OTLPTraceExporter({
    url: `http://${process.env.OTLP_ENDPOINT}:4317/v1/traces`
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `http://${process.env.OTLP_ENDPOINT}:4317/v1/metrics`
	}),
  }),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

