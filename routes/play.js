require("dotenv").config()

var express = require('express');
var util = require('../config/util.js');
var router = express.Router();
const { Web3 } = require('web3');
const BNB_PROVIDER = process.env.BNB_PROVIDER;
const CONTRACT_ADDRESS = process.env.TOKEN_ADDRESS;

const web3 = new Web3(BNB_PROVIDER);

const contractABI = [
    { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" },
    {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];
const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);


router.get('/', function(req, res) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/', function(req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    res.redirect('/game/' + token + '/' + side);
});

router.post('/get-token-symbol', async function(req, res) {
    try {
        const result = await contract.methods.symbol().call();
        console.log('Result of symbol function:', result);
        res.json({ symbol: result }); 
    } catch (error) {
        console.error('Error calling read function:', error);
        res.status(500).json({ error: 'Internal server error' }); 
    }
});

router.post('/get-user-allowance', async function(req, res) {
    try {
        const userAddress = req.body.user;
        const spenderAddress = req.body.spender;

        const result = await contract.methods.allowance(userAddress, spenderAddress).call();
        const allowance = result.toString();
        console.log('Result of allowance function:', allowance);
        
        res.json({ allowance: allowance }); 
    } catch (error) {
        console.error('Error calling read function:', error);
        res.status(500).json({ error: 'Internal server error' }); 
    }
});

module.exports = router;