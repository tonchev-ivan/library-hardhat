require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: 'ETH',
    gasPrice: 20,
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    coinmarketcap: process.env.COINMARKETCAP_TOKEN,
    maxMethodDiff: 25,
  },
  networks: {
    hardhat: {},
    goerli: {
      allowUnlimitedContractSize: true,
      url: process.env.API_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
    },
  }
};
