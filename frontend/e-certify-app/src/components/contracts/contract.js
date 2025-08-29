import { ethers } from "ethers";
import CertificateRegistryABI from "./CertificateRegistryABI.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error("VITE_CONTRACT_ADDRESS not set in .env");
}

export async function getContract() {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, CertificateRegistryABI, signer);
}

export async function fetchCertificate(certId) {
  try {
    const contract = await getContract();
    const cert = await contract.getCertificate(certId);

    return {
      certId: cert[0],
      name: cert[1],
      usn: cert[2],
      courseTitle: cert[3],
      certType: cert[4],
      start: cert[5],
      end: cert[6],
      issuedDate: cert[7],
      signatory: cert[8],
      ipfsUrl: cert[9],
    };
  } catch (err) {
    if (err.code === "CALL_EXCEPTION" && err.reason) {
      throw new Error(err.reason); // e.g., "Certificate not found"
    } else {
      throw new Error("Failed to fetch certificate: " + err.message);
    }
  }
}
