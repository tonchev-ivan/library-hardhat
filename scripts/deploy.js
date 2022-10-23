async function main() {
  await (await hre.ethers.getContractFactory("Library")).deploy();

  console.log(
    'Library deployed',
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
