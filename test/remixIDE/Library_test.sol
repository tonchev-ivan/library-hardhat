// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol";

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "../../contracts/Library.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite {
    Library testContract;
    mapping(string => string) errors;
    string bookName = "Chronicles of Amber";

    function beforeAll() public {
        errors["invalidBookId"] = "Book does not exist";
        errors["bookNotAvailable"] = "No copies available";
        errors["bookAlreadyBorrowed"] = "You already borrowed this book";
        errors["bookNotBorrowed"] = "You did not borrow this book";
    }

    /// 'beforeAll' runs before all other tests
    /// More special functions are: 'beforeEach', 'beforeAll', 'afterEach' & 'afterAll'
    function beforeEach() public {
        testContract = new Library();
    }

    function checkBookCreation() public {
        testContract.addNewBook(bookName, 1);
        Assert.ok(
            testContract.getAvailableBooks().length == 1,
            "New book was created and it is available"
        );
    }

    function checkBookCreationWithZeroAvailability() public {
        testContract.addNewBook(bookName, 0);
        Assert.ok(
            testContract.getAvailableBooks().length == 0,
            "Not available"
        );
    }

    function changeBookAvailability() public {
        testContract.addNewBook(bookName, 0);
        Assert.ok(
            testContract.getAvailableBooks().length == 0,
            "Not available"
        );

        testContract.changeNumberOfBookCopies(0, 11);
        Assert.ok(
            testContract.getAvailableBooks().length == 1,
            "Book availability was changed"
        );

        testContract.changeNumberOfBookCopies(0, 0);
        Assert.ok(
            testContract.getAvailableBooks().length == 0,
            "Book availability was changed"
        );
    }

    function changeBookAvailabilityNonExisting() public {
        try testContract.changeNumberOfBookCopies(0, 11) {} catch Error(
            string memory reason
        ) {
            Assert.ok(
                keccak256(abi.encodePacked(reason)) ==
                    keccak256(abi.encodePacked(errors["invalidBookId"])),
                "failed with reason"
            );
        }
    }

    function checkBorrowBookNonExisting() public {
        try testContract.borrowBook(1) {} catch Error(string memory reason) {
            Assert.ok(
                keccak256(abi.encodePacked(reason)) ==
                    keccak256(abi.encodePacked(errors["invalidBookId"])),
                "failed with reason"
            );
        }
    }

    function checkBorrowBookNotAvailable() public {
        testContract.addNewBook(bookName, 0);
        try testContract.borrowBook(0) {} catch Error(string memory reason) {
            Assert.ok(
                keccak256(abi.encodePacked(reason)) ==
                    keccak256(abi.encodePacked(errors["bookNotAvailable"])),
                "failed with reason"
            );
        }
    }

    function checkBorrowBookTwice() public {
        testContract.addNewBook(bookName, 3);
        testContract.borrowBook(0);
        try testContract.borrowBook(0) {} catch Error(string memory reason) {
            Assert.ok(
                keccak256(abi.encodePacked(reason)) ==
                    keccak256(abi.encodePacked(errors["bookAlreadyBorrowed"])),
                "failed with reason"
            );
        }
    }

    function checkBorrowBookReducesAvailability() public {
        testContract.addNewBook(bookName, 3);
        testContract.borrowBook(0);
        Assert.ok(
            testContract.getAvailableBooks().length == 1,
            "Book available"
        );
    }

    function checkBorrowBookReducesAvailabilityToZero() public {
        testContract.addNewBook(bookName, 1);
        testContract.borrowBook(0);
        Assert.ok(
            testContract.getAvailableBooks().length == 0,
            errors["bookNotAvailable"]
        );
    }

    function checkReturnBook() public {
        testContract.addNewBook(bookName, 1);
        testContract.borrowBook(0);
        Assert.ok(
            testContract.getAvailableBooks().length == 0,
            errors["bookNotAvailable"]
        );
        testContract.returnBook(0);
        Assert.ok(
            testContract.getAvailableBooks().length == 1,
            "Book available"
        );
    }

    function checkReturnBookBookNonExisting() public {
        try testContract.returnBook(1) {} catch Error(string memory reason) {
            Assert.ok(
                keccak256(abi.encodePacked(reason)) ==
                    keccak256(abi.encodePacked(errors["invalidBookId"])),
                "failed with reason"
            );
        }
    }

    function checkReturnBookBookNotAvailable() public {
        testContract.addNewBook(bookName, 1);
        try testContract.returnBook(0) {} catch Error(string memory reason) {
            Assert.ok(
                keccak256(abi.encodePacked(reason)) ==
                    keccak256(abi.encodePacked(errors["bookNotBorrowed"])),
                "failed with reason"
            );
        }
    }

    function checkGetBookBorrowers() public {
        testContract.addNewBook(bookName, 1);
        testContract.borrowBook(0);
        Assert.ok(
            testContract.getBookBorrowers(0).length == 1,
            "history is present"
        );
    }

    function checkGetBookBorrowersDuplication() public {
        testContract.addNewBook(bookName, 1);
        testContract.borrowBook(0);
        testContract.returnBook(0);
        testContract.borrowBook(0);
        Assert.ok(
            testContract.getBookBorrowers(0).length == 1,
            "no duplication in history"
        );
    }
}
