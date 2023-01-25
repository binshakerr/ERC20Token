const { ethers } = require("hardhat");

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
const tokenAbi = [];
const tokenAddress = "";
let tokenContract = null;
const dexAbi = [];
const dexAddress = "";
let dexContract = null;

async function getAccess() {
  if (tokenContract) return;
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  dexContract = new ethers.Contract(dexAddress, dexAbi, signer);
}

async function getPrice() {
  await getAccess();
  const price = await dexContract.getPrice(1);
  document.getElementById("tokenPrice").innerHTL = price;
  return price;
}

async function getTokenBalance() {
  await getAccess();
  const balance = await tokenContract.balanceOf(await signer.getAddress());
  document.getElementById("tokensBalance").innerHTL = balance;
}

async function getAvailableTokens() {
  await getAccess();
  const tokens = await dexContract.getTokenBalance();
  document.getElementById("tokensAvailable").innerHTL = tokens;
}

async function grantAccess() {
  await getAccess();
  const value = document.getElementById("tokenGrant").value;
  await tokenContract
    .approve(dexAddress, value)
    .then(() => alert("success"))
    .catch((error) => alert(error));
}

async function sell() {
  await getAccess();
  await dexContract
    .sell()
    .then(() => alert("Success"))
    .catch((error) => alert(error));
}

async function buv() {
  await getAccess();
  const tokenAmount = document.getElementById("tokensToBuy").value;
  const value = (await getPrice()) * tokenAmount;
  await dexContract
    .buy(tokenAmount, { value: value })
    .then(() => alert("Success"))
    .catch((error) => alert(error));
}
