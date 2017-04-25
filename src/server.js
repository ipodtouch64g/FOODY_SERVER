const express = require('express');

const postRouter = require('./routers/posts.js');
const requestLogger = require('./middleware/request-logger.js');
const errorHandler = require('./middleware/error-handler.js');

const app = express();

app.use(requestLogger);
app.use(express.static('dist'));
app.use('/api', postRouter);
app.use(errorHandler);

const port = 80;
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}...`);
});
