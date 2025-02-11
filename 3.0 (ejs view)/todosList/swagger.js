const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '1.0.0', 
        title: 'TodoLists',
        description: '這是我練習使用Node.js製作網頁所使用的API，以下是4個CRUD的Restful Api。'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);