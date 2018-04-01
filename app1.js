// at root of project


// set browser
const express = require('express');
let app = express();
const PORT = 3000;

module.exports = function(callback) {

    var ABI = [
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "viewStatus",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "viewTitle",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "viewValidity",
        "outputs": [
          {
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "viewAddress",
        "outputs": [
          {
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "viewDescription",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ];

    
    // set Ganache
    var providerLocation = 'http://localhost:8080';
    var output;
    const Web3 = require('web3');
    let web3 = new Web3();
    var contractAddress = "0x8cdaf0cd259887258bc13a92c0a6da92698644c0";
 
    web3.setProvider(new Web3.providers.HttpProvider(providerLocation));

    console.log("1.............." + contractAddress);
    var myContract = new web3.eth.Contract(ABI, contractAddress);
    //var myContract = web3.eth.contract(ABI).at(contractAddress);
    console.log("2.............." + myContract.methods.viewStatus);

    /*myContract.methods.viewTitle().call().then(function(v) {
      var strName= v.toString();
      console.log("Title: "+ strName);   
      });
      */

    myContract.methods.viewTitle().call().then(console.log);

    /*
    // localhost:3000/accounts
        app.get('/accounts', function (req, res) {
            promise = myContract.methods.getNumber().call(); 
            output = promise.then(res, err);
//            myContract.methods.getNumber().call().then(console.log);
//            myContract.methods.getNumber().call().then(function (err, accounts) {
//                if (err == null) res.json(accounts);
//            });
        });

    var promise;
    //promise.then(onFulfilled, onRejected);
    promise = myContract.methods.getNumber().call(); 
    output = promise.then(console.log, console.error);
//    myContract.methods.getNumber().call().then(console.log);

*/
}

/*
app.listen(PORT, function () {
    console.log('Server is started on port:', PORT);
});
*/