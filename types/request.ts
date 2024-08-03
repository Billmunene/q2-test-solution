import {NextFunction, Request, Response} from 'express';

export interface ApplicationRequest {
    path: string;
    action: (req: Request, res: Response, next?: NextFunction) => any
    method: RequestMethod
}

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
}
