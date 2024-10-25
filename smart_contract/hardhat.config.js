require("@nomiclabs/hardhat-ethers");

const API_URL = "https://eth-sepolia.g.alchemy.com/v2/WztMjPLIaW8Tkcm8Oq2PGJ-2rpHoCdE_";
const PRIVATE_KEY = "47024b76ff51d95cdc7557c8b98f7917d31586e5826ba106e0e9e3a78ad4812a";

module.exports = {
  solidity: '0.8.0',
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
}