import React, {useEffect, useState} from 'react';

import { ConnectWallet, useAddress ,ThirdwebProvider} from "@thirdweb-dev/react";
import Web3Modal from "web3modal"
import {ethers} from 'ethers'
import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '/artifacts/contracts/NFT.sol/NFT.json'
import {nftaddress, nftmarketaddress} from "../../config";
import axios from "axios";

function Anandtest   ()  {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    let rpcEndpoint = null

    if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
        rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
    }

    const waddress = useAddress();
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })

        const contractaddress='0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
        const marketaddress='0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
        const marketabi=Market.abi;

        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(marketaddress, marketabi, signer)
        const tokenContract = new ethers.Contract(contractaddress, marketabi, provider)
        const data = await marketContract.fetchMyNFTs()


       console.log(signer)
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return item
        }))
        setNfts(items)
        setLoadingState('loaded')
    }


    loadNFTs()
    return (

        <>
<p>{waddress}</p>
            <br/>
            <div className="container">
                <div className="flex justify-center">
                    <h2 className={'text-danger'}>My owned NFTs ({nfts.length})</h2>

                    <h5 className={'text-secondary'}>You have total ({nfts.length}) NFTs </h5>
                    <hr/>
                    <div className="row">

                        {
                            nfts.map((nft, i) => (

                                <div key={i} className="col col-4 ">
                                    <div className="card h-50  ratio ratio-4x3">
                                        <img src={nft.image} className="rounded "/>


                                    </div>

                                    <div className={'footer bg-black'}>
                                        <div className="p-1">
                                            <h2 className={'text-white'}>{nft.name}</h2>
                                            <p className="text-white">{nft.description}</p>
                                            <p className={'text-white'}>Owner: {nft.owner}</p>
                                            <p className={'text-white'}> Seller: {nft.seller}</p>
                                        </div>
                                        <div className="p-4 bg-success">
                                            <p className="text-2xl font-bold text-white">Price </p>
                                            <h2 className="text-2xl font-bold text-white">{nft.price} Eth</h2>

                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>

                </div>

            </div>

        </>
    );
}

export default Anandtest;
