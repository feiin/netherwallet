"use strict";
const request = require('request');
const querystring = require('querystring');

const url = 'https://api.etherscan.io/api';
const testUrls = {
  'ropsten': 'https://ropsten.etherscan.io/api',
  'kovan': 'https://kovan.etherscan.io/api',
  'rinkeby': 'https://rinkeby.etherscan.io/api'
};


class EtherscanApi {

  constructor(apiKey, chain) {
    this.apiKey = apiKey;
    this.chain = chain;
    this.url = this.getChainUrl(chain);
  }

  getChainUrl(chain) {
    if (!chain) {
      return url;
    }

    if (!testUrls[chain]) {
      throw Error('invalid chain: ' + chain);
    }

    return testUrls[chain];
  }

  makeGetRequest(query) {
    const url = this.url;
    var p = new Promise(function (resolve, reject) {
      
      var options = {
        method: 'GET',
        url: url + '?' + query,
        json: true
      }
      request.get(options, function (err, response, data) {
        if (err) {
          return reject(err);
        }
        if (data.status && data.status != 1) {
          return reject(data.message);
        }

        resolve(data);
      });
    });
    return p;
  }

  tokenbalance(address, contractaddress) {
    const apiKey = this.apiKey;
    const module = 'account';
    const action = 'tokenbalance';
    const tag = 'latest';

    var queryObject = {
      module, action, apiKey, tag
    };

    if (contractaddress) {
      queryObject.contractaddress = contractaddress;
    }

    if (address) {
      queryObject.address = address;
    }

    var query = querystring.stringify(queryObject);
    return this.makeGetRequest(query);
  }

}

module.exports = EtherscanApi;
