const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the Token Contract
  const tokenContract = await hre.ethers.deployContract("Token");
  await tokenContract.waitForDeployment();
  console.log("Token deployed to:", tokenContract.target);

  // Deploy the Exchange Contract
  const exchangeContract = await hre.ethers.deployContract("Exchange", [
    tokenContract.target,
  ]);
  await exchangeContract.waitForDeployment();
  console.log("Exchange deployed to:", exchangeContract.target);

  // Wait for 30 seconds to let Etherscan catch up on contract deployments
  await sleep(30 * 1000);

  // Verify the contracts on Etherscan
  await hre.run("verify:verify", {
    address: tokenContract.target,
    constructorArguments: [],
    contract: "contracts/Token.sol:Token",
  });

  await hre.run("verify:verify", {
    address: exchangeContract.target,
    constructorArguments: [tokenContract.target],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// Token deployed to: 0x7BB9785845321937F1f67FeB5283Ab589Ce31E5e
// Exchange deployed to: 0x60D73331E7be701ed0730f440a44E0998E754713

// Token deployed to: 0xF3C921919E61bCbe25F54c04076d9Bd92F98fa22
// Exchange deployed to: 0x0EAAdfB85DACC299a4D77d80Caf422e3Ea17831c

// Token deployed to: 0x918Ac529a70c092B61008d60FADAc3c251B23388
// Exchange deployed to: 0x27d51ADDDd96458B76423cEDed8e9F80131b0192