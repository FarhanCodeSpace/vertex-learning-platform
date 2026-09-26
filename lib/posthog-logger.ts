import { SeverityNumber } from "@opentelemetry/api-logs";
import { loggerProvider } from "@/instrumentation";

const logger = loggerProvider?.getLogger("vertex-data-access");

type LogAttributes = Record<string, string | number | boolean>;

export async function emitPostHogLog(
  body: string,
  severityNumber: SeverityNumber,
  attributes: LogAttributes,
) {
  if (!logger || !loggerProvider) return;

  logger.emit({
    body,
    severityNumber,
    attributes,
  });
  await loggerProvider.forceFlush();
}
