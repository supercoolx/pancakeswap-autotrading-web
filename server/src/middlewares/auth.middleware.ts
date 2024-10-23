import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import JWT from "../utils/jwt";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You are not looged in.'});

  const auth: any = JWT.verify(token);
  if (!auth) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token.'});

  const user = await User.findOne({ email: auth.email }).select('-password -_id -__v');
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found.'});

  req.body.user = user;
  next();
}

export default authenticate;