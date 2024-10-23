import { Request, Response } from "express";

const test = (req: Request, res: Response) => {
  res.json({ message: "Hello world, good" });
};

const me = (req: Request, res: Response) => {
  const user = req.body.user;
  res.json(user);
};

export { test, me };
