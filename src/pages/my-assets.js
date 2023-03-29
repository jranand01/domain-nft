import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
    nftmarketaddress, nftaddress
} from '/config'

import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '/artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchMyNFTs()

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
    if (loadingState === 'loaded' && !nfts.length) return (<h2 className="py-10 px-20 text-danger">No NFTS purchsed</h2>)
    return (
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
                                <img src={nft.image} className="rounded " />


                            </div>

                                    <div className={'footer bg-black'}>
                                        <div className="p-1">
                                            <h2 className={'text-white'}>{nft.name}</h2>
                                            <p className="text-white">{nft.description}</p>
                                        </div>
                                        <div className="p-4 bg-black">
                                            <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                        </div>
                                    </div>
                                </div>
                        ))
                    }

                </div>

        </div>

        </div>
    )
}