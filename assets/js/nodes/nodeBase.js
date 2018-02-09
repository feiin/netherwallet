const tokenAbi = require('human-standard-token-abi');

class NodeBase {
    constructor(context) {
        this.context = context;
        this.$http = context.$http;
        var web3 = this.web3 = new context.Web3();
        web3.setProvider(new web3.providers.HttpProvider(this.context.config.serverUrl));
        this.explorerTX  = this.context.config.explorerTX;
    }

    getBalance(addr, callback) {
        this.web3.eth.getBalance(addr, 'latest', (error, result) => {
            if (error) {
                return callback(error);
            }
            var weiBalance = result.toNumber();
            var etherBalance = this.web3.fromWei(weiBalance, 'ether');
            callback(null, etherBalance);
        });
    }

    getTransaction(txHash, callback) {
        throw new Error('need override getTransaction');
    }

    sendRawTransaction(rawTx, callback) {
        this.web3.eth.sendRawTransaction(rawTx, callback);
    }

    getEstimatedGas(txObj, callback) {
        throw new Error('need override sendRawTransaction');
    }

    tokenbalance(addr, token, callback) {

        var tokenContract = this.web3.eth.contract(tokenAbi).at(token.contractAddress);
        tokenContract.balanceOf(addr, (err, tokenBalance) => {
            if (err) {
                return callback(err);
            }
            var balance = new BigNumber(tokenBalance).div(new BigNumber(10).pow(token.decimal)).toString();
            callback(null, balance);
        })
    }


}

module.exports = NodeBase;