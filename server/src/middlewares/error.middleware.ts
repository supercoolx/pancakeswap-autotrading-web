import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ICustomError } from "../types/error-custom";

const errorMiddleware: ErrorRequestHandler = (err: ICustomError, req: Request, res: Response, next: NextFunction) => {
    console.log("middleware: ", err);
    
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ success: false, message, statusCode });
};

export { errorMiddleware };
