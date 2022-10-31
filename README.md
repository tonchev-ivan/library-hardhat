# Book Library Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, travis CI build, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat test # using env var COINMARKETCAP_TOKEN
npx hardhat coverage # coverage report
npx codechecks

# deployment
npx hardhat run --network {localhost/goerli} scripts/deploy.js

# interaction task
npx hardhat interact --ntwrk local
npx hardhat interact --ntwrk goerli
```
