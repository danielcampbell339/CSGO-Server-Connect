let fs = require('fs');

class JsonParser
{
    constructor(file) 
    {
        this.file = './' + file + '.json';
    }

    read()
    {
        return JSON.parse(fs.readFileSync(this.file, 'utf8'));
    }
}

exports.JsonParser = JsonParser;