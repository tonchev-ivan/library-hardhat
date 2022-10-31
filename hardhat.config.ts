require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");
import { any } from "hardhat/internal/core/params/argumentTypes";
import * as interactJS from "./scripts/interact.ts";

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


task("interact", "Interacts with Library contract")
  .addOptionalParam("ntwrk", "The network to use - supported networks: [local, goerli]", "local")
  .setAction(async (taskArgs, hre) => {

    const params = {} as any;
    if (taskArgs['ntwrk'] == 'local') {
      params.provider = new hre.ethers.providers.JsonRpcProvider('http://localhost:8545');
      params.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      params.privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    } else if (taskArgs['ntwrk'] == 'goerli') {
      const EtherscanProvider = hre.ethers.providers.EtherscanProvider;
      const network = hre.ethers.providers.getNetwork("goerli");
      params.provider = new EtherscanProvider(network, process.env.ETHERSCAN_API_KEY);
      params.contractAddress = process.env.CONTRACT_ADDRESS as string;
      params.privateKey = process.env.PRIVATE_KEY as string;
    }
    await interactJS.interact(hre, params);
  }
  );
