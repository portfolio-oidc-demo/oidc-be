import fastify, { FastifyRequest } from "fastify";
import { PinoLoggerOptions } from "fastify/types/logger";
import "dotenv/config";

const IS_PRODUCTION_ENV = process.env.NODE_ENV === "production";

function getLoggerConfig(): PinoLoggerOptions {
  const config: PinoLoggerOptions = {
    level: process.env.LOG_LEVEL || "debug",
    serializers: {
      req(request: FastifyRequest) {
        return {
          clientIp: request.ip,
          clientIpTrace: request.ips,
          method: request.method,
          url: request.url,
          path: request.routeOptions.url,
          remotePort: request.socket.remotePort,
        };
      },
    },
  };

  if (IS_PRODUCTION_ENV) {
    config.transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    };
  }

  return config;
}

const app = fastify({
  logger: getLoggerConfig(),
  // required in order to map the ip list from x-forwarded-for header
  trustProxy: true,
  disableRequestLogging: IS_PRODUCTION_ENV, // disable Fastify's default logging of requests and responses: avoid logging potentially
});

// GET endpoint added for testing purposes
app.get("/ping", async (_request, _reply) => {
  return "pong\n";
});

app.listen(
  { host: process.env.HOST || "0.0.0.0", port: +(process.env.PORT || 3000) },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
