import { Router } from "express";
import { index, wallets, trades } from "../controllers/info.controller";

const router: Router = Router();

router.get("/", index);
router.get("/wallets", wallets);
router.get("/trades", trades);

export default router;
