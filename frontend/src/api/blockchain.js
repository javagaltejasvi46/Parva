import { BrowserProvider, Contract } from "ethers";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

export async function getMetaMaskAddress() {
  if (!window.ethereum) throw new Error("MetaMask is required");
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer.getAddress();
}

export async function readTokenBalance(walletAddress) {
  if (!window.ethereum) return "0";
  const provider = new BrowserProvider(window.ethereum);
  const contractAddress = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;
  const contract = new Contract(contractAddress, ERC20_ABI, provider);
  const balance = await contract.balanceOf(walletAddress);
  return balance.toString();
}
