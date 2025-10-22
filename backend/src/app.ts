import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { healthRouter } from "./routes/health";
import { paymentRouter } from "./routes/payment";
import { adminRouter } from "./routes/admin";
import { webhookRouter } from "./routes/webhook";
import { authRouter } from "./routes/auth";

export const app = new Hono();

app.use("*", cors());

// mount routes
app.use("*", logger());
app.route("/", healthRouter);
app.route("/", paymentRouter);
app.route("/auth", authRouter);
app.route("/admin", adminRouter);
app.route("/webhook", webhookRouter);
