if (process.env.NODE_ENV === 'prodcution') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}