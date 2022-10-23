async function main() {
  const Library = await ethers.getContractFactory("Library");
  const library = await Library.deploy();

  console.log(
    'Library deployed',
  );

  console.log("Token address:", library.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
