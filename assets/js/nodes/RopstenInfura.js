const NodeBase = require('./nodeBase');

class RopstenInfura extends NodeBase {
    constructor(context) {
        context.config = {
            serverUrl:'https://ropsten.infura.io/mew',
            explorerTX:'https://ropsten.etherscan.io/tx/'
        }
        super(context);
        this.networkId = 3;
    }
}

module.exports = RopstenInfura;