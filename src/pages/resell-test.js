import {useEffect, useState} from 'react'
import {ethers} from 'ethers'
import {useRouter} from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
    nftmarketaddress
} from '/config'

import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
export default function ResellNFT() {
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

        const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
        let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()

        listingPrice = listingPrice.toString()
        let transaction = await contract.resellToken(id, priceFormatted, {value: listingPrice})
        await transaction.wait()

        router.push('/')
    }

    return (
        <div className="container">
            <div className="row">
                <input
                    placeholder="Asset Price in Eth"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({...formInput, price: e.target.value})}
                />
                {
                    image && (
                        <img className="rounded  ratio-4x3" width="150" src={image} />
                    )
                }
                <button onClick={listNFTForSale} className="btn btn-dark btn-lg">
                    List NFT
                </button>
            </div>
        </div>
    )
}
