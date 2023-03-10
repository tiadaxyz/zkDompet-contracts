require('dotenv').config();

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
 },
  networks: {
    local: {
      url: 'http://localhost:8545'
    },
    // xdai: {
    //   url: 'https://dai.poa.network',
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      // url: 'https://goerli.blockpi.network/v1/rpc/public',
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    
  }
};
