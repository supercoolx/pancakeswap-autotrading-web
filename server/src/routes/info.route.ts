import { Router } from "express";
import { index, wallets, trades, config } from "../controllers/info.controller";

const router: Router = Router();

router.get("/", index);
router.get("/wallets", wallets);
router.get("/trades", trades);
router.get("/config", config);

export default router;
