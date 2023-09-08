export interface IBaseException {
  errorCode: string;
  statusCode: number;
  path: string;
  timestamp: string;
  message: string;
}
