import { Response } from "express";
import { ICustomError } from "../types/error-custom";

const customErrorHandler = (res: Response, error: ICustomError)  => {
  return res.status(error.statusCode).json({ message: error.message });
};

export default customErrorHandler;
