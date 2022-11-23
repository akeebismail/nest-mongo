interface IResponse {
  status?: number;
  message?: string;
  success?: boolean;
  data?: any;
}
export class Response {
  sendSuccess(data: IResponse) {
    return {
      status: data.status || 200,
      success: data.success || true,
      message: data.message,
      data: data.data,
    };
  }

  sendError(error: IResponse) {
    return {
      success: error.success || false,
      status: error.status || 400,
      message: error.message,
      data: error.data,
    };
  }

  internalError(error) {
    //handle error log
    return {
      success: false,
      status: 500,
      message: error.message,
      error: error.message || 'Internal server error',
    };
  }
}
