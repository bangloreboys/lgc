"use strict"
// strict to support bluemix deployment

// server.js
const fs = require('fs');
const express = require('express');
const Web3 = require('web3');
const bodyParser = require('body-parser');
var request = require("request");
const abiDecoder = require('abi-decoder');

//const solc = require('solc');
//TODO: externalize to properties file

var PORT = process.env.PORT || 5050;  //for bluemix

var web3 = new Web3();
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public')); //public folder for static content

var useProvider = "local"; //set 'local' to use Ganache on local mache or 'remote' to use rinkeby or other provider

//Defaults 7545 for Ganache , 8545 for testrpc/Ganache-cli
//TODO: externalize to properties file
var providerLocation = '';
var ganacheLocation = 'http://localhost:7545';
var rinkebyLocation = "https://rinkeby.infura.io/9PBP4aZ5wsWnylDXZIUp";
var rinkebyRPCLocation = "https://rinkeby.infura.io/9PBP4aZ5wsWnylDXZIUp:8545";

var forAccount = "0x469f17e6534ad8d765403f46bf86740b4fb668dc";
var contractAddress;

if (useProvider == 'local') {
	providerLocation = ganacheLocation;
	forAccount = "0x16A6B0750AD080cD9eC10BF93Fa73792E2120D4e";
} else {
	providerLocation = rinkebyLocation;
	forAccount = "0x469f17e6534ad8d765403f46bf86740b4fb668dc";
}


//(Re)Set based on instance used
web3.setProvider(new Web3.providers.HttpProvider(providerLocation));

function prepareContractsList() {
	var contList;
	console.log("getting contracts list")
	if (useProvider == "local") {
		console.log("Using contracts on local...");
		contList = [
			{ "address": "0", "name": "Please select a contract" },
			{ "address": "0x0ba28e097654b0802750e6489fc70c023f1e0e4c", "name": "A320 Contract - EYCON 54589" },
			{ "address": "0x3cdc14dcaba315bef59861bbf3e0f54d21c4452e", "name": "A380 Contract - EYCON 67683" }
		];

		forAccount = "0x16A6B0750AD080cD9eC10BF93Fa73792E2120D4e";
	} else {
		contList = [
			{ "address": "0", "name": "Please select a contract" },
			{ "address": "0xe2dB8D5ED69D94fe01183DC3607aA80dC3e190C5", "name": "B777 Contract - EYCON 54589" },
			{ "address": "0x5066667073799d733e3513c0c8cecf4cc3a774bf", "name": "B787 Contract - EYCON 67683" }
		];

		forAccount = "0x469f17e6534ad8d765403f46bf86740b4fb668dc";
	}

	return contList;
}


app.post('/loadcontracts', function (req, res) {
	res.json(prepareContractsList());
});

