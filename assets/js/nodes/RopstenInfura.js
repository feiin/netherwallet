const NodeBase = require('./nodeBase');

class RopstenInfura extends NodeBase {
    constructor(context) {
        context.config = {
            ServerUrl:'https://ropsten.infura.io/mew'
        }
        super(context);
    }
}

module.exports = RopstenInfura;