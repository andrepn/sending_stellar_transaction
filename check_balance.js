//Current account: Account 2

// use the stellar-sdk
const StellarSdk = require('stellar-sdk');

//talk to the horizon testnet
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();

//enter the account we want to check and save
//for more convenience this could be i/o or read a file
var pubkey = "GBJYVTRGL5ZLGVQV3Q47ETKVRPGFGWURMEJQF2PDJVDRINKHHR7A7KQZ";

(async function main() {

  //load the new account
  const account = await server.loadAccount(pubkey);
  console.log("Balances for account: " + pubkey);

  //print the balances
  account.balances.forEach(function(balance) {
    console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
  });
})()
