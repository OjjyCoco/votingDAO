const hre = require("hardhat");

async function main() {
  // Deploy the Voting contract
  const votingContract = await hre.ethers.deployContract("Voting");

  // Wait for the contract to be deployed
  await votingContract.waitForDeployment();

  // Log the address of the deployed contract
  console.log(`Voting contract deployed to ${votingContract.target}`);
}

// Handle errors and exit the process if an error occurs
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
