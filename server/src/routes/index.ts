import express from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import tradeRouter from "./trade.route";
import infoRouter from "./info.route";

import authenticate from "../middlewares/auth.middleware";

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/user', authenticate, userRouter);
rootRouter.use('/trade', authenticate, tradeRouter);
rootRouter.use('/info', authenticate, infoRouter);

const router = express.Router();
router.use('/api', rootRouter);

export default router;