import { Response } from 'express';
const generalJsonResponse = (
  res: Response,
  data: any = [],
  message: string = '',
  response_type: string = 'success',
  toast: boolean = false,
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    data: data,
    message: message,
    toast: toast,
    response_type: response_type,
  });
};
export default generalJsonResponse;
