import { createServer } from 'http';
import app, { set } from './app';

set('port', process.env.PORT || 3000);
const server = createServer(app);

server.listen(process.env.PORT || 3000);