import React, { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const RequestCard = ({ addressFrom, timestamp, message, amount }) => {
  const { approveRequest } = useContext(TransactionContext);

  const approve = () => {
    approveRequest(addressFrom);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 w-80">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          From: {shortenAddress(addressFrom)}
        </h3>
        <span className="text-sm text-gray-400">
          {new Date(timestamp * 1000).toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-gray-500 my-2">{message}</p>
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-lg font-semibold">Amount: {amount} ETH</h3>
        <button
          onClick={approve}
          className="py-2 px-5 rounded-full cursor-pointer bg-gradient-to-r from-blue-300 to-blue-500 hover:from-sky-400 hover:via-rose-400 hover:to-lime-400"
        >
          Approve
        </button>
      </div>
    </div>
  );
};

const Requests = () => {
  const { requests, currentAccount } = useContext(TransactionContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = requests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <div>
            <h3 className="text-white text-3xl text-center my-2">
              Recent Requests
            </h3>
            <div className="flex flex-wrap justify-center items-center mt-10">
              {currentRequests.map((request, index) => (
                <RequestCard key={index} {...request} />
              ))}
            </div>
            {requests.length > itemsPerPage && (
              <div className="flex justify-between mt-5">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="py-2 px-5 mx-4 rounded-full cursor-pointer bg-gradient-to-r from-blue-300 to-blue-500 hover:from-sky-400 hover:via-rose-400 hover:to-lime-400"
                >
                  Previous
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="py-2 px-5 mx-4 rounded-full cursor-pointer bg-gradient-to-r from-blue-300 to-blue-500 hover:from-sky-400 hover:via-rose-400 hover:to-lime-400"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect Wallet To See Recent Transactions
          </h3>
        )}
      </div>
    </div>
  );
};

export default Requests;
