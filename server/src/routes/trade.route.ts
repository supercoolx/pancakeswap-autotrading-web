import { Router } from "express";
import { approve, create, withdraw, start, stop } from "../controllers/trade.controller";

const router: Router = Router();

router.post("/approve", approve);
router.post("/create", create);
router.post("/withdraw", withdraw);
router.post("/start", start);
router.post("/stop", stop);

export default router;
