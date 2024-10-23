import { Router } from "express";
import { test, me } from "../controllers/user.controller";

const router: Router = Router();

router.get("/test", test);
router.get("/me", me);

export default router;
