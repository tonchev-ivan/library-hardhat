import { expect } from "chai";
import hre from "hardhat";


describe("Library", function () {
	let testContract: any;

	beforeEach(async function () {
		testContract = await (await hre.ethers.getContractFactory("Library")).deploy();
	});

	describe("addNewBook", function () {
		it("Should create a new book", function () {
			testContract.addNewBook("new book 01", 1);
			expect(testContract.getAvailableBooks().length == 1);
		});

		it("Should not create a book with 0 availability", function () {
			testContract.addNewBook("new book 01", 0);
			expect(testContract.getAvailableBooks().length == 0);
		});
	});

	describe("getAvailableBooks", function () {
		it("Should display book availability correctly", function () {
			testContract.addNewBook("new book 01", 0);
			expect(testContract.getAvailableBooks().length == 0);

			testContract.addNewBook("new book 01", 1);
			expect(testContract.getAvailableBooks().length == 1);
		});
	});

	describe("changeNumberOfBookCopies", function () {
		it("Should change the number of copies of a book", function () {
			testContract.addNewBook("new book 01", 0);
			expect(testContract.getAvailableBooks().length == 0);

			testContract.changeNumberOfBookCopies(0, 2);
			expect(testContract.getAvailableBooks().length == 1);
		});

		it("should revert trx when changing non-existing book copies", async function () {
			await expect(testContract.changeNumberOfBookCopies(0, 11)).to.be.revertedWith("Invalid book ID");
		});
	});

	describe("borrowBook", function () {
		it("should revert trx when borrowing non-existing book", async function () {
			await expect(testContract.borrowBook(1)).to.be.revertedWith("Invalid book ID");
		});

		it("should revert trx when borrowing unavailable book", async function () {
			testContract.addNewBook("new book 01", 1);
			testContract.changeNumberOfBookCopies(0, 0);
			await expect(testContract.borrowBook(0)).to.be.revertedWith("Book not available");
		});

		it("should revert trx when borrowing same book twice", async function () {
			testContract.addNewBook("new book 01", 3);
			testContract.borrowBook(0);
			await expect(testContract.borrowBook(0)).to.be.revertedWith("Cant borrow same book twice");
		});

		it("should reduce book availability if borrow last book copy", function () {
			testContract.addNewBook("new book 01", 3);
			testContract.borrowBook(0);
			expect(testContract.getAvailableBooks().length == 0);
		});
	});

	describe("returnBook", function () {
		it("should change book availability if there were no copies", function () {
			testContract.addNewBook("new book 01", 1);
			testContract.borrowBook(0);
			expect(testContract.getAvailableBooks().length == 0);

			testContract.returnBook(0);
			expect(testContract.getAvailableBooks().length == 1);
		});

		it("should revert trx when returning non existing book", async function () {
			await expect(testContract.returnBook(0)).to.be.revertedWith("Invalid book ID");
		});

		it("should revert trx when returning book that was not borrowed", async function () {
			testContract.addNewBook("new book 01", 1);
			await expect(testContract.returnBook(0)).to.be.revertedWith("Book was not borrowed");
		});
	});

	describe("getBookBorrowers", function () {
		it("should show book borrowers history", async function () {
			testContract.addNewBook("new book 01", 1);
			testContract.borrowBook(0);
			expect(testContract.getBookBorrowers(0).length == 1);
		});

		it("should revert trx when calling function for non existing book", async function () {
			await expect(testContract.getBookBorrowers(0)).to.be.revertedWith("Invalid book ID");
		});
	});
});