(function () {
    'use strict';
    const ethereumjsUtil = require('ethereumjs-util');
    const EtherscanApi = require('./js/etherscan-api.js');
    const etherscanApi = new EtherscanApi('WDS29B49XSEH8DKJ8I712JKVJZHUPUDNBI');
    
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
                    $scope.$apply();
                    // console.log(etherBalance);
                });

                $scope.myEtherWallet.tokens = [];
                var gnxToken = {
                    name: 'GNX',
                    contractAddress: '0x6ec8a24cabdc339a06a172f8223ea557055adaa5',
                    decimal: 9,
                    balance:'loading'
                }
                $scope.myEtherWallet.tokens.push(gnxToken);
                this.setToken(gnxToken);
            }

            setToken(token) {

                
                etherscanApi
                    .tokenbalance(this.address, token.contractAddress)
                    .then((data) => {
                        var balance = new BigNumber(data.result).div(new BigNumber(10).pow(token.decimal)).toString();
                        token.balance = balance;
                        $scope.$apply();
                        
                    });
            }
        }
        ///mywallet init

    }
})();