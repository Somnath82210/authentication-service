import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";

const errMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // default server error
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";



  // send err response via API
  return res.status(err.statusCode).json({
    success: false,
    message: err.message
  })
};

export default errMiddleware;