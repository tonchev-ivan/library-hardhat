import { expect } from "chai";
import hre from "hardhat";


describe("Library", function () {
	let testContract: any;
	const bookName = "Chronicles of Amber";
	// book errors
	const errors: { [key: string]: string } = {
		'invalidBookId': 'Book does not exist',
		'bookNotAvailable': 'No copies available',
		'bookAlreadyBorrowed': 'You already borrowed this book',
		'bookNotBorrowed': 'You did not borrow this book',
	};
	let owner, addr1, addr2;

	beforeEach(async function () {
		testContract = await (await hre.ethers.getContractFactory("Library")).deploy();
		[owner, addr1, addr2] = await hre.ethers.getSigners();
	});

	describe("addNewBook", function () {
		it("Should create a new book", function () {
			testContract.addNewBook(bookName, 1);
			expect(testContract.getAvailableBooks().length == 1);
		});

		it("Should not create a book with 0 availability", function () {
			testContract.addNewBook(bookName, 0);
			expect(testContract.getAvailableBooks().length == 0);
		});

		it("Should not create a book if caller is not owner", async function () {
			expect(testContract.connect(addr1).addNewBook(bookName, 1)).to.be.rejectedWith('');
		});
	});

	describe("getAvailableBooks", function () {
		it("Should display book availability correctly", function () {
			testContract.addNewBook(bookName, 0);
			expect(testContract.getAvailableBooks().length == 0);

			testContract.addNewBook(bookName, 1);
			expect(testContract.getAvailableBooks().length == 1);
		});
	});

	describe("changeNumberOfBookCopies", function () {
		it("Should change the number of copies of a book", function () {
			testContract.addNewBook(bookName, 0);
			expect(testContract.getAvailableBooks().length == 0);

			testContract.changeNumberOfBookCopies(0, 2);
			expect(testContract.getAvailableBooks().length == 1);
		});

		it(`should revert trx when changing non-existing book copies with error: ${errors.invalidBookId}`, function () {
			expect(testContract.changeNumberOfBookCopies(0, 11)).to.be.rejectedWith(errors.invalidBookId);
		});

		it("Should not change a book copies if caller is not owner", async function () {
			expect(testContract.connect(addr1).changeNumberOfBookCopies(0, 11)).to.be.rejectedWith('');
		});
	});

	describe("borrowBook", function () {
		it(`should revert trx when borrowing non-existing book with error: ${errors.invalidBookId}`, function () {
			expect(testContract.borrowBook(0)).to.be.rejectedWith(errors.invalidBookId);
		});

		it(`should revert trx when borrowing unavailable book with error: ${errors.bookNotAvailable}`, function () {
			testContract.addNewBook(bookName, 1);
			testContract.changeNumberOfBookCopies(0, 0);
			expect(testContract.borrowBook(0)).to.be.rejectedWith(errors.bookNotAvailable);
		});

		it(`should revert trx when borrowing same book twice with error: ${errors.bookAlreadyBorrowed}`, function () {
			testContract.addNewBook(bookName, 3);
			testContract.borrowBook(0);
			expect(testContract.borrowBook(0)).to.be.rejectedWith(errors.bookAlreadyBorrowed);
		});

		it("should reduce book availability if borrow last book copy", function () {
			testContract.addNewBook(bookName, 1);
			testContract.borrowBook(0);
			expect(testContract.getAvailableBooks().length == 0);
		});

		it("should be able to change bookCopies to 0 even if last book was borrowed", function () {
			testContract.addNewBook(bookName, 1);
			testContract.borrowBook(0);
			expect(testContract.getAvailableBooks().length == 0);

			testContract.changeNumberOfBookCopies(0, 0);
			expect(testContract.getAvailableBooks().length == 1);
		});
	});

	describe("returnBook", function () {
		it("should change book availability if there were no copies", function () {
			testContract.addNewBook(bookName, 1);
			testContract.borrowBook(0);
			expect(testContract.getAvailableBooks().length == 0);

			testContract.returnBook(0);
			expect(testContract.getAvailableBooks().length == 1);
		});

		it("should not change book availability if available book coopy was returned", function () {
			testContract.addNewBook(bookName, 2);
			testContract.borrowBook(0);
			expect(testContract.getAvailableBooks().length == 1);

			testContract.returnBook(0);
			expect(testContract.getAvailableBooks().length == 2);
		});

		it(`should revert trx when returning non existing book with error: ${errors.invalidBookId}`, function () {
			expect(testContract.returnBook(0)).to.be.rejectedWith(errors.invalidBookId);
		});

		it(`should revert trx when returning book that was not borrowed with error: ${errors.bookNotBorrowed}`, function () {
			testContract.addNewBook(bookName, 1);
			expect(testContract.returnBook(0)).to.be.rejectedWith(errors.bookNotBorrowed);
		});
	});

	describe("getBookBorrowers", function () {
		it("should show book borrowers history", function () {
			testContract.addNewBook(bookName, 1);
			testContract.borrowBook(0);
			expect(testContract.getBookBorrowers(0).length == 1);
		});

		it("should not repeat book borrowers in history", function () {
			testContract.addNewBook(bookName, 1);
			testContract.borrowBook(0);
			testContract.returnBook(0);
			testContract.borrowBook(0);

			expect(testContract.getBookBorrowers(0).length == 1);
		});

		it(`should revert trx when calling function for non existing book with error: ${errors.invalidBookId}`, function () {
			expect(testContract.getBookBorrowers(0)).to.be.rejectedWith(errors.invalidBookId);
		});
	});
});