const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy("100");

  const DEX = await hre.ethers.getContractFactory("DEX");
  const dex = await DEX.deploy(token.address, 100);

  await token.deployed();
  await dex.deployed();
  await writeDeploymentInfo(token, "token.json");
  await writeDeploymentInfo(dex, "dex.json");
}

async function writeDeploymentInfo(contract) {
  const data = {
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile("deployment.json", content, { encoding: "utf-8" });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
