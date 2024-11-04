require("@nomiclabs/hardhat-ethers");

const API_URL =
  "https://eth-sepolia.g.alchemy.com/v2/WztMjPLIaW8Tkcm8Oq2PGJ-2rpHoCdE_";
const PRIVATE_KEY =
  "bcc73e4fe241c923a055a553c3016f534f6ca3dfa13cb78343e04e34379bbad5";

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
