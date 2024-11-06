import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    message: "",
  });
  const [requestData, setRequestData] = useState({
    addressFrom: "",
    amount: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isFulfillLoading, setIsFulfillLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);
  const [requests, setRequests] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleRequestChange = (e, name) => {
    setRequestData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const updateBalance = async (account) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(account);
      const formattedBalance = ethers.utils.formatEther(balance);
      setCurrentBalance(formattedBalance);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRequests = async (userAddress) => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableRequests = await transactionsContract.getRequests(
          userAddress
        );

        const structuredRequests = availableRequests.map((request) => ({
          addressFrom: request.requester,
          timestamp: new Date(
            request.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: request.message,
          amount: parseInt(request.amount._hex) / 10 ** 18,
          approved: request.approved,
          fulfilled: request.fulfilled,
        }));

        setRequests(structuredRequests);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
        getAllRequests(accounts[0]);
        await updateBalance(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const requestETH = async () => {
    console.log(requestData);
    try {
      if (ethereum) {
        const { addressFrom, amount, message } = requestData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        const transactionHash = await transactionsContract.createRequest(
          addressFrom,
          parsedAmount,
          message
        );

        setIsRequestLoading(true);
        await transactionHash.wait();
        await getAllRequests(currentAccount);
        await updateBalance(currentAccount);
        setIsRequestLoading(false);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const approveRequest = async (requestIndex) => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const transactionHash = await transactionsContract.approveRequest(
          requestIndex
        );

        setIsApproveLoading(true);
        await transactionHash.wait();
        await getAllRequests(currentAccount);
        await updateBalance(currentAccount);
        setIsApproveLoading(false);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const fulfillRequest = async (addressFrom, amount, requestIndex) => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const parsedAmount = ethers.utils.parseEther(amount.toString());

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressFrom,
              gas: "0x5208",
              value: parsedAmount.toHexString(),
            },
          ],
        });

        const transactionHash = await transactionsContract.fulfillRequest(
          requestIndex,
          { value: parsedAmount.toHexString() }
        );

        setIsFulfillLoading(true);
        await transactionHash.wait();
        await getAllRequests(currentAccount);
        await updateBalance(currentAccount);
        setIsFulfillLoading(false);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  // const fulfillRequest = async (addressFrom, amount, message) => {
  //   try {
  //     if (ethereum) {
  //       const transactionsContract = createEthereumContract();
  //       const parsedAmount = ethers.utils.parseEther(amount.toString());

  //       await ethereum.request({
  //         method: "eth_sendTransaction",
  //         params: [
  //           {
  //             from: currentAccount,
  //             to: addressFrom,
  //             gas: "0x5208",
  //             value: parsedAmount._hex,
  //           },
  //         ],
  //       });

  //       const transactionHash = await transactionsContract.fulfillRequest(
  //         addressFrom,
  //         parsedAmount,
  //         message
  //       );

  //       setIsFulfillLoading(true);
  //       await transactionHash.wait();
  //       await getAllRequests(currentAccount);
  //       await updateBalance(currentAccount);
  //       setIsFulfillLoading(false);
  //     } else {
  //       console.log("Ethereum is not present");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("No Ethereum object");
  //   }
  // };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        await updateBalance(accounts[0]);
        alert("MetaMask is already connected!");
      } else {
        const newAccounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(newAccounts[0]);
        await updateBalance(newAccounts[0]);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message
        );

        setIsLoading(true);
        await transactionHash.wait();
        setIsLoading(false);

        const transactionsCount =
          await transactionsContract.getTransactionCount();
        setTransactionCount(transactionsCount.toNumber());
        await updateBalance(currentAccount);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        requests,
        currentAccount,
        isLoading,
        isRequestLoading,
        isApproveLoading,
        isFulfillLoading,
        sendTransaction,
        requestETH,
        approveRequest,
        fulfillRequest,
        handleChange,
        handleRequestChange,
        formData,
        requestData,
        currentBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
