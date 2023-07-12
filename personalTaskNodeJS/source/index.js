// Core
import dg from 'debug';

// Instruments
import { app } from './server';
import { getPort } from './helpers';

//Routers
import * as routers from './routers';

app.use('/login', routers.login);
app.use('/logout', routers.logout);
app.use('/users', routers.users);
app.use('/classes', routers.classes);
app.use('/lessons', routers.lessons);

const port = getPort();
const debugSrv = dg('server:main');

app.listen(port, () => {
    debugSrv(`Server API is up on port ${port}`);
});
