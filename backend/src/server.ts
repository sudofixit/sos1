import { app } from "./app";
import { CONFIG } from "./config";

export default {
  port: CONFIG.PORT,
  fetch: app.fetch,
};
