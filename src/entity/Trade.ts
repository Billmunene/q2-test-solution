import { Entity, PrimaryGeneratedColumn, Column, Repository } from "typeorm";
import { createDefaultConnection } from "../connection";
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import bodyParser from 'body-parser';

@Entity()
export class Trade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ enum: ['buy', 'sell'] })
    type: string;

    @Column()
    user_id: number;

    @Column()
    symbol: string;

    @Column()
    shares: number;

    @Column()
    price: number;

    @Column()
    timestamp: number;
}

export const getTradeRepository = async (): Promise<Repository<Trade>> => {
    const connection = await createDefaultConnection();
    return connection.getRepository(Trade);
};

enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
}

interface ApplicationRequest {
    path: string;
    action: (req: Request, res: Response, next?: NextFunction) => any;
    method: RequestMethod;
}

const routes: ApplicationRequest[] = [
    {
        path: '/trades',
        method: RequestMethod.POST,
        action: async (req: Request, res: Response) => {
            const tradeRepository = await getTradeRepository();
            const newTrade = tradeRepository.create(req.body);
            await tradeRepository.save(newTrade);
            res.status(201).json(newTrade);
        },
    },
    {
        path: '/trades',
        method: RequestMethod.GET,
        action: async (req: Request, res: Response) => {
            const tradeRepository = await getTradeRepository();
            const trades = await tradeRepository.find({ order: { id: 'ASC' } });
            res.status(200).json(trades);
        },
    },
    {
        path: '/trades/:id',
        method: RequestMethod.GET,
        action: async (req: Request, res: Response) => {
            const tradeRepository = await getTradeRepository();
            const trade = await tradeRepository.findOne({ where: { id: parseInt(req.params.id) } });
            if (trade) {
                res.status(200).json(trade);
            } else {
                res.status(404).send('ID not found');
            }
        },
    },
    {
        path: '/trades/:id',
        method: RequestMethod.DELETE,
        action: (req: Request, res: Response) => {
            res.status(405).send('Method Not Allowed');
        },
    },
    {
        path: '/trades/:id',
        method: RequestMethod.PUT,
        action: (req: Request, res: Response) => {
            res.status(405).send('Method Not Allowed');
        },
    },
    {
        path: '/trades/:id',
        method: RequestMethod.PATCH,
        action: (req: Request, res: Response) => {
            res.status(405).send('Method Not Allowed');
        },
    },
];

const app = express();
app.use(bodyParser.json());

routes.forEach(route => {
    switch (route.method) {
        case RequestMethod.POST:
            app.post(route.path, route.action);
            break;
        case RequestMethod.GET:
            app.get(route.path, route.action);
            break;
        case RequestMethod.PUT:
            app.put(route.path, route.action);
            break;
        case RequestMethod.PATCH:
            app.patch(route.path, route.action);
            break;
        case RequestMethod.DELETE:
            app.delete(route.path, route.action);
            break;
    }
});

const startServer = async () => {
    await createDefaultConnection();
    app.listen(3000, () => {
        console.log('Server started on port 3000!');
    });
};

startServer().catch(error => console.log(error));
