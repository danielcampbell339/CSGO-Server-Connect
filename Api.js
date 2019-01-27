const express = require('express');
const CmdExec = require('./CmdExec').CmdExec;
const JsonParser = require('./JsonParser').JsonParser;
const request = require('request');
const opn = require('opn');

class Api 
{
    constructor()
    {
        this.app = express();
        this.port = 8081;
        this.CmdExec = new CmdExec();
        this.JsonParser = new JsonParser('servers');
    }

    setRoutes()
    {
        this.app.get('/process', (req, res) => {

            // Get all the ips from the json file
            let priorities = this.JsonParser.read()
            let found = false;

            // Loop through the priorities and once we find a suitable server break out
            outerLoop:
            for (let i in priorities) {
                // Loop through the servers
                for (let ip of priorities[i]) {
                    let data = this.CmdExec.run(ip);

                    data.then((result) => {
                        let stringify = JSON.stringify(result.stdout);
                        let matchNumPlayers = stringify.match(/(numplayers\\\":)\d+/);
                        let matchMaxPlayers = stringify.match(/(maxplayers\\\":)\d+/);

                        let matchValue = (string) => {
                            return string.match(/\d+/);
                        }
                        let numplayers = matchNumPlayers[0];
                        let maxplayers = matchMaxPlayers[0]

                        let numplayersValue = matchValue(numplayers);
                        let maxplayersValue = matchValue(maxplayers);

                        return {ip: ip, priority: i, numplayers: numplayersValue[0], maxplayers: maxplayersValue[0]}

                    }).then((result) => {

                        if (result.numplayers < 10 && result.numplayers > 0 && !found) {
                            found = true;

                            function inspect(link){
                                opn(link, 'chrome'); 
                            }

                            // Found a server so now connect to that server
                            inspect("steam://connect/"+result.ip);

                            console.log('woah')

                            // request('steam://connect/'+result.ip, (error, response, body) => {
                            //     console.log(error)
                            // });
                        }

                    });

                }
            }

            res.send(priorities);
        });
    }

    listen()
    {
        this.app.listen(this.port, console.log(`Listening on port ${this.port}`));
    }
}

exports.Api = Api;