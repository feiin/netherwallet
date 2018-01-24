// import { setTimeout } from 'timers';

(function () {
    'use strict';
    const ethereumjsUtil = require('ethereumjs-util');
    const nodes = require('./js/nodes');
    const ethTokens = require('./tokens/ethtokens.json');


    angular
        .module('app')
        .controller('etherWalletController', etherWalletController);

    etherWalletController.$inject = ['$scope', '$http'];
    function etherWalletController($scope, $http) {
        var vm = this;

        $scope.myEtherWallet = {};
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

        class MyWallet {
            constructor(privateKey, address) {
                this.privateKey = privateKey;
                this.wallet = null;
                this.address = ethereumjsUtil.bufferToHex(address);
                this.ethNode = new nodes['RopstenInfura']({ Web3: Web3, $http:$http });
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
        }
    }
})();