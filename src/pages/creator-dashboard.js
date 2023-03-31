import {ethers} from 'ethers'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
    nftmarketaddress, nftaddress
} from '/config'

import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '/artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [unSold, setUnSold] = useState([])
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
        const data = await marketContract.fetchItemsCreated()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return item
        }))
        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        const unSoldItems = items.filter(i => !i.sold)
        setSold(soldItems)
        setUnSold(unSoldItems)
        setNfts(items)
        setLoadingState('loaded')

    }

    if (loadingState === 'loaded' && !nfts.length) return (
        <div className={'container'}>
            <h1 className="py-10 px-20 text-3xl">No assets found</h1>
        </div>

    )
    return (
        <div>

            <div className="container">
                <h2 className={'text-danger'}>My Dashboard</h2>
                <hr/>

                <div className="container">
                    {
                        Boolean(unSold.length) && (
                            <div>
                                <h2 className="text-2xl py-2">NFT Items on sale ({unSold.length})</h2>
                                <div className="row">
                                    {
                                        unSold.map((nft, i) => (

                                            <div key={i} className="col col-4">
                                                <div className={' '}>
                                                    <div className={'card-body bg-dark'}>
                                                        <div className={'card h-50  ratio ratio-4x3'}>
                                                            <img src={nft.image} className={'rounded'} alt={'NFT Image'}/>
                                                        </div>
                                                        <div className="p-1">
                                                            <h2 className={'text-white'}>{nft.name}</h2>
                                                            <p className="text-white">{nft.description}</p>
                                                            {/*<p className={'text-white'}>Owner: {nft.owner}</p>*/}
                                                            {/*<p className={'text-white'}> Seller: {nft.seller}</p>*/}
                                                        </div>

                                                    </div>

                                                    <div className={'footer'}>
                                                        <div className="p-4 bg-warning">
                                                            <p className="text-2xl font-bold text-white">Sale Price </p>
                                                            <h2 className="text-2xl font-bold text-white">{nft.price} Eth</h2>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                            </div>
                        )
                    }
                </div>

                <h2 className="text-2xl py-2">All NFTs created ({nfts.length})</h2>
                <div className={'row'}>
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="col col-4">
                                <div className={' '}>
                                    <div className={'card-body bg-dark'}>
                                        <div className={'card h-50  ratio ratio-4x3'}>
                                            <img src={nft.image} className={'rounded'} alt={'NFT Image'}/>
                                        </div>
                                        <div className="p-1">
                                            <h2 className={'text-white'}>{nft.name}</h2>
                                            <p className="text-white">{nft.description}</p>
                                           {/* <p className={'text-white'}>Owner: {nft.owner}</p>*/}
                                           {/*<p className={'text-white'}> Seller: {nft.seller}</p>*/}
                                        </div>

                                    </div>

                                    <div className={'footer'}>
                                        <div className="p-4 bg-primary">
                                            <p className="text-2xl font-bold text-white">Buy Price </p>
                                            <h2 className="text-2xl font-bold text-white">{nft.price} Eth</h2>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>


            <div className="container">
                {
                    Boolean(sold.length) && (
                        <div>
                            <h2 className="text-2xl py-2">NFT Items Sold already ({sold.length})</h2>
                            <div className="row">
                                {
                                    sold.map((nft, i) => (

                                        <div key={i} className="col col-4">
                                            <div className={' '}>
                                                <div className={'card-body bg-dark'}>
                                                    <div className={'card h-50  ratio ratio-4x3'}>
                                                        <img src={nft.image} className={'rounded'} alt={'NFT Image'}/>
                                                    </div>
                                                    <div className="p-1">
                                                        <h2 className={'text-white'}>{nft.name}</h2>
                                                        <p className="text-white">{nft.description}</p>
                                                        {/*<p className={'text-white'}>Owner: {nft.owner}</p>*/}
                                                        {/*<p className={'text-white'}> Seller: {nft.seller}</p>*/}
                                                    </div>

                                                </div>

                                                <div className={'footer'}>
                                                    <div className="p-4 bg-danger">
                                                        <p className="text-2xl font-bold text-white">Sold Price </p>
                                                        <h2 className="text-2xl font-bold text-white">{nft.price} Eth</h2>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                    )
                }
            </div>

        </div>
    )
}
