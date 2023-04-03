import {ethers} from 'ethers'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
    nftmarketaddress, nftaddress
} from '/config'

import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '/artifacts/contracts/NFT.sol/NFT.json'
import {useRouter} from "next/router";

const ReSell = () => {

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
                tokenUri,
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

    const [currentItem, setCurrentItem] = useState([])

    const handleCurrentItem = async (i) => {
        setCurrentItem(nfts[i])
    }

/*    useEffect(()=>{
        updateFormInput
    },[currentItem])*/

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (i) => {
        handleCurrentItem(i)
        setShow(true)
    }


    // ----------------------------------------------------------------------------resell nfts
    const [formInput, updateFormInput] = useState({price: '', image: ''})
    const router = useRouter()
    const {id, tokenURI} = router.query
    const {image, price} = formInput

    useEffect(() => {
        fetchNFT()
    }, [id])

    async function fetchNFT() {
        if (!tokenURI) return
        const meta = await axios.get(tokenURI)
        updateFormInput(state => ({...state, image: meta.data.image}))
    }

    async function listNFTForSale() {
        if (!price) return
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

         const price2 = ethers.utils.parseUnits(formInput.price, 'ether')
         let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
         let listingPrice = await contract.getListingPrice()
         listingPrice = listingPrice.toString()
        let transaction = await contract.resellToken(currentItem.tokenId,nftaddress, {value: listingPrice})
       await transaction.wait()
        router.push('/')
    }

    // ---------------./

    if (loadingState === 'loaded' && !nfts.length) return (
        <div className={'container'}>
            <h2 className="py-10 px-20 text-danger">No NFTS for re-sell</h2>
        </div>
    )
    return (
        <>
            <div className="container">
                <div className="flex justify-center">
                    <h2 className={'text-danger'}>Re-sell your Domain ({nfts.length})</h2>
                    <h5 className={'text-secondary'}>You have total ({nfts.length}) NFTs </h5>
                    <hr/>
                    <div className="row">
                        {
                            nfts.map((nft, i) => (
                                <div key={i} className="col col-4">
                                    <div className="card h-50 bg-success ratio ratio-4x3 ">
                                        <img src={nft.image} className="rounded h-100" alt={'NFT image'}/>
                                    </div>
                                    <div className={'footer bg-success'}>
                                        <div className="p-1">
                                            <h2 className={'text-white'}>{nft.name}</h2>
                                            <p className="text-white">{nft.description}</p>
                                            <p className="text-white">{nft.tokenUri}</p>
                                            <p className="text-white">{nft.tokenId}</p>
                                        </div>
                                        <div className=" p-3 bg-dark  ">
                                            <div className={'col'}>
                                                <p className="text-2xl font-bold text-white">Purchased on </p>
                                                <h2 className="text-2xl font-bold text-white">{nft.price} Eth</h2>

                                            </div>
                                            <div className={'col'}>
                                                <button className={'btn btn-light'}
                                                        onClick={() => handleShow(i)}> Re-sell
                                                    options
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <br/><br/><br/>

            {/*-------------resell-popup*/}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Re-sell NFT Domain</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        {
                            <div className="col p-4 ">
                                <div className=" bg-success text-center ">
                                    <img src={currentItem.image} className="rounded text-center" height="200px"
                                         width="400px"/>
                                </div>
                                <div className={'footer bg-success'}>
                                    <div className="p-1">
                                        <h2 className={'text-white'}>{currentItem.name}</h2>
                                        <p className="text-white">{currentItem.description}</p>
                                    </div>
                                    <div className="p-3 bg-dark row">
                                        <div className={'col'}><p className="text-2xl font-bold text-white">Current
                                            Price - {currentItem.price} Eth</p>
                                        </div>

                                        <br/>
                                        <form className={''} action={''}><input type={'number'} className={'p-1'}
                                                                                onChange={e => updateFormInput({...formInput, price: e.target.value})}
                                                                                value={formInput.price}
                                                                                placeholder={'new price ETH'} name="price"/></form>
                                        <h2 className="text-2xl font-bold text-primary p-3">New Price for
                                            sell- <span className={'text-white'}> {formInput.price} Eth</span></h2>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={listNFTForSale}>Publish</Button>
                </Modal.Footer>
            </Modal>

            {/*--------------./ resell popup end*/}
            <div className={'container'}>
                <br/>
                <h4>Discussion topics</h4>
                <h5>
                    <ul className={'text-secondary'}>
                        <li>Get data from multiple web3 domain provider to list out NFt Domain on our platform.</li>
                        <li>What are Re-sell options and prices modification for your Domain NFTs.</li>
                        <li>Fixed price, Auction/Biding domains.</li>
                        <li>Clear User flow for listing domain, re-sell,buy etc.</li>
                        <li>We need complete work flow for this application phase 1 point by point.</li>
                    </ul>
                </h5>
            </div>
            <div className={'bg-white p-5'}> © Copyright 2023. All Rights Reserved. Anand Ujan Code web3</div>
        </>
    );
};

export default ReSell;
