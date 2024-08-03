export interface Trade {
    type: TradeType;
    user_id: number;
    symbol: string,
    shares: number,
    price: number,
    timestamp: number;
    id: number;
}

export enum TradeType {
    SELL = 'sell',
    BUY = 'buy'
}
