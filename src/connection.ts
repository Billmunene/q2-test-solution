import {Connection, createConnection} from "typeorm/index";

let connection: Connection;
let promise: Promise<Connection>;
export const createDefaultConnection = async () => {
    if (connection) {
        return connection;
    } else if(promise) {
        return promise;
    }
    promise = createConnection();
    connection = await promise;
    console.log('Connection successful');
    return connection;
}
