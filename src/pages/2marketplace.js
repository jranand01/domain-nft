import React, {useEffect, useState} from 'react';
import {default as Moralis} from "moralis";
import {EvmChain} from "@moralisweb3/common-evm-utils";
import {ConnectWallet, useAddress, ThirdwebProvider} from "@thirdweb-dev/react";
import axios from "axios";
import {ethers} from "ethers";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Link from "next/link";
import {Accordion} from "react-bootstrap";
import Web3Modal from "web3modal";
import { nftmarketaddress} from "../../config";
import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '/artifacts/contracts/NFT.sol/NFT.json'
import {useRouter} from "next/router";

const Marketplace = () => {
    let rpcEndpoint = null

    if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
        rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
    }
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        //const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
        const tokenContract ='0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f'
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
        const data = await marketContract.fetchMarketItems()
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri, {
                headers: {
                    Accept: "application/json",
                }
            })
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                itemId: i.itemId.toNumber(),
                seller: i.seller,
                canceled: i.canceled,
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

    async function buyNft(nft) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
            value: price
        })
        await transaction.wait()
        loadNFTs()
    }

    return (
        <>
            {/*    ----------------nft display*/}
            <div className="container">


                <h2 className="text-2xl py-2">NFT Items for sell ({nfts.length})</h2>
                <div className={'row'}>
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="col col-4">
                                <div className={'card h-100'}>
                                    <div className={'card-body bg-dark'}>
                                        <div className={'card  ratio ratio-4x3'}>
                                            <img src={nft.image} className={'card-img '} alt={'NFT Image'}/>
                                        </div>
                                        <div className="p-1">
                                            <h2 className={'text-white'}>{nft.name}</h2>
                                            <p className="text-white">{nft.description}</p>
                                            <p className={'text-white'}>Owner: {nft.owner}</p>
                                            <p className={'text-white'}> Seller: {nft.seller}</p>
                                        </div>
                                    </div>
                                    <div className={'footer'}>
                                        <button className="btn btn-lg btn-warning w-100" onClick={() => buyNft(nft)}>

                                            <p className="text-2xl font-bold text-white">Buy </p>
                                            <h2 className="text-2xl font-bold text-white">{nft.price} Eth</h2>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
};

export default
Marketplace;