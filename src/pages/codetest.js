import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import {ethers} from 'ethers'
const Codetest = () => {
    // const web3Modal = new Web3Modal({
    //     network: "mainnet",
    //     cacheProvider: true,
    // })

    async function main() {
        const web3Modal = await new Web3Modal()
        const contractABI =[{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"payable","type"
                :"receive"}];
        const contractAddress = '0x6339e5E072086621540D0362C4e3Cea0d643E114';
// create a new web3 instance
        //const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a"));
        //const provider = new ethers.providers.Web3Provider("https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a");

        const connection = await web3Modal.connect('https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a')
        const provider =  new ethers.providers.Web3Provider(connection)



// create a contract instance using the contract ABI and contract address
        //const contractInstance =  new  web3.eth.Contract(contractABI, contractAddress);
        const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
console.log(contractInstance.address)
console.log(contractInstance.resolvedAddress)
console.log('======================up out')
        //owner wallet address:     0x7Ab0d3D9fe0D7C0b8c6DcfA0eb4bB3ca44f5f298
        // retrieve the total number of NFTs minted on the original platform
        //const totalSupply = await contractInstance.methods.totalSupply().call();

        const totalSupply2 = await contractInstance.methods.totalSupply().call();
        const totalSupply = parseInt(totalSupply2);


        // loop through all the NFTs and retrieve their information
        for (let i = 0; i < totalSupply; i++) {
            // retrieve the NFT ID
            const tokenId = await contractInstance.methods.tokenByIndex(i).call();

            // retrieve the NFT's metadata
            const tokenURI = await contractInstance.methods.tokenURI(tokenId).call();
            const tokenMetadata = await fetch(tokenURI).then(response => response.json());

            // list the NFT's information on your platform
            console.log(`Name: ${tokenMetadata.name}`);
            console.log(`Description: ${tokenMetadata.description}`);
            // console.log(`Image: ${tokenMetadata.image}`);
            console.log(`Token ID: ${tokenId}`);
        }

        return (

            <>

                <h1>NFT at console</h1>

            </>
        );
    }
    main()

}

export default Codetest;
