// transaction from Account 1 to Account 2 from accounts.txt for 8.5

//import stellar sdk
const stellarsdk = require('stellar-sdk');

//set source account with secret
//for convenience could read from file or have input
var sourcesecretkey = 'SALX2FTMDTHKCNUHT6TNIMRDWK7A5F4Z4PLH2F5KQFX5OCV4TMAJ2VT4';

//get full keypair
var sourcekeypair = stellarsdk.Keypair.fromSecret(sourcesecretkey);
var sourcepublickey = sourcekeypair.publicKey();

var receiverpublickey = 'GBJYVTRGL5ZLGVQV3Q47ETKVRPGFGWURMEJQF2PDJVDRINKHHR7A7KQZ';

//use horizon server test network
const server = new stellarsdk.Server('https://horizon-testnet.stellar.org');
stellarsdk.Network.useTestNetwork();

(async function main() {
  // Transactions require a valid sequence number that is specific to this account.
  // We can fetch the current sequence number for the source account from Horizon.
  var account = await server.loadAccount(sourcepublickey);


  // get the current fee
  var fee = await server.fetchBaseFee();


  const transaction = new stellarsdk.TransactionBuilder(account, { fee })
    // Add a payment operation to the transaction
    .addOperation(stellarsdk.Operation.payment({
      destination: receiverpublickey,
      //set asset to lumens
      asset: stellarsdk.Asset.native(),
      //set amount to pay
      amount: '8.5',
    }))
    //transaction must confirm in 30 seconds
    .setTimeout(30)
    //add memo
    .addMemo(stellarsdk.Memo.text('the rooster'))
    .build();

  //sign this transaction with the secret key
  transaction.sign(sourcekeypair);

  //let's see the XDR (encoded in base64) of the transaction we just built
  console.log(transaction.toEnvelope().toXDR('base64'));

  //submit transaction
  try {
    const transactionResult = await server.submitTransaction(transaction);
    console.log(JSON.stringify(transactionResult, null, 2));
    console.log('\nSuccess! View the transaction at: ');
    console.log(transactionResult._links.transaction.href);
  } catch (e) {
    console.log('An error has occured:');
    console.log(e);
  }
})();
