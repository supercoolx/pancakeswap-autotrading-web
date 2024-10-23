import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 chars long"),
}).strict();

export default loginSchema;
