import { CustomError } from "../CustomError";

export class InvalidParameterError extends CustomError {
  constructor (message:string) {
    super(message, 422);
  }
}