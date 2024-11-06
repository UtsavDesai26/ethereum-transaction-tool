import React, { useContext, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import Loader from "./Loader";

const RequestCard = ({
  addressFrom,
  amount,
  message,
  approved,
  fulfilled,
  index,
}) => {
  const { approveRequest, fulfillRequest, isApproveLoading, isFulfillLoading } =
    useContext(TransactionContext);

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
              <strong>Requester:</strong> {shortenAddress(addressFrom)}
            </p>
          </a>
          <p className="text-white">
            <strong>Amount:</strong> {amount} ETH
          </p>
          <p className="text-white">
            <strong>Message:</strong> {message}
          </p>
          <p className="text-white mb-2">
            <strong>Status:</strong>{" "}
            {approved ? (fulfilled ? "Fulfilled" : "Approved") : "Pending"}
          </p>
          {isApproveLoading ? (
            <Loader />
          ) : (
            !approved &&
            !fulfilled && (
              <button
                onClick={() => approveRequest(index)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
            )
          )}
          {isFulfillLoading ? (
            <Loader />
          ) : (
            approved &&
            !fulfilled && (
              <button
                onClick={() => fulfillRequest(addressFrom, amount, index)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Fulfill
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const Requests = () => {
  const { currentAccount, requests } = useContext(TransactionContext);

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
            {requests.length === 0 ? (
              <div className="flex justify-center mt-5">
                <span className="text-white">No Requests</span>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center items-center mt-10">
                {currentRequests.reverse().map((request, i) => (
                  <RequestCard
                    key={i}
                    {...request}
                    index={requests.length - i - 1}
                  />
                ))}
              </div>
            )}
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
          <div className="h-48 text-white text-3xl text-center">
            Connect your wallet to view requests
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
