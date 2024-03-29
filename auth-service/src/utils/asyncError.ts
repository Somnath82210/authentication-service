import { NextFunction, Request, Response} from "express";
import ErrorHandler from "./errorHandler";

const asyncError = (controller: Function) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    if (error instanceof ErrorHandler)
      next(new ErrorHandler(error.message, error.statusCode));
  }
};

export default asyncError;
