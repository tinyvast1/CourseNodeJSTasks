import { app } from './server';
import { getPort } from './helpers';
import dg from 'debug';

const port = getPort();

const debugSrv = dg('server:main');

app.listen(port, () => {
    debugSrv(`Server API is up on port ${port}`);
});
