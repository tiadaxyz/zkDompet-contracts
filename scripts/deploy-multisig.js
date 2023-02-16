const { ethers } = require('hardhat');
const { writeFileSync } = require('fs');

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

async function main() {
  const forwarder = await deploy('MinimalForwarder');
  // const registry = await deploy("Registry", forwarder.address);
  const multiSigWallet = await deploy(
    "MultiSigWalletMetaTxn",
    [
      // "0x264dABD1fbF0da59Cb22E0B4b6146aA26dA669BF", // my wallet
      "0x446008101d998584837e01c3bbc0d3055e37b189" // relayer
    ],
    1,
    forwarder.address
    );

  writeFileSync('deploy.json', JSON.stringify({
    MinimalForwarder: forwarder.address,
    MultiSigWallet: multiSigWallet.address,
  }, null, 2));

  console.log(`MinimalForwarder: ${forwarder.address}\nMultiSigWallet: ${multiSigWallet.address}`);
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}