import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utils";
import { ZodType } from "zod";
export const isValid = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //validate data
    let data = { ...req.body, ...req.params, ...req.query };
    const validateData = schema.safeParse(data);
    if (validateData.success == false) {
      let errMessages = validateData.error.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
      }));

      throw new BadRequestException("validation error", errMessages);
    }
  };
};
