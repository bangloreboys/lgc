// server.js
const fs = require('fs');
const express = require('express');
const Web3 = require('web3');
const bodyParser = require('body-parser');
//const solc = require('solc');
//TODO: externalize to properties file
const PORT = 5050;

let web3 = new Web3();
let app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public')); //public folder for static content

//Defaults 7545 for Ganache , 8545 for testrpc/Ganache-cli
//TODO: externalize to properties file
var providerLocation = 'http://localhost:7545';

web3.setProvider(new Web3.providers.HttpProvider(providerLocation));
/**
 * 
 * contract addresses:
 * 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
 * 
 */
var contractAddress = "0x8cdaf0cd259887258bc13a92c0a6da92698644c0";

var forAccount = "0x627306090abab3a6e1400e9345bc60c78a8bef57";

//var input = fs.readFileSync('./contracts/ContractLG.sol').toString();
//console.log(input);
//var compiledContract = solc.compile(input);
//var input = {'ContractLG.sol':fs.readFileSync('./contracts/ContractLG.sol', 'utf8')}
//let compiledContract = solc.compile({sources : input}, 1);
//console.log(compiledContract);
//let abi = JSON.parse(compiledContract.contracts[':ContractLG'].interface);

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
    console.log (req.body);
    //can read as req.body.iatacode = "AUH";

    // Preparing the object to be send back
    var resObj =  {};
    resObj.firstname = "John";
    resObj.lastname = "Doe";
    resObj.age = 33;
    res.json(resObj);
});

app.post('/recordcontract', function (req, res) {
    if (req.method == 'POST') {
        console.log("ABI: " + contractABI);
        console.log("ContractAddress: " + contractAddress);
        var theContract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("Inside POST.."+ req.body.title);
        theContract.methods.setTitle(req.body.title).send({from:forAccount}, function (err, res) {
            if (err) {
                console.log('oh no...'+err.message);
            } else {
                console.log('hurray...'+res);
            }
        });
    }
});

/*
app.post('/getTransactions', function (req, res) {
	console.log('Fetching transactions for contract ' + contractAddress);
	// Fetch all transaction logs with the specified address
    var filter = web3.eth.Filter({fromBlock: 0, toBlock: 'latest', address: contractAddress}, function(error, result) {
		// Get all entries
		var results = filter.get(function(error, result){
			if (!error)
			  console.log("[I] Fetched all transactions sent or sent to " + contractAddress);
			 else
			  console.log("[E] An error has occurred " + error);
		});
	
		var json_tuple;
		// Iterate through the transactions in the logs 
		for(var log in results) {
			var log_tx_hash = log.transactionHash;
			console.log("Transaction has : " + log_tx_hash);
			// Lookup transaction with hash
			var tx = web3.eth.getTransaction(log_tx_hash);
			// Check the to and from addresses. We skip transactions unrelated to the current sender
			if(tx.from === "0x627306090abab3a6e1400e9345bc60c78a8bef57") {
				// Parse transaction data and check recipient
				json_tuple = JSON.parse(tx.input);
				if(field in json_tuple) {
					//Do something with a field of the input data sent
					// as a JSON object
					console.log("We have found a transaction with data: " + json_tuple[[field]]);
					console.log("----------------****-----------------");
				}
			}
		}
	});
});
*/

app.post('/getcontract', function (req, res) {
	console.log("Getting contract details...");
	var resObj = {};
	var theContract = new web3.eth.Contract(contractABI, contractAddress);
    theContract.methods.viewTitle().call(function (err, resp1) {
		if(err) {
			console.log("error in viewTitle: " + err.message);
			res.error(err);
		}
		else {
			//set the title
			resObj.title = resp1; console.log(resObj.title);

			//get status
			theContract.methods.viewStatus().call(function (err, resp2) {
				if(err)
					console.log("error in viewStatus: " + err.message);
				else {
					resObj.status = resp2; console.log(resObj.status);

					//get commencement date; get tenure; get warranty
					theContract.methods.viewValidity().call(function (err, resp3) {
						if(err)
							console.log("error in viewValidity: " + err.message);
						else {
							resObj.commencedate = resp3[0].toString();
							resObj.tenure = resp3[1].toString();
							resObj.warranty = resp3[2].toString();
							console.log(resObj.commencedate + "-" + resObj.tenure + "-" + resObj.warranty);
					
							//get eyaddress; get partyaddress
							theContract.methods.viewAddress().call(function (err, resp4) {
								if(err)
									console.log("error in viewAddress: " + err.message);
								else {
									resObj.eyaddress = resp4[0].toString();
									resObj.partyaddress = resp4[1].toString();
									console.log(resObj.eyaddress + "-" + resObj.partyaddress);

									//get contractdescription
									theContract.methods.viewDescription().call(function (err, resp5) {
										if(err)
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



app.listen(PORT, function () {
    console.log('Server is started on port:', PORT);
});

app.post('/getTransactions', function (req, res) {
	console.log('Fetching transactions for contract ' + contractAddress);
	getTransactionsByAccount(forAccount);
});


function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
	if (endBlockNumber == null) {
		new web3.eth.getBlockNumber(function(err, res) {
			if(err) {
				console.log("Error while getting block number...");
			} else {
				endBlockNumber = res;
				console.log("Using endBlockNumber: " + endBlockNumber);

				if (startBlockNumber == null) {
					startBlockNumber = 0;
					//startBlockNumber = endBlockNumber - 1000;
					console.log("Using startBlockNumber: " + startBlockNumber);
				}
				console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
			  
				for (var i = startBlockNumber; i <= endBlockNumber; i++) {
					/*if (i % 1000 == 0) {
						console.log("Searching block " + i);
					}*/
					var block = new web3.eth.getBlock(i, true, function(err, resp) {
						if(err) {
							console.log("Error while getting a block...");
						} else {
							console.log("Printing block: " + resp);
							if (resp != null && resp.transactions != null) {
								resp.transactions.forEach( function(e) {
									//if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
										console.log("  tx hash          : " + e.hash + "\n"
										+ "   nonce           : " + e.nonce + "\n"
										+ "   blockHash       : " + e.blockHash + "\n"
										+ "   blockNumber     : " + e.blockNumber + "\n"
										+ "   transactionIndex: " + e.transactionIndex + "\n"
										+ "   from            : " + e.from + "\n" 
										+ "   to              : " + e.to + "\n"
										+ "   value           : " + e.value + "\n"
										+ "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
										+ "   gasPrice        : " + e.gasPrice + "\n"
										+ "   gas             : " + e.gas + "\n"
										+ "   input           : " + e.input);
		
										console.log("------------------*******------------------");
										console.log("Contract: " + e.to);
										console.log(web3.utils.toAscii(e.input));
										console.log("------------------*******------------------");
									//}
								})
							}
						}
					});
				}
			}
		});
	}
}