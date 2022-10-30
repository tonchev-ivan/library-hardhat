const hre = require("hardhat");
const EtherscanProvider = hre.ethers.providers.EtherscanProvider;
const Library = require('../artifacts/contracts/Library.sol/Library.json');
const run = async function() {
    const contractAddress = process.env.CONTRACT_ADDRESS;

    provider = new EtherscanProvider("goerli");
    provider = new EtherscanProvider(5);

    network = hre.ethers.providers.getNetwork("goerli");
    provider = new EtherscanProvider(network,process.env.ETHERSCAN_API_KEY);

    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const balance = await wallet.getBalance();
    console.log("================ Balance: "+ hre.ethers.utils.formatEther(balance, 18));

    const libraryContract = new hre.ethers.Contract(contractAddress, Library.abi, wallet);

    // add new book
    await libraryContract.addNewBook("test", 1);

    const availableBooks = await libraryContract.getAvailableBooks();
    // get ids of all available books
    console.log(availableBooks);

    // borrow book
    await libraryContract.borrowBook(1);
    console.log(await libraryContract.getAvailableBooks());
    await libraryContract.returnBook(0);
    console.log(await libraryContract.getAvailableBooks());
}

run()