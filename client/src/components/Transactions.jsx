import React, { useState, useContext } from "react ";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const TransactionCard = ({
  addressTo,
  addressFrom,
  timestamp,
  message,
  amount,
  url,
}) => {
  return (
    <div
      className="bg-[#181918] m-4 flex flex-1
            2xl:min-w-[450px]
            2xl:max-w-[500px]
            sm:min-w-[270px]
            sm:max-w-[300px]
            flex-col p-3 rounded-md hover:shadow-2xl
        "
    >
      <div className="flex flex-col  items-center w-full mt-3">
        <div className="w-full mb-6 p-2">
          <a
            href={`https://sepolia.etherscan.io/address/${addressFrom}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white text-base hover:text-[#49bce6]">
              From: {shortenAddress(addressFrom)}
            </p>
          </a>
          <a
            href={`https://sepolia.etherscan.io/address/${addressTo}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white text-base hover:text-[#49bce6]">
              To: {shortenAddress(addressTo)}
            </p>
          </a>
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}

          <div className="bg-black p-3 px-5 w-max rounded-xl mt-5 shadow-2xl">
            <p className="text-[#37c7da] font-bold ">{timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { currentAccount, transactions } = useContext(TransactionContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
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
              Recent Transactions
            </h3>
            <div className="flex flex-wrap justify-center items-center mt-10">
              {currentTransactions.reverse().map((transaction, i) => (
                <TransactionCard key={i} {...transaction} />
              ))}
            </div>
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

export default Transactions;
