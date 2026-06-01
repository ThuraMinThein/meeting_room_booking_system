import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { GlobalResponseError } from './global-response.error';

@Catch(EntityNotFoundError, QueryFailedError, CannotCreateEntityIdMapError)
export class TypeormExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let message = (exception as any).message.message as string;
        let error = 'Unprocessable Entity';

        Logger.error(message, (exception as any).stack, `${request.method} ${request.url}`);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        switch (exception.constructor) {
            case QueryFailedError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message;
                console.log(message);
                message = 'Query Failed Error';
                error = (exception as any).code;
                break;
            case EntityNotFoundError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as EntityNotFoundError).message;
                console.log(message);
                const regex = /(.+?):\s*{/;
                const match = regex.exec(message);
                message = match ? match[1].trim() : 'Could not find any entity';
                error = (exception as any).code;
                break;
            case CannotCreateEntityIdMapError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as CannotCreateEntityIdMapError).message;
                console.log(message);
                message = 'Cannot Create Entity Error';
                error = (exception as any).code;
                break;
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR
        }

        console.log(error);
        response.status(status).json(GlobalResponseError(status, message, error || 'Unprocessable Entity'));
    }
}