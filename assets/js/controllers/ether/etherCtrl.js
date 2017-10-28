(function () {
    'use strict';
    var ethereumjsUtil = require('ethereumjs-util');

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

                this.init();
            }

            init() {
                $scope.myEtherWallet.address = this.address;
                var web3 = new Web3();
                web3.setProvider(new web3.providers.HttpProvider('https://api.myetherapi.com/eth'));
                this.wallet = web3.eth;
                web3.eth.getBalance(this.address, 'latest', (error, result) => {
                    var weiBalance = result.toNumber();
                    var etherBalance = web3.fromWei(weiBalance, 'ether');
                    $scope.myEtherWallet.balance = etherBalance;
                    console.log(etherBalance);
                });
            }
        }
        ///mywallet init

    }
})();