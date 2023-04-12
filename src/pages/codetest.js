// const Web3 = require('web3');
// const contractABI = require('<CONTRACT_ABI>');
// const contractAddress = '0x1E0049783F008A0085193E00003D00cd54003c71';
//
// // create a new web3 instance
// const web3 = new Web3(new Web3.providers.HttpProvider('<YOUR_INFURA_API_ENDPOINT>'));
//
// // create a contract instance using the contract ABI and contract address
// const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
//
// // function to list out minted NFTs from another platform to your platform
// async function listMintedNFTs() {
//     // retrieve the total number of NFTs minted on the original platform
//     const totalSupply = await contractInstance.methods.totalSupply().call();
//
//     // loop through all the NFTs and retrieve their information
//     for (let i = 0; i < totalSupply; i++) {
//         // retrieve the NFT ID
//         const tokenId = await contractInstance.methods.tokenByIndex(i).call();
//
//         // retrieve the NFT's metadata
//         const tokenURI = await contractInstance.methods.tokenURI(tokenId).call();
//         const tokenMetadata = await fetch(tokenURI).then(response => response.json());
//
//         // list the NFT's information on your platform
//         console.log(`Name: ${tokenMetadata.name}`);
//         console.log(`Description: ${tokenMetadata.description}`);
//         console.log(`Image: ${tokenMetadata.image}`);
//         console.log(`Token ID: ${tokenId}`);
//     }
// }
//
// listMintedNFTs();
