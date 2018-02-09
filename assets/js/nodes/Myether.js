const NodeBase = require('./nodeBase');


class Myether extends NodeBase {
    constructor(context) {
        context.config = {
            serverUrl:'https://api.myetherapi.com/eth',
            explorerTX:'https://etherscan.io/tx/'
        }
        super(context);
        this.networkId = 1;
        
    }
}

module.exports = Myether;