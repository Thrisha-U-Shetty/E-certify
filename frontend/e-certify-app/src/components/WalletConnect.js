import { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // Connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Create provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Request access
        await provider.send("eth_requestAccounts", []);

        // Get signer
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        // Fetch balance
        const bal = await provider.getBalance(address);
        setBalance(ethers.formatEther(bal));
        
        alert("Connected: " + address);
      } catch (error) {
        console.error("MetaMask connection failed:", error);
      }
    } else {
      alert("Please install MetaMask extension");
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <p><b>Wallet:</b> {account}</p>
          <p><b>Balance:</b> {balance} ETH</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
}
