pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Library is Ownable {
    struct Book {
        uint256 copies;
        string name;
    }

    Book[] allBooks;

    uint256[] bookAvailability;
    mapping(uint256 => uint256) bookAvailabilityIndex;
    mapping(uint256 => bool) bookAvailabilityExists;

    address[][] borrowersHistory;
    mapping(uint256 => mapping(address => int16)) borrowers; // -1 currentborrow, 0 never, 1 unborrowed but was borrowed

    modifier validBookId(uint256 _bookId) {
        require(allBooks.length > _bookId, "Book does not exist");
        _;
    }

    function addNewBook(string memory _name, uint256 _copies) public onlyOwner {
        allBooks.push(Book(_copies, _name));
        borrowersHistory.push(new address[](0));
        uint256 bookId = allBooks.length - 1;
        if (_copies > 0) {
            addBookAvailability(bookId);
        }
    }

    function changeNumberOfBookCopies(uint256 _bookId, uint256 _copies)
        public
        onlyOwner
        validBookId(_bookId)
    {
        allBooks[_bookId].copies = _copies;
        if (_copies > 0) {
            addBookAvailability(_bookId);
        } else if (bookAvailabilityExists[_bookId]) {
            removeBookAvailability(_bookId);
        }
    }

    function getAvailableBooks() public view returns (uint256[] memory) {
        return bookAvailability;
    }

    function borrowBook(uint256 _bookId) public validBookId(_bookId) {
        require(allBooks[_bookId].copies > 0, "No copies available");
        require(
            borrowers[_bookId][msg.sender] != -1,
            "You already borrowed this book"
        );

        if (borrowers[_bookId][msg.sender] == 0) {
            borrowersHistory[_bookId].push(msg.sender);
        }
        borrowers[_bookId][msg.sender] = -1;
        if (--allBooks[_bookId].copies == 0) {
            removeBookAvailability(_bookId);
        }
    }

    function returnBook(uint256 _bookId) public validBookId(_bookId) {
        require(
            borrowers[_bookId][msg.sender] == -1,
            "You did not borrow this book"
        );

        borrowers[_bookId][msg.sender] = 2;

        if (++allBooks[_bookId].copies == 1) {
            addBookAvailability(_bookId);
        }
    }

    function getBookBorrowers(uint256 _bookId)
        public
        view
        validBookId(_bookId)
        returns (address[] memory)
    {
        return borrowersHistory[_bookId];
    }

    function removeBookAvailability(uint256 _bookId) internal {
        bookAvailabilityExists[_bookId] = false;

        // switch values
        bookAvailability[bookAvailabilityIndex[_bookId]] = bookAvailability[
            bookAvailability.length - 1
        ];
        // switch indexes
        bookAvailabilityIndex[
            bookAvailability[bookAvailabilityIndex[_bookId]]
        ] = bookAvailabilityIndex[_bookId];

        bookAvailability.pop();
    }

    function addBookAvailability(uint256 _bookId) internal {
        bookAvailability.push(_bookId);
        bookAvailabilityExists[_bookId] = true;
        bookAvailabilityIndex[_bookId] = bookAvailability.length - 1;
    }
}
