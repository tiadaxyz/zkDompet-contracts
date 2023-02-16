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
      ["0x046eae630acc71b5684e94af27e3e423ef7ca30949a1acfdd1ab5a4a9fc83c36","0x19e3813b071cff644fc37acf1948763f8e94ee8b5ad273e73cd93bf8d65a3b21"], //a
      [["0x1741d0356896a3fe19d911cab4da84493088257f1efddabf7814b2744d6ca154","0x06567d0ec99b96e9eef31d7ea028d889aaff9bcdd5bcf8f7e855e50c90304dd3"],["0x17e9f97c8038e916a70ffde4acf19123e6375645f6c948b70398dcebf93bf5b1","0x24b3c95db8664035f237bdb40db835b7269444b9173f686ba06e9edc45d1be04"]], //b
      ["0x07bb354016eb8d673a1a0504d39e7e03b2d23213036ba2560f463f544fbc42ee","0x0856701141525422d20d81bd3ed7c671b303de6fd084b75749bd57d7801cc227"], //c
      ["0x0000000000000000000000000000000000000000000000000000000000000021"], //input
    
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