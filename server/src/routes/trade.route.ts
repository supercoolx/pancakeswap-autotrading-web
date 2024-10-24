import { Router } from "express";
import { approve, create, withdraw, start, stop, status } from "../controllers/trade.controller";

import onlyOnce from "../middlewares/once.middleware";

const router: Router = Router();

router.post("/approve", onlyOnce, approve);
router.post("/create", onlyOnce, create);
router.post("/withdraw", onlyOnce, withdraw);
router.post("/start", onlyOnce, start);
router.post("/stop", stop);
router.get("/status", status);

export default router;
