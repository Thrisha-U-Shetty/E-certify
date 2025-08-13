import { useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>E-Certify</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account}` : "Connect MetaMask"}
      </button>
    </div>
  );
}

export default App;