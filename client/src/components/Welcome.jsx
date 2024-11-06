import React, { useContext, useEffect, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./";
import { shortenAddress } from "../utils/shortenAddress";

const commonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const {
    connectWallet,
    currentAccount,
    formData,
    sendTransaction,
    handleChange,
    isLoading,
    currentBalance,
    requestData,
    requestETH,
    handleRequestChange,
    isRequestLoading,
  } = useContext(TransactionContext);

  const [activeTab, setActiveTab] = useState("send"); // Manage active tab: 'send' or 'request'

  const handleSubmitSend = (e) => {
    const { addressTo, amount, message } = formData;
    e.preventDefault();

    if (!addressTo || !amount || !message) return;

    sendTransaction();
  };

  const handleSubmitRequest = (e) => {
    const { addressFrom, amount, message } = requestData;
    e.preventDefault();

    if (!addressFrom || !amount || !message) return;

    requestETH();
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        {/* Left Section */}
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white py-1">
            Send & Request Crypto <br /> around the world.
          </h1>
          <p className="text-left text-light mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Discover the power of crypto. Buy, sell, send, and request
            cryptocurrencies easily on the ETH Request System. Sepolia Test
            Network*
          </p>
          {!currentAccount && (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 p-3 rounded-full cursor-pointer bg-gradient-to-r from-blue-300 to-blue-500 hover:from-sky-400 hover:via-rose-400 hover:to-lime-400"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          )}

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${commonStyles}`}>Reliability</div>
            <div className={commonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${commonStyles}`}>Ethereum</div>
            <div className={`sm:rounded-bl-2xl ${commonStyles}`}>Web 3.0</div>
            <div className={commonStyles}>Low fees</div>
            <div className={`rounded-br-2xl ${commonStyles}`}>Blockchain</div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          {/* Ethereum Card */}
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {currentAccount
                    ? shortenAddress(currentAccount)
                    : "Not Connected"}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  {currentBalance} ETH
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div>

          {/* Tabs for Send and Request */}
          <div className="flex w-full justify-center mb-4">
            <button
              onClick={() => setActiveTab("send")}
              className={`mr-2 px-4 py-2 rounded ${
                activeTab === "send"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              Send ETH
            </button>
            <button
              onClick={() => setActiveTab("request")}
              className={`ml-2 px-4 py-2 rounded ${
                activeTab === "request"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              Request ETH
            </button>
          </div>

          {/* Conditional Rendering Based on Active Tab */}
          {activeTab === "send" ? (
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
              <Input
                placeholder="Address To"
                name="addressTo"
                type="text"
                value={formData.addressTo}
                handleChange={handleChange}
              />
              <Input
                placeholder="Amount (ETH)"
                name="amount"
                type="number"
                value={formData.amount}
                handleChange={handleChange}
              />
              <Input
                placeholder="Message"
                name="message"
                type="text"
                value={formData.message}
                handleChange={handleChange}
              />

              <div className="h-[1px] w-full bg-gray-400 my-2" />

              {isLoading ? (
                <Loader />
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitSend}
                  className="text-white w-full mt-10 mb-5 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send Now
                </button>
              )}
            </div>
          ) : (
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
              <Input
                placeholder="Address From"
                name="addressFrom"
                type="text"
                value={requestData.addressFrom}
                handleChange={handleRequestChange}
              />
              <Input
                placeholder="Amount (ETH)"
                name="amount"
                type="number"
                value={requestData.amount}
                handleChange={handleRequestChange}
              />
              <Input
                placeholder="Message"
                name="message"
                type="text"
                value={requestData.message}
                handleChange={handleRequestChange}
              />

              <div className="h-[1px] w-full bg-gray-400 my-2" />

              {isRequestLoading ? (
                <Loader />
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  className="text-white w-full mt-10 mb-5 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Request ETH
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
