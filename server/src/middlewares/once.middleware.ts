import { NextFunction, Request, Response } from "express";

var isProcessing = false;

const onlyOnce = async (req: Request, res: Response, next: NextFunction) => {
  if (isProcessing) {
    return res.json(['Server is busy now. Try again later.']);
  }
  next();
}

export const startProcessing = () => {
  isProcessing = true;
};

// Set the flag to stop processing
export const stopProcessing = () => {
  isProcessing = false;
};

export const checkStatus = () => isProcessing;

export default onlyOnce;