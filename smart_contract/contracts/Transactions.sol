// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Transactions {
    uint256 transactionCount;
    uint256 requestCount;

    event Transfer(
        address from,
        address receiver,
        uint amount,
        string message,
        uint256 timestamp
    );

    event RequestETH(
        uint256 requestId,
        address requester,
        address from,
        uint amount,
        string message,
        uint256 timestamp
    );

    event RequestFulfilled(
        uint256 requestId,
        address requester,
        address from,
        uint amount,
        uint256 timestamp
    );

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
    }

    struct RequestStruct {
        address requester;
        address from;
        uint amount;
        string message;
        uint256 timestamp;
        bool fulfilled;
    }

    TransferStruct[] transactions;
    RequestStruct[] requests;

    // Add to blockchain and trigger a transfer event
    function addToBlockchain(address payable receiver, uint amount, string memory message) public {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp);
    }

    // Create an ETH request from one user to another
    function requestETH(
        address from,
        uint amount,
        string memory message
    ) public {
        requestCount += 1;
        requests.push(
            RequestStruct(msg.sender, from, amount, message, block.timestamp, false)
        );

        emit RequestETH(
            requestCount - 1,
            msg.sender,
            from,
            amount,
            message,
            block.timestamp
        );
    }

    // Approve and fulfill an ETH request
    function approveRequest(uint requestId) public payable {
        require(requestId < requestCount, "Request does not exist.");
        RequestStruct storage request = requests[requestId];

        // Check if the sender is the correct address and request is unfulfilled
        require(msg.sender == request.from, "Only the requested address can approve.");
        require(!request.fulfilled, "Request has already been fulfilled.");
        require(msg.value == request.amount, "Sent ETH value must match request amount.");

        // Transfer ETH to requester
        payable(request.requester).transfer(msg.value);
        request.fulfilled = true;

        // Record the transfer in transactions array
        transactionCount += 1;
        transactions.push(
            TransferStruct(request.from, request.requester, request.amount, request.message, block.timestamp)
        );

        // Emit events for transaction and fulfilled request
        emit Transfer(request.from, request.requester, request.amount, request.message, block.timestamp);
        emit RequestFulfilled(requestId, request.requester, request.from, request.amount, block.timestamp);
    }

    // Retrieve all transactions
    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    // Retrieve all requests
    function getAllRequests() public view returns (RequestStruct[] memory) {
        return requests;
    }

    // Retrieve the transaction count
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    // Retrieve the request count
    function getRequestCount() public view returns (uint256) {
        return requestCount;
    }
}
