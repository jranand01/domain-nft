import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import {ethers} from 'ethers'
import {nftaddress} from "../../config";
const Codetest = () => {
    // const web3Modal = new Web3Modal({
    //     network: "mainnet",
    //     cacheProvider: true,
    // })

    async function main() {
        const web3Modal = await new Web3Modal()
        const contractAddress = '0x6339e5E072086621540D0362C4e3Cea0d643E114';
        const contractABI =[{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},
            {"stateMutability":"payable","type":"receive"}];
// create a new web3 instance
        //const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a"));
        //const provider = new ethers.providers.Web3Provider("https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a");

        const connection = await web3Modal.connect('https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a')
        const provider =  new ethers.providers.Web3Provider(connection)



// create a contract instance using the contract ABI and contract address
        //const contractInstance =  new  web3.eth.Contract(contractABI, contractAddress);
        const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
console.log(contractInstance.address)
        console.log(contractInstance)
console.log('======================up out')
        //owner wallet address:     0x7Ab0d3D9fe0D7C0b8c6DcfA0eb4bB3ca44f5f298
        // retrieve the total number of NFTs minted on the original platform
        //const totalSupply = await contractInstance.methods.totalSupply().call();



        //const totalSupply = await contractInstance.methods.totalSupply().call();
        // const totalSupply = parseInt(totalSupply2);

        contractInstance.methods.totalSupply().call().then(total_supply => {
            console.log(total_supply);
        });

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


    }
     main()
    return (

        <>



            <div className="row container mt-5 bg-light mx-auto col-10 col-md-8 col-lg-6 p-5 bg-light">
               <h6 className={'text-danger'}> Note: Please select your proper wallet address first.! </h6>
                <h2>List your Domain Now</h2>
               <hr/>
                <br/><br/><br/>
                <div className="col-6 py-2">
                    <h6>Contract Address </h6>
                    <input type="text" className="form-control" placeholder="Paste your Contract Address"
                    />
                </div>
                <div className="col-6 py-2">
                    <h6>Contract ABI </h6>
                    <input type="text" className="form-control" placeholder="Paste your Contract ABI "
                    />
                </div>
                <div className="col-12 py-2">
                    <h5>Are you sure you want to load nft to this marketplace first ? </h5>
                    <select name="option" id="options">
                        <option value="yes">List to my NFts First</option>
                        <option value="no">Just load first</option>
                        <option value="later">List it Later</option>

                    </select>
                </div>


                <button  className="form-control btn btn-lg btn-primary mt-3">
                   Load My Domains NFTs
                </button>
            </div>
            <hr/>
            <div className={'container'}> <h4>My Current listed Domain  loading .. (0): </h4>
            </div>



        </>
    );
}

export default Codetest;
