// import { setTimeout } from 'timers';

(function () {
    'use strict';
    const ethereumjsUtil = require('ethereumjs-util');
    const nodes = require('./js/nodes');
    const ethTokens = require('./tokens/ethtokens.json');
    const EthereumTx = require('ethereumjs-tx');


    angular
        .module('app')
        .controller('etherWalletController', etherWalletController);

    etherWalletController.$inject = ['$scope', '$http'];
    function etherWalletController($scope, $http) {
        var vm = this;

        $scope.myEtherWallet = { tx: {} };
        $scope.myEtherWallet.privateKey = null;
        $scope.myEtherWallet.show = false;

        $scope.unlockWallet = function () {
            var privateKey = $scope.myEtherWallet.privateKey;
            if (privateKey) {

                var privBuff = new Buffer(privateKey, 'hex');
                if (ethereumjsUtil.isValidPrivate(privBuff)) {
                    var address = ethereumjsUtil.privateToAddress(privBuff);
                    // address = ethereumjsUtil.addHexPrefix(address);
                    $scope.myEtherWallet.wallet = new MyWallet(privBuff, address);
                    $scope.myEtherWallet.show = true;
                }
            }
        }
        $scope.genTx = function () {
            if ($scope.myEtherWallet.tx) {
                var tx = $scope.myEtherWallet.tx;

                $scope.myEtherWallet.wallet.genTransaction(tx.toAddress, tx.gasLimit, tx.amount, (error, genTxData) => {

                    $scope.showTxHash = false;
                    $scope.txHash = null;
                    $scope.showSendTransaction = true;
                    $scope.genTxData = {
                        rawJson: JSON.stringify(genTxData.rawJson),
                        signedTx: genTxData.signedTx
                    };
                    // $scope.$apply();
                })

            }
        }

        $scope.sendTx = function () {
            if ($scope.showSendTransaction && $scope.genTxData.signedTx) {
                $scope.myEtherWallet.wallet.sendTransaction($scope.genTxData.signedTx, (error, txHash) => {
                    if(error) {
                        toastr.error(error.toString());
                        return;
                    }
                    $scope.showTxHash = true;
                    $scope.txHash = txHash;
                    $scope.$apply();
                });

            }
        }

        class MyWallet {


            constructor(privateKey, address) {
                this.privateKey = privateKey;
                this.wallet = null;
                this.address = ethereumjsUtil.bufferToHex(address);
                this.ethNode = new nodes['RopstenInfura']({ Web3: Web3, $http: $http });
                this.init();


            }

            init() {
                $scope.myEtherWallet.address = this.address;
                this.ethNode.getBalance(this.address, (error, balance) => {
                    $scope.myEtherWallet.balance = balance;
                    $scope.$apply();
                });

                $scope.myEtherWallet.tokens = [];

                ethTokens.forEach((token) => {
                    this.addToken(token);
                });

            }

            addToken(token) {
                token.balance = 'loading';
                token.name = token.symbol;
                $scope.myEtherWallet.tokens.push(token);
                this.setToken(token);
            }

            setToken(token) {

                this.ethNode.tokenbalance(this.address, token, (error, balance) => {
                    token.balance = balance;
                    $scope.$apply();
                });
            }

            genTransaction(to, gasLimit, amount, cb) {
                const privateKey = ethereumjsUtil.toBuffer(this.privateKey);
                gasLimit = '0x' + new BigNumber(gasLimit).toString(16);
                var amountWei = this.ethNode.web3.toWei(amount, 'ether');
                amount = '0x' + new BigNumber(amountWei).toString(16);
                const gasPrice = '0x' + this.ethNode.web3.eth.gasPrice.toString(16);
                var count = this.ethNode.web3.eth.getTransactionCount(this.address);
                var nonce = '0x' + new BigNumber(count).toString(16);

                const txParams = {
                    nonce: nonce,
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    to: to,
                    value: amount,
                    data: null,
                    // EIP 155 chainId - mainnet: 1, ropsten: 3
                    chainId: 3
                }
                const tx = new EthereumTx(txParams);
                tx.sign(privateKey);
                const serializedTx = tx.serialize();
                var rawTx = '0x' + serializedTx.toString('hex');
                cb(null, { rawJson: txParams, signedTx: rawTx });
            }

            sendTransaction(rawTx, cb) {
                this.ethNode.sendRawTransaction(rawTx, cb);
            }
        }
    }
})();