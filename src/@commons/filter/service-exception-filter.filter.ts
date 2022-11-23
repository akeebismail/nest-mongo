import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus, ValidationPipe} from '@nestjs/common';
import {BaseRpcExceptionFilter} from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import {BaseResponseDto} from "../response/base-response.dto";

@Catch()
export class ServiceExceptionFilterFilter extends BaseRpcExceptionFilter{
  catch(exception: any, host: ArgumentsHost): Observable<BaseResponseDto<any>> {
    const { response = {}, status } = exception;
    const { message, error } = response;
    let exceptionResponse
    if(exception instanceof BadRequestException) {
      exceptionResponse = {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        success: false,
        error: error || 'input error.',
        message: Array.isArray(message) ? message.join(' and ') : message
      }
    }else {
      exceptionResponse = {
        status: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        error: error?.toLowerCase() ?? 'error occurred',
        message:
            typeof message === 'string'
                ? message?.toLowerCase()
                : message?.[0]?.toLowerCase() ?? 'error occurred',
      };
    }
    return of(exceptionResponse);
  }
}
