const hre = require("hardhat");
const Library = require('../artifacts/contracts/Library.sol/Library.json');
const run = async function () {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545");
    const latestBlock = await provider.getBlock("latest");
    console.log(latestBlock.hash);

    const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const balance = await wallet.getBalance();
    console.log(hre.ethers.utils.formatEther(balance, 18))
    console.log(balance.toString());

    const libraryContract = new hre.ethers.Contract(contractAddress, Library.abi, wallet);
    await libraryContract.addNewBook("test", 1);
    console.log(await libraryContract.getAvailableBooks());
    console.log("getBookAvailableCopies" + await libraryContract.getBookAvailableCopies(0));

    await libraryContract.borrowBook(0);
    console.log("state" + await libraryContract.getBookBorrowerState(0));
    await libraryContract.returnBook(0);
    console.log(await libraryContract.getAvailableBooks());
    console.log("state" + await libraryContract.getBookBorrowerState(0));

    console.log("getBookAvailableCopies" + await libraryContract.getBookAvailableCopies(0));
}

run()