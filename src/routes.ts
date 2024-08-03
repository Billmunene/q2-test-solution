import { ApplicationRequest, RequestMethod } from "../types/request";
import { IndexController } from "./controller/IndexController";
import { TradeController } from "./controller/TradesController";

export class RoutesManager {
    static indexController = new IndexController();
    static tradeController = new TradeController();

    /**
     * All application routes.
     */
    static getAppRoutes(): ApplicationRequest[] {
        return [
            {
                path: '/',
                method: RequestMethod.GET,
                action: RoutesManager.indexController.indexRoute
            },
            {
                path: '/trades',
                method: RequestMethod.POST,
                action: RoutesManager.tradeController.createTrade
            },
            {
                path: '/trades',
                method: RequestMethod.GET,
                action: RoutesManager.tradeController.getAllTrades
            },
            {
                path: '/trades/:id',
                method: RequestMethod.GET,
                action: RoutesManager.tradeController.getTradeById
            },
            {
                path: '/trades/:id',
                method: RequestMethod.DELETE,
                action: RoutesManager.tradeController.methodNotAllowed
            },
            {
                path: '/trades/:id',
                method: RequestMethod.PUT,
                action: RoutesManager.tradeController.methodNotAllowed
            },
            {
                path: '/trades/:id',
                method: RequestMethod.PATCH,
                action: RoutesManager.tradeController.methodNotAllowed
            },
        ];
    }
}