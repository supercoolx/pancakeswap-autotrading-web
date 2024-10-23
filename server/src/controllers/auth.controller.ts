import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import userSchema from "../schemas/user.schema";
import loginSchema from "../schemas/login.schema";
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import JWT from "../utils/jwt";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validate = userSchema.safeParse(req.body);
    if (!validate.success) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials." });

    const { username, email, password } = validate.data!;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword }); // ⭐⭐
    await newUser.save();

    const token = JWT.generate({ email: newUser.email });
    res.cookie('access_token', token, { httpOnly: true }).status(201).json({ message: "User signed up.", data: newUser });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Something went wrong" });
  }
};

const login = async (req: Request, res: Response) => {
  const validate = loginSchema.safeParse(req.body);
  if (!validate.success) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials." });

  const user = await User.findOne({ email: validate.data.email });
  if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found.'});

  const passwordCorrect = bcryptjs.compareSync(validate.data.password, user.password);
  if (!passwordCorrect) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Incorrect password.' });

  const token = JWT.generate({ email: user.email });

  res.cookie('access_token', token, { httpOnly: true }).json({ message: "Logged in." });
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie('access_token').json({ message: "Logged out." });
};

export { signup, login, logout };
