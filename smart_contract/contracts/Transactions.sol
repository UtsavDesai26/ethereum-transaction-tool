// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Transactions {
    uint256 transactionCount;
    uint256 requestCount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp);
    event RequestETH(address requester, address from, uint amount, string message, uint256 timestamp);

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

    // Create a request for ETH from another account
    function requestETH(address from, uint amount, string memory message) public {
        requestCount += 1;
        requests.push(RequestStruct(msg.sender, from, amount, message, block.timestamp, false));

        emit RequestETH(msg.sender, from, amount, message, block.timestamp);
    }

    // Approve and fulfill the ETH request by sending ETH to the requester
    function approveRequest(uint requestId) public payable {
        require(requestId < requestCount, "Request does not exist.");
        RequestStruct storage request = requests[requestId];

        // Check if the sender is the person from whom ETH was requested
        require(msg.sender == request.from, "Only the requested address can approve the request.");
        require(request.fulfilled == false, "Request has already been fulfilled.");

        // Transfer ETH
        require(msg.value == request.amount, "Insufficient ETH sent.");

        payable(request.requester).transfer(msg.value);
        request.fulfilled = true;

        // Record the transfer
        transactionCount += 1;
        transactions.push(TransferStruct(request.from, request.requester, request.amount, request.message, block.timestamp));

        emit Transfer(request.from, request.requester, request.amount, request.message, block.timestamp);
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
