
async function interact(hre, params) {
    const Library = require('../artifacts/contracts/Library.sol/Library.json');
    const wallet = new hre.ethers.Wallet(params.privateKey, params.provider);
    const libraryContract = new hre.ethers.Contract(params.contractAddress, Library.abi, wallet);

    // add new book
    await libraryContract.addNewBook("test", 1);

    const availableBooks = await libraryContract.getAvailableBooks();
    // get ids of all available books
    console.log(availableBooks);

    // borrow book
    await libraryContract.borrowBook(0);
    console.log(await libraryContract.getAvailableBooks());
    await libraryContract.returnBook(0);
    console.log(await libraryContract.getAvailableBooks());
}

task("interact", "Interacts with Library contract")
    .addOptionalParam("ntwrk", "The network to use - supported networks: [local, goerli]", "local")
    .setAction(async (taskArgs, hre) => {

        const params = {};
        if (taskArgs['ntwrk'] == 'local') {
            params.provider = new hre.ethers.providers.JsonRpcProvider('http://localhost:8545');
            params.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
            params.privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
        } else if (taskArgs['ntwrk'] == 'goerli') {
            const EtherscanProvider = hre.ethers.providers.EtherscanProvider;
            const network = hre.ethers.providers.getNetwork("goerli");
            params.provider = new EtherscanProvider(network, process.env.ETHERSCAN_API_KEY);
            params.contractAddress = process.env.CONTRACT_ADDRESS;
            params.privateKey = process.env.PRIVATE_KEY;
        }
        await interact(hre, params);
    }
    );