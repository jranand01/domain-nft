// import React from 'react';
// import Web3 from "web3";
// import {json} from "hardhat/internal/core/params/argumentTypes";
//
// const Codetest =  async () => {
//     //const Web3 = require('web3');
//      const contractABI =[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BadReturnValueFromERC20OnTransfer","type":"error"},{"inputs":[{"internalType":"address","name":"channel","type":"address"}],"name":"ChannelClosed","type":"error"},{"inputs":[{"internalType":"address","name":"channel","type":"address"},{"internalType":"bool","name":"isOpen","type":"bool"}],"name":"ChannelStatusAlreadySet","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"identifiers","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"ERC1155BatchTransferGenericFailure","type":"error"},{"inputs":[],"name":"Invalid1155BatchTransferEncoding","type":"error"},{"inputs":[],"name":"InvalidController","type":"error"},{"inputs":[],"name":"InvalidERC721TransferAmount","type":"error"},{"inputs":[],"name":"InvalidItemType","type":"error"},{"inputs":[],"name":"MissingItemAmount","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"NoContract","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"identifier","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenTransferGenericFailure","type":"error"},{"inputs":[],"name":"UnusedItemParameters","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"channel","type":"address"},{"indexed":false,"internalType":"bool","name":"open","type":"bool"}],"name":"ChannelUpdated","type":"event"},{"inputs":[{"components":[{"internalType":"enum ConduitItemType","name":"itemType","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"identifier","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ConduitTransfer[]","name":"transfers","type":"tuple[]"}],"name":"execute","outputs":[{"internalType":"bytes4","name":"magicValue","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"internalType":"struct ConduitBatch1155Transfer[]","name":"batchTransfers","type":"tuple[]"}],"name":"executeBatch1155","outputs":[{"internalType":"bytes4","name":"magicValue","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"enum ConduitItemType","name":"itemType","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"identifier","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ConduitTransfer[]","name":"standardTransfers","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"internalType":"struct ConduitBatch1155Transfer[]","name":"batchTransfers","type":"tuple[]"}],"name":"executeWithBatch1155","outputs":[{"internalType":"bytes4","name":"magicValue","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"channel","type":"address"},{"internalType":"bool","name":"isOpen","type":"bool"}],"name":"updateChannel","outputs":[],"stateMutability":"nonpayable","type":
//         "function"}]
//
//     const contractAddress = '0x1E0049783F008A0085193E00003D00cd54003c71';
//
//
// // create a new web3 instance
//     const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a"));
//
// // create a contract instance using the contract ABI and contract address
//     const contractInstance =  new  web3.eth.Contract(contractABI, contractAddress);
//
//
//
//
//
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
//         // console.log(`Image: ${tokenMetadata.image}`);
//         console.log(`Token ID: ${tokenId}`);
//     }
//     return(
//
//         <>
//
//             <h1>NFT at console</h1>
//
//         </>
//     );
// }
//
//
//
// export default Codetest;
//




/*
* import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import {ethers} from 'ethers'
 function Codetest() {
    // const web3Modal = new Web3Modal({
    //     network: "mainnet",
    //     cacheProvider: true,
    // })

     const main =async ()=>{
         const web3Modal = new Web3Modal()
         const contractABI =[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BadReturnValueFromERC20OnTransfer","type":"error"},{"inputs":[{"internalType":"address","name":"channel","type":"address"}],"name":"ChannelClosed","type":"error"},{"inputs":[{"internalType":"address","name":"channel","type":"address"},{"internalType":"bool","name":"isOpen","type":"bool"}],"name":"ChannelStatusAlreadySet","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"identifiers","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"ERC1155BatchTransferGenericFailure","type":"error"},{"inputs":[],"name":"Invalid1155BatchTransferEncoding","type":"error"},{"inputs":[],"name":"InvalidController","type":"error"},{"inputs":[],"name":"InvalidERC721TransferAmount","type":"error"},{"inputs":[],"name":"InvalidItemType","type":"error"},{"inputs":[],"name":"MissingItemAmount","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"NoContract","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"identifier","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenTransferGenericFailure","type":"error"},{"inputs":[],"name":"UnusedItemParameters","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"channel","type":"address"},{"indexed":false,"internalType":"bool","name":"open","type":"bool"}],"name":"ChannelUpdated","type":"event"},{"inputs":[{"components":[{"internalType":"enum ConduitItemType","name":"itemType","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"identifier","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ConduitTransfer[]","name":"transfers","type":"tuple[]"}],"name":"execute","outputs":[{"internalType":"bytes4","name":"magicValue","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"internalType":"struct ConduitBatch1155Transfer[]","name":"batchTransfers","type":"tuple[]"}],"name":"executeBatch1155","outputs":[{"internalType":"bytes4","name":"magicValue","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"enum ConduitItemType","name":"itemType","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"identifier","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ConduitTransfer[]","name":"standardTransfers","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"internalType":"struct ConduitBatch1155Transfer[]","name":"batchTransfers","type":"tuple[]"}],"name":"executeWithBatch1155","outputs":[{"internalType":"bytes4","name":"magicValue","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"channel","type":"address"},{"internalType":"bool","name":"isOpen","type":"bool"}],"name":"updateChannel","outputs":[],"stateMutability":"nonpayable","type":
                 "function"}]
         const contractAddress = '0x1E0049783F008A0085193E00003D00cd54003c71';
// create a new web3 instance
         //const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a"));
         //const provider = new ethers.providers.Web3Provider("https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a");

         const connection =  await web3Modal.connectTo('https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a')
         const provider = new ethers.providers.Web3Provider(connection)
// create a contract instance using the contract ABI and contract address
         //const contractInstance =  new  web3.eth.Contract(contractABI, contractAddress);
         const contractInstance =   new ethers.Contract(contractAddress,contractABI,provider);


         const [totalSupply, setTotalSupply] = useState()
         const [tokenId, setTokenId] = useState()
         const [tokenURI, setTokenURI] = useState()
         const [tokenMetadata, setTokenMetadata] = useState([])

         const getTotalSupply = async ()=>{
             // retrieve the total number of NFTs minted on the original platform
             let totalSupply = await contractInstance.methods.totalSupply().call();
             setTotalSupply(totalSupply)
         }
         useEffect(()=>{
             getTotalSupply()


         },[])

         const getTokenData = async (i)=>{
             // retrieve the NFT ID
             let tokenId = await contractInstance.methods.tokenByIndex(i).call();
             setTokenId(tokenId)
             // retrieve the NFT's metadata
             let tokenURI = await contractInstance.methods.tokenURI(tokenId).call();
             setTokenURI(tokenURI)
             let tokenMetadata = await fetch(tokenURI).then(response => response.json());
             setTokenMetadata(tokenMetadata)
             return true;
         }

         // loop through all the NFTs and retrieve their information
         for (let i = 0; i < totalSupply; i++) {
             getTokenData(i).then(r => {
                     // list the NFT's information on your platform
                     console.log(`Name: ${tokenMetadata.name}`);
                     console.log(`Description: ${tokenMetadata.description}`);
                     // console.log(`Image: ${tokenMetadata.image}`);
                     console.log(`Token ID: ${tokenId}`);
                 }
             )

         }
     }

    return (
        <>
            <h1>NFT at console</h1>
        </>
    );
}

export default Codetest;
* */