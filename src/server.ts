import fastify from "fastify";

const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || "debug",
    // TODO: add transport only in production environment
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    },
  },
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
