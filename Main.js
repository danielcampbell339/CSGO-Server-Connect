const Api = require('./Api').Api;
const request = require('request');

class Main 
{
    constructor()
    {
        this.api = new Api();
    }
}

// Run the program
let m = new Main();

// Start the server
m.api.listen();

// Set the main routes
m.api.setRoutes();

request('http://localhost:8081/process', (error, response, body) => {});