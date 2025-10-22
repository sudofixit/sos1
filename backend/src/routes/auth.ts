import { Hono } from "hono";

import { loginHandler } from "../controllers/authController";
import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "../schemas/auth";

export const authRouter = new Hono();

authRouter.post("/login", zValidator("json", loginSchema), loginHandler);
