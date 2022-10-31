const Library = require('../artifacts/contracts/Library.sol/Library.json');
export async function interact(hre, params) {
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