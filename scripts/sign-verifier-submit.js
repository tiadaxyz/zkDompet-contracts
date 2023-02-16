const { ethers } = require('hardhat');
const { signMetaTxRequest } = require('../src/signer');
const { readFileSync, writeFileSync } = require('fs');

const DEFAULT_NAME = 'sign-test';

function getInstance(name) {
  const address = JSON.parse(readFileSync('deploy.json'))[name];
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);
  return ethers.getContractFactory(name).then(f => f.attach(address));
}

async function main() {
  const forwarder = await getInstance('MinimalForwarder');
  const multiSigWallet = await getInstance("MultiSigWalletMetaTxnWithVerifier");

  const { NAME: name, PRIVATE_KEY: signer } = process.env;
  const from = new ethers.Wallet(signer).address;
  console.log(`Signing registration of ${name || DEFAULT_NAME} as ${from}...`);
  const data = multiSigWallet.interface.encodeFunctionData(
    'submitTransaction', 
    [
      "0xBb0582EaD520EDE2996D62A5e44A3d86e056991B", // to
      140000000000000, // _value
      "0x00", // data
    ]
    );
  const result = await signMetaTxRequest(signer, forwarder, {
    to: multiSigWallet.address, from, data
  });

  writeFileSync('tmp/request.json', JSON.stringify(result, null, 2));
  console.log(`Signature: `, result.signature);
  console.log(`Request: `, result.request);
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}