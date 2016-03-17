/**
 * Created by root on 09.02.16.
 */
var nconf = require('nconf'),
    path = require('path');

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, 'config.json') });

module.exports = nconf;