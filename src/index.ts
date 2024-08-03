import express from 'express';
import bodyParser from 'body-parser';
import { RoutesManager } from './routes';
import { createConnection } from 'typeorm';

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Register routes
const routes = RoutesManager.getAppRoutes();
routes.forEach(route => {
    switch (route.method) {
        case 'post':
            app.post(route.path, route.action);
            break;
        case 'get':
            app.get(route.path, route.action);
            break;
        case 'put':
            app.put(route.path, route.action);
            break;
        case 'patch':
            app.patch(route.path, route.action);
            break;
        case 'delete':
            app.delete(route.path, route.action);
            break;
        default:
            throw new Error(`Unsupported method: ${route.method}`);
    }
});

// Start server and establish database connection
const PORT = process.env.PORT || 8080;

createConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}).catch(error => console.log('TypeORM connection error: ', error));

export default app;
