import {Request, Response} from "express";

export class IndexController {

    indexRoute(request: Request, response: Response) {
        response.send('<p>HTML Data</p>');
    }
}
