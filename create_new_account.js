// use the stellar-sdk
const StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');

// generate keypair to use for account
var pair = StellarSdk.Keypair.random();
var pubkey = pair.publicKey();

//print the keypair to be used so I can save and send transactions
console.log("pubkey: " + pubkey + " secret: " + pair.secret());

//talk to the horizon testnet
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();

//create main function using async/await pattern
(async function main() {
  try {
    //use friendbot to fund the new account
    var response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(pubkey)}`
    );
    //confirm the new account when the server responds
    var responseJSON = await response.json();
    console.log("SUCCESS! You have a new account :)\n", responseJSON);
  } catch (e) {
    console.error("ERROR!", e);
  }
})()
