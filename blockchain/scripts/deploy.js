const { ethers } = require("hardhat");  // CommonJS syntax

async function main() {
  // Get the contract factory
  const CertificateStorage = await ethers.getContractFactory("CertificateStorage");

  // Deploy the contract
  const certificateStorage = await CertificateStorage.deploy();

  // Wait for deployment (ethers v6)
  await certificateStorage.waitForDeployment();

  // Log the contract address
  console.log("CertificateStorage deployed to:", certificateStorage.target);
}

// Run the deployment script and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
