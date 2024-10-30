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
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(
    localStorage.getItem("requestCount")
  );
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

  const getAllRequests = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const availableRequests = await transactionsContract.getAllRequests();
        const structuredRequests = availableRequests.map((request) => ({
          addressFrom: request.sender,
          addressTo: request.receiver,
          timestamp: new Date(
            request.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: request.message,
          amount: parseInt(request.amount._hex) / 10 ** 18,
          requestId: request.id.toNumber(),
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
        getAllRequests();
        await updateBalance(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const checkIfRequestsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentRequestCount =
          await transactionsContract.getRequestCount();

        window.localStorage.setItem("requestCount", currentRequestCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");

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
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
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

      throw new Error("No ethereum object");
    }
  };

  const requestETH = async () => {
    try {
      if (ethereum) {
        const { addressFrom, amount, message } = requestData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        const requestHash = await transactionsContract.requestETH(
          addressFrom,
          parsedAmount,
          message
        );

        setIsRequestLoading(true);
        console.log(`Requesting - ${requestHash.hash}`);
        await requestHash.wait();
        console.log(`Request Success - ${requestHash.hash}`);
        setIsRequestLoading(false);

        const requestCount = await transactionsContract.getRequestCount();
        setRequestCount(requestCount.toNumber());
        await updateBalance(currentAccount);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approveRequest = async (requestId) => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const approveHash = await transactionsContract.approveRequest(
          requestId
        );

        setIsApproveLoading(true);
        console.log(`Approving - ${approveHash.hash}`);
        await approveHash.wait();
        console.log(`Approve Success - ${approveHash.hash}`);
        setIsApproveLoading(false);

        const requestCount = await transactionsContract.getRequestCount();
        setRequestCount(requestCount.toNumber());

        getAllRequests();
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  useEffect(() => {
    checkIfRequestsExists();
  }, [requestCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        requestCount,
        connectWallet,
        transactions,
        requests,
        currentAccount,
        isLoading,
        isRequestLoading,
        sendTransaction,
        requestETH,
        approveRequest,
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
