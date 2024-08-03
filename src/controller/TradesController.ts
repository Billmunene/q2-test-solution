import { Request, Response } from 'express';
import { getTradeRepository } from '../entity/Trade';

export class TradeController {
    async createTrade(req: Request, res: Response): Promise<void> {
        const tradeRepository = await getTradeRepository();
        const newTrade = tradeRepository.create(req.body);
        await tradeRepository.save(newTrade);
        res.status(201).json(newTrade);
    }

    async getAllTrades(req: Request, res: Response): Promise<void> {
        const tradeRepository = await getTradeRepository();
        const trades = await tradeRepository.find({ order: { id: 'ASC' } });
        res.status(200).json(trades);
    }

    async getTradeById(req: Request, res: Response): Promise<void> {
        const tradeRepository = await getTradeRepository();
        const trade = await tradeRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (trade) {
            res.status(200).json(trade);
        } else {
            res.status(404).send('ID not found');
        }
    }

    methodNotAllowed(req: Request, res: Response): void {
        res.status(405).send('Method Not Allowed');
    }
}
