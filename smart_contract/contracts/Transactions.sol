// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Transactions {
    uint256 transactionCount;

    event Transfer(
        address from,
        address receiver,
        uint amount,
        string message,
        uint256 timestamp
    );
    event RequestCreated(
        address from,
        address requester,
        uint amount,
        string message,
        uint256 timestamp
    );
    event RequestApproved(address approver, address requester, uint amount);
    event RequestFulfilled(address approver, address requester, uint amount);

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
    }

    struct RequestStruct {
        address requester;
        uint amount;
        string message;
        bool approved;
        bool fulfilled;
        uint256 timestamp;
    }

    TransferStruct[] transactions;
    mapping(address => RequestStruct[]) public requests;

    // Add to blockchain and trigger a transfer event
    function addToBlockchain(
        address payable receiver,
        uint amount,
        string memory message
    ) public {
        transactionCount += 1;
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp
            )
        );

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp);
    }

    // Create a request for ETH from a specific account
    function createRequest(
        address from,
        uint amount,
        string memory message
    ) external {
        require(amount > 0, "Amount must be greater than zero");
        requests[from].push(
            RequestStruct(
                msg.sender,
                amount,
                message,
                false,
                false,
                block.timestamp
            )
        );

        emit RequestCreated(from, msg.sender, amount, message, block.timestamp);
    }

    // Approve an ETH request
    function approveRequest(uint256 requestIndex) external {
        RequestStruct storage request = requests[msg.sender][requestIndex];
        require(!request.approved, "Request already approved");
        require(!request.fulfilled, "Request already fulfilled");

        request.approved = true;
        emit RequestApproved(msg.sender, request.requester, request.amount);
    }

    // Fulfill an approved ETH request
    function fulfillRequest(uint256 requestIndex) external payable {
        RequestStruct storage request = requests[msg.sender][requestIndex];
        require(request.approved, "Request not approved");
        require(!request.fulfilled, "Request already fulfilled");
        require(msg.value == request.amount, "Incorrect ETH amount");

        request.fulfilled = true;
        payable(request.requester).transfer(msg.value);

        // Log the transfer in transactions array
        transactions.push(
            TransferStruct(
                msg.sender,
                request.requester,
                request.amount,
                request.message,
                block.timestamp
            )
        );
        transactionCount += 1;

        emit RequestFulfilled(msg.sender, request.requester, msg.value);
    }

    // Retrieve all transactions
    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    // Retrieve the transaction count
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    // Retrieve requests for a specific address
    function getRequests(
        address user
    ) public view returns (RequestStruct[] memory) {
        return requests[user];
    }
}
