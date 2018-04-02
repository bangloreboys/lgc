// at root of project


// set browser
const express = require('express');
let app = express();
const PORT = 3000;

module.exports = function(callback) {

    var ABI = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "peyaddress",
            "type": "string"
          },
          {
            "name": "ppartyaddress",
            "type": "string"
          }
        ],
        "name": "setAddress",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "pdescription",
            "type": "string"
          }
        ],
        "name": "setDescription",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "pstatus",
            "type": "string"
          }
        ],
        "name": "setStatus",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "ptitile",
            "type": "string"
          }
        ],
        "name": "setTitle",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "pdate",
            "type": "string"
          },
          {
            "name": "ptenure",
            "type": "string"
          },
          {
            "name": "pwarranty",
            "type": "string"
          }
        ],
        "name": "setValidity",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
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
      },
      {
        "constant": true,
        "inputs": [],
        "name": "viewStatus",
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
      }
    ];

    
    // set Ganache
    var providerLocation = 'http://localhost:8545';
    var output;
    const Web3 = require('web3');
    let web3 = new Web3();
    var contractAddress = "0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc";
  
    web3.setProvider(new Web3.providers.HttpProvider(providerLocation));

    console.log("1.............." + contractAddress);
    var myContract = new web3.eth.Contract(ABI, contractAddress);
    //var myContract = web3.eth.contract(ABI).at(contractAddress);
    console.log("2.............." + myContract.methods.viewStatus);

    myContract.methods.viewTitle().call().then(function(v) {
      var strName = JSON.stringify(v);
      console.log("Title: "+ strName);   
    });

    myContract.methods.viewStatus().call().then(function(v) {
      var strName = JSON.stringify(v);
      console.log("Status: "+ strName);   
    });

    myContract.methods.viewValidity().call().then(function(v) {
      var strName = JSON.stringify(v);
      console.log("Validity: "+ strName);   
    });

    myContract.methods.viewAddress().call().then(function(v) {
      var strName = JSON.stringify(v);
      console.log("Address: "+ strName);   
    });

    myContract.methods.viewDescription().call().then(function(v) {
      var strName = JSON.stringify(v);
      console.log("Description: "+ strName);   
    });

    
  
/*  works
    myContract.methods.viewTitle().call().then(console.log);
    myContract.methods.viewStatus().call().then(console.log);
    myContract.methods.viewValidity().call().then(console.log);
    myContract.methods.viewAddress().call().then(console.log);
    myContract.methods.viewDescription().call().then(console.log);
*/

    var promise;
    promise = myContract.methods.viewDescription().call(); 
    promise.then(console.log, console.error);



    console.log("ABI: " + ABI);
    console.log("ContractAddress: " + contractAddress);
    var myContract = new web3.eth.Contract(ABI, contractAddress);
    console.log("Inside POST..");
    myContract.methods.setTitle("New Tile Set thro Truffle").send({from: '0xf17f52151ebef6c7334fad080c5704d77216b732'}, function (err, res) {
        if (err) {
            console.log('oh no...'+err.message);
        } else {
            console.log('hurray...' + res);
        }
    });

    myContract.methods.viewTitle().call(function (err, resp) {
			if(err)
				console.log("error in viewTitle: " + err.message);
			else {
				//resObj.title = resp;
				console.log(resp);
			}	
		}).then(console.log);
}

/*
app.listen(PORT, function () {
    console.log('Server is started on port:', PORT);
});
*/
