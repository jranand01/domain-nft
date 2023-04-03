import React, {useState, useEffect} from 'react';
import axios from 'axios'
import Web3Modal from "web3modal"
import {nftaddress} from "../../config";
import {nftmarketaddress} from "../../config";
import NFT from '/artifacts/contracts/NFT.sol/NFT.json'
import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import {ethers} from "ethers";
import Link from "next/link";


let rpcEndpoint = null

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
    rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

const Index = () => {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        //const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
        const data = await marketContract.fetchMarketItems()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
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

    if (loadingState === 'loaded' && !nfts.length) return (
        <div className={'container'}>
            <h1 className="px-20 py-10 text-3xl text-danger"><br/>No NFT Domain items in marketplace <br/><br/> <Link
                href="/create-item">
                <button type="button" className="btn btn-dark p-5 text-center">Create NFTs</button>
            </Link></h1>
        </div>
    )


    return (
        <>
            <div className="container">
                <br/>
                <h2 className="text-primary text-center">Unlock Your Domain Potential with WEB 3-Domain</h2>



            </div>
            <hr/>
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
            <div className={'bg-white p-5'}> © Copyright 2023. All Rights Reserved. Anand Ujan Code web3</div>

        </>
    );
};

export default Index;