var contractABI = [
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

abiDecoder.addABI(contractABI);

app.listen(PORT, function () {
	console.log('Server is started on port:', PORT);
});

app.get('/', function (req, res) {
	res.sendFile('index.html');
});

// ** JSON API URLS for front end ***

// localhost:3000/accounts - get all accounts
app.get('/accounts', function (req, res) {
	web3.eth.getAccounts(function (err, accounts) {
		if (err == null) res.json(accounts);
	});
});

// get a specific transaction
// txn/0x0a41ec0ac9cbdb224ff5db91a90b030727788f9a3aebf191fc568aa4358582b5
app.get('/txn/:txhash', function (req, res) {
	web3.eth.getTransaction(req.params.txhash, function (err, txn) {
		if (err == null) res.json(txn);
	});

});

// to get transaction input data decoded of a Smart Contract Instance
// works only on SmartContract setter method txns
// txninput/0xd487d39ff423109187dc86423002d49a11de804b6c3a071815659d016f885805 
app.get('/txninput/:txhash', function (req, res) {
	web3.eth.getTransaction(req.params.txhash, function (err, txn) {
		if (err == null) {
			res.json(abiDecoder.decodeMethod(txn.input));
		}
	});

});

// test t
// Rest API for endpoint localhost:3000/transaction
app.get('/txcount', function (req, res) {
	var obj = web3.eth.getBlockTransactionCount("latest")
		.then(console.log);
	res.send(JSON.stringify(obj));

});

// /block - REST API to get a block  user /block/0 to get 0 block
app.get('/block/:blocknum', function (req, res) {
	web3.eth.getBlock(req.params.blocknum, function (error, block) {
		if (!error) {
			res.json(block);
		} else {
			console.error(error);
		}
	});
});

// a sample Post Handler for JSON object submitted via post
app.post('/testpost', function (req, res) {
	console.log(req.body);
	//can read as req.body.iatacode = "AUH";

	// Preparing the object to be send back
	var resObj = {};
	resObj.firstname = "John";
	resObj.lastname = "Doe";
	resObj.age = 33;
	res.json(resObj);
});

// api to get contract instance details
// 
app.get('/api/contractinst', function (req, res) {

	var contractinst = new web3.eth.Contract(contractABI, contractAddress);
	res.json(contractinst);

});


function getTransactionsByAccount(myaccount, contradd, startBlockNumber, endBlockNumber) {
	if (endBlockNumber == null) {
		new web3.eth.getBlockNumber(function (err, res) {
			if (err) {
				console.log("Error while getting block number...");
			} else {
				endBlockNumber = res;
				console.log("Using endBlockNumber: " + endBlockNumber);

				if (startBlockNumber == null) {
					startBlockNumber = 0;
					//startBlockNumber = endBlockNumber - 1000;
					console.log("Using startBlockNumber: " + startBlockNumber);
				}
				console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks " + startBlockNumber + " and " + endBlockNumber);
				var results = [];
				var ii = 0;
				for (var i = startBlockNumber; i <= endBlockNumber; i++) {
					/*if (i % 1000 == 0) {
						console.log("Searching block " + i);
					}*/
					var block = new web3.eth.getBlock(i, true, function (err, resp) {
						if (err) {
							console.log("Error while getting a block...");
						} else {
							if (resp != null && resp.transactions != null) {
								resp.transactions.forEach(function (e) {
									if (myaccount == e.from || contradd == e.to) {
										
										delete e.nonce;
										delete e.blockHash;
										delete e.transactionIndex;
										delete e.value;
										delete e.gasPrice;
										delete e.gas;
										var gotinput = "";
										if (e.input != 'undefined') {
											gotinput = abiDecoder.decodeMethod(e.input);
										}
										e.input = gotinput;
										results[ii] = e;
										ii++;
										console.log(e);
									}
								})
							}
						}
					});
				}

				return results;
			}
		});
	}
}

// api to get txns at an address at rinkeby 
// http://localhost:5050/api/txn/0x469f17e6534ad8d765403f46bf86740b4fb668dc
app.get('/api/txn/:address', function (req, res) {
	var address = req.params.address;

	if (useProvider == "local") {
		console.log('Fetching transactions for contract ' + contractAddress);
		getTransactionsByAccount(forAccount, contractAddress, 0, null, function(status, results) {
			//send the response back to the html code...
			console.log(JSON.stringify(results));
			res.json(results);
			console.log('<< Responded ' + address + " with " + results9.length + " transactions");
		});
	} else {
		var api_key = "C2DBPWS7DTZDGEPBC34MWV8D9SCT31PE5E";
		console.log('>> Entered /api/txn/' + address);
		var invokeurl = "http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=" + address + "&startblock=0&endblock=99999999&sort=asc&apikey=" + api_key;
		request.get(invokeurl, function (error, response, body) {
			if (error) {
				return console.log(error);
			}
			var bodyObj = JSON.parse(body);
			var results = bodyObj.result;

			var encrInp;

			// decode the transaction input
			for (var item in results) {
				encrInp = results[item].input;
				results[item].input = abiDecoder.decodeMethod(encrInp);

				// delete unwanted object attributes in response
				delete results[item].from;
				delete results[item].to;
				delete results[item].blockHash;
				delete results[item].gas;
				delete results[item].gasPrice;
				delete results[item].transactionIndex;
				delete results[item].isError;
				delete results[item].txreceipt_status;
				delete results[item].nonce;
				delete results[item].value;
				delete results[item].cumulativeGasUsed;
				delete results[item].gasUsed;
				delete results[item].confirmations;
			}
			res.json(results);
			console.log('<< Responded /api/txn/' + address + " with " + results.length + " transactions");
		});
	}
});


app.post('/recordcontract', function (req, res) {
	if (useProvider == 'local') {
		contractAddress = req.body.contaddr;
		//forAccount = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
		if (req.method == 'POST') {
			// console.log("ABI: " + contractABI);
			console.log("ContractAddress: " + contractAddress + " Account address :" + forAccount);
			var theContract = new web3.eth.Contract(contractABI, contractAddress);

			console.log("Inside POST.." + req.body.title);
			//theContract.methods.setTitle(req.body.title).send( function (err, res) {
			theContract.methods.setTitle(req.body.title).send({ from: forAccount }, function (err, res) {
				if (err) {
					console.log('Title: oh no...' + err.message);
				} else {
					console.log('Title: hurray...' + res);
				}
			});

			theContract.methods.setStatus(req.body.status).send({ from: forAccount }, function (err, res) {
				if (err) {
					console.log('Status: oh no...' + err.message);
				} else {
					console.log('Status: hurray...' + res);
				}
			});

			theContract.methods.setValidity(req.body.commdate, req.body.tenure, req.body.wardetails).send({ from: forAccount }, function (err, res) {
				if (err) {
					console.log('Validity: oh no...' + err.message);
				} else {
					console.log('Validity: hurray...' + res);
				}
			});
			theContract.methods.setAddress(req.body.eyaddress, req.body.contraddress).send({ from: forAccount }, function (err, res) {
				if (err) {
					console.log('Address: oh no...' + err.message);
				} else {
					console.log('Address: hurray...' + res);
				}
			});
			theContract.methods.setDescription(req.body.contrscope).send({ from: forAccount }, function (err, res) {
				if (err) {
					console.log('Description: oh no...' + err.message);
				} else {
					console.log('Description: hurray...' + res);
				}
			});
		}
	} else {
		//Rinkeby private key for account 0x469f17e6534ad8d765403f46bf86740b4fb668dc
		//0x678f26f38fad4f434bffd435435c3416afd627e280fad373e3e3ee8d78870a99
		var privateKey = '0x678f26f38fad4f434bffd435435c3416afd627e280fad373e3e3ee8d78870a99';

		var account = web3.eth.accounts.privateKeyToAccount(privateKey);
		web3.eth.accounts.wallet.add(account);  //adding account to wallet

		if (req.method == 'POST') {
			// console.log("ABI: " + contractABI);
			console.log("ContractAddress: " + contractAddress + " Account address :" + account.address);
			var theContract = new web3.eth.Contract(contractABI, contractAddress);

			theContract.options.from = account.address; // default from address
			theContract.options.gasPrice = '2'; // default gas price in wei
			theContract.options.gas = 5000000; // provide as fallback always 5M gas

			console.log("Inside POST.." + req.body.title);
			theContract.methods.setTitle(req.body.title).send(function (err, res) {
				//theContract.methods.setTitle(req.body.title).send({ from: account.address }, function (err, res) {
				if (err) {
					console.log('Title: oh no...' + err.message);
				} else {
					console.log('Title: hurray...' + res);
				}
			});

			theContract.methods.setStatus(req.body.status).send(function (err, res) {
				if (err) {
					console.log('Status: oh no...' + err.message);
				} else {
					console.log('Status: hurray...' + res);
				}
			});

			theContract.methods.setValidity(req.body.commdate, req.body.tenure, req.body.wardetails).send(function (err, res) {
				if (err) {
					console.log('Validity: oh no...' + err.message);
				} else {
					console.log('Validity: hurray...' + res);
				}
			});
			theContract.methods.setAddress(req.body.eyaddress, req.body.contraddress).send(function (err, res) {
				if (err) {
					console.log('Address: oh no...' + err.message);
				} else {
					console.log('Address: hurray...' + res);
				}
			});
			theContract.methods.setDescription(req.body.contrscope).send(function (err, res) {
				if (err) {
					console.log('Description: oh no...' + err.message);
				} else {
					console.log('Description: hurray...' + res);
				}
			});
		}
	}
});

app.post('/getcontract', function (req, res) {
	console.log("Getting contract details...");
	var resObj = {};
	contractAddress = req.body.contaddr;
	var theContract = new web3.eth.Contract(contractABI, contractAddress);
	theContract.methods.viewTitle().call(function (err, resp1) {
		if (err) {
			console.log("error in viewTitle: " + err.message);
			//resp1.error(err);
		}
		else {
			//set the title
			resObj.title = resp1; console.log(resObj.title);

			//get status
			theContract.methods.viewStatus().call(function (err, resp2) {
				if (err)
					console.log("error in viewStatus: " + err.message);
				else {
					resObj.status = resp2; console.log(resObj.status);

					//get commencement date; get tenure; get warranty
					theContract.methods.viewValidity().call(function (err, resp3) {
						if (err)
							console.log("error in viewValidity: " + err.message);
						else {
							resObj.commencedate = resp3[0].toString();
							resObj.tenure = resp3[1].toString();
							resObj.warranty = resp3[2].toString();
							console.log(resObj.commencedate + "-" + resObj.tenure + "-" + resObj.warranty);

							//get eyaddress; get partyaddress
							theContract.methods.viewAddress().call(function (err, resp4) {
								if (err)
									console.log("error in viewAddress: " + err.message);
								else {
									resObj.eyaddress = resp4[0].toString();
									resObj.partyaddress = resp4[1].toString();
									console.log(resObj.eyaddress + "-" + resObj.partyaddress);

									//get contractdescription
									theContract.methods.viewDescription().call(function (err, resp5) {
										if (err)
											console.log("error in viewDescription: " + err.message);
										else {
											resObj.description = resp5;
											console.log(resObj.description);

											//set json with returned values.
											console.log(resObj);
											res.json(resObj);
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});




app.post('/getTransactions', function (req, res) {
	console.log('Fetching transactions for contract ' + contractAddress);
	getTransactionsByAccount(forAccount);
});

function getTxDecodedInput(txhash) {
	web3.eth.getTransaction(txhash, function (err, txn) {
		if (err == null) {
			return abiDecoder.decodeMethod(txn.input);
		}
		return "0";
	});

}

