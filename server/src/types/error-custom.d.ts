interface ICustomError extends Error {
  statusCode: number;
  message: string;
  success?: boolean;
}

export { ICustomError, CustomErrorType };
