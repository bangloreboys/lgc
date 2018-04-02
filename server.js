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
var providerLocation = 'http://localhost:8545';

web3.setProvider(new Web3.providers.HttpProvider(providerLocation));
/**
 * 
 * contract addresses:
 * 
 * 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
 * 0x2e2d10b41b7c8ddb995568a87185428d9a513ead
 * 0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc
 * 0x02e871627967d7c4586fcf2174ce7ac2c29f4ead
 * 
 */
var contractAddress = "0x02e871627967d7c4586fcf2174ce7ac2c29f4ead";

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
        theContract.methods.setTitle(req.body.title).call(function (err, res) {
            if (err) {
                console.log('oh no...'+err.message);
            } else {
                console.log('hurray...');
            }
        });

        var resObj = {};
        theContract.methods.viewTitle().call(function (err, resp) {
			if(err)
				console.log("error in viewTitle: " + err.message);
			else {
				resObj.title = resp;
				//console.log(resObj.title);
			}	
		}).then(console.log);
        theContract.methods.viewStatus().call(function (err, resp) {
			if(err)
				console.log("error in viewStatus: " + err.message);
			else {
				resObj.status = resp;
				//console.log(resObj.title);
			}
		}).then(console.log);

		console.log(resObj.title + " - " + resObj.status);
		res.json(resObj);
    }
});


app.listen(PORT, function () {
    console.log('Server is started on port:', PORT);
});