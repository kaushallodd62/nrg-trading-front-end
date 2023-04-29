import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

// Buttons
const connectButton = document.getElementById("connectButton");
const balanceButton = document.getElementById("balanceButton");
const sendButton = document.getElementById("sendButton");

// Setting on click functions
connectButton.onclick = connect;
balanceButton.onclick = getBalance;
sendButton.onclick = transfer;

// Provider, signer and contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

async function connect() {
  if (window.ethereum != undefined) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    document.getElementById("connectButton").innerHTML = "Connected";
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    console.log(accounts);
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}

async function getBalance() {
  if (window.ethereum != undefined) {
    try {
      const balance = await contract.balanceOf(signer.getAddress());
      console.log(ethers.utils.formatEther(balance));
    } catch (err) {
      console.log(err);
    }
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}

async function transfer() {
  if (window.ethereum != undefined) {
    const address = document.getElementById("address").value;
    const amount = document.getElementById("amount").value;
    try {
      console.log("Transferring funds...");
      const transactionResponse = await contract.transfer(
        address,
        ethers.utils.parseUnits(amount, 18)
      );
      await listenforTransaction(transactionResponse, provider);
      console.log("Transfer Successful");
    } catch (err) {
      console.log(err);
    }
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}

function listenforTransaction(transactionResponse, provider) {
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transaction) => {
      if (transaction.confirmations > 0) {
        resolve(transaction);
      }
    });
  });
}
