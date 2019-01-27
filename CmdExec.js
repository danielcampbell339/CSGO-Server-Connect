const util = require('util');
const exec = util.promisify(require('child_process').exec);

class CmdExec
{
    constructor(cmd)
    {
        this.cmd = cmd;
    }

    async run(ip)
    {
        let res = await exec("gamedig --type csgo " + ip);
        return res;
    }

    getNumPlayers(data)
    {
        console.log(data.stdout);
    }
}

exports.CmdExec = CmdExec;