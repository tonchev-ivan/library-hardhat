async function main() {
  // await (await hre.ethers.getContractFactory("Library")).deploy();

  const Library = await ethers.getContractFactory("Library");
  const library = await Library.deploy();


  console.log(
    'Library deployed',
  );

  console.log("Token address:", library.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
