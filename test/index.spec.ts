import server from '../src';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { getTradeRepository, Trade } from "../src/entity/Trade";
import BlueBird from 'bluebird';
import { Repository } from "typeorm";
import { before } from "mocha";
import { createDefaultConnection } from "../src/connection";

const should = chai.should();

chai.use(chaiHttp);

const setup = (...tradeObjects: Trade[]) => {
    return BlueBird.mapSeries(tradeObjects, trade => {
        return chai.request(server)
            .post('/trades')
            .send(trade)
            .then(response => {
                return response.body;
            })
    })
}

describe('stock_trades_api_easy_typescript', () => {
    let TradeRepository: Repository<Trade>;
    const user23ABX = {
        "type": "buy",
        "user_id": 23,
        "symbol": "ABX",
        "shares": 30,
        "price": 134,
        "timestamp": 1591522701000
    } as Trade;

    const user23AAC = {
        "type": "buy",
        "user_id": 23,
        "symbol": "AAC",
        "shares": 12,
        "price": 133,
        "timestamp": 1591572701000
    } as Trade;

    before(async () => {
        await createDefaultConnection();
    })

    beforeEach(async () => {
        TradeRepository = await getTradeRepository();
    })

    afterEach(async () => {
        await TradeRepository.query(`DELETE FROM ${TradeRepository.metadata.tableName};`);
    })

    it('should create a new trade', async () => {
        const response1 = await chai.request(server).post('/trades').send(user23ABX)
        response1.should.have.status(201);
        delete response1.body.id;
        response1.body.should.eql(user23ABX)
        const response2 = await chai.request(server).post('/trades').send(user23AAC)
        response2.should.have.status(201);
        delete response2.body.id;
        response2.body.should.eql(user23AAC)
    });

    it('should fetch all the trades', async () => {
        const results = await setup(user23AAC, user23ABX);
        const response = await chai.request(server).get('/trades')
        response.should.have.status(200);
        response.body.should.eql(results);
    })

    it('should fetch a single trade', async () => {
        const [trade] = await setup(user23AAC);
        const response = await chai.request(server).get(`/trades/${trade.id}`)
        response.should.have.status(200);
        response.body.should.eql(trade);
    })

    it('should get 404 if the trade ID does not exist', async () => {
        const response = await chai.request(server).get(`/trades/32323`)
        response.should.have.status(404);
        response.text.should.eql('ID not found');
    })

    it('should get 405 for a put request to /trades/:id', async () => {
        const [trade] = await setup(user23AAC);
        const response = await chai.request(server).put(`/trades/${trade.id}`).send(user23ABX)
        response.should.have.status(405);
    })

    it('should get 405 for a patch request to /trades/:id', async () => {
        const [trade] = await setup(user23AAC);
        const response = await chai.request(server).patch(`/trades/${trade.id}`).send(user23ABX)
        response.should.have.status(405);
    })

    it('should get 405 for a delete request to /trades/:id', async () => {
        const [trade] = await setup(user23AAC);
        const response = await chai.request(server).delete(`/trades/${trade.id}`)
        response.should.have.status(405);
    })
});
