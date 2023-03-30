import React, { useState,useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    nftaddress, nftmarketaddress
} from '/config'

import NFT from '/artifacts/contracts/NFT.sol/NFT.json'
import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
const projectId = '2NJnLQS8F1uNGT6cBdJ1KyXTRUw';
const projectSecret = '3325ee969700ef0f96acc651502d5274';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});
export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }
    async function createMarket() {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return
        /* first, upload to IPFS infura */
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.io/ipfs/${added.path}`
            /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
            createSale(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createSale(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        console.log("Token Id*************************")
        console.log(tx)

        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        /* then list the item for sale on the marketplace */
        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
        await transaction.wait()
        router.push('/')
    }

    return (
        <div className={"container mt-5 bg-light mx-auto col-10 col-md-8 col-lg-6 p-5 bg-light"}>
            <h2 className={'text-danger'}>Create NFT for Marketplace</h2>
            <hr/>

            <div className="row">
                <div className="col-6 py-2">
                    <p>NFT Name </p>
                    <input type="text" className="form-control" placeholder="NFT Name"
                           onChange={e => updateFormInput({...formInput, name: e.target.value})}/>
                </div>
                <div className="col-6 py-2">
                    <p>Price in Matic </p>
                    <input type="number" className="form-control" placeholder="NFT Price in Matic"
                           onChange={e => updateFormInput({...formInput, price: e.target.value})}/>
                </div>
                <div className="col-6 py-2">
                    <p>NFT Description </p>
                        <textarea
                            placeholder="NFT Description"
                            className="form-control"
                            onChange={e => updateFormInput({...formInput, description: e.target.value})}
                        />
                </div>
                <div className="col-6 py-2">
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="validatedCustomFile" name={"NFT"} onChange={onChange}/>
                        <label className="custom-file-label" htmlFor="validatedCustomFile">Choose
                            file...</label>
                        {
                            fileUrl && (
                                <img className="mt-4 img-thumbnail" width="350" src={fileUrl}/>
                            )
                        }
                    </div>
                </div>
                <button onClick={createMarket} className="form-control btn btn-lg btn-dark mt-3">
                    Create NFT
                </button>
            </div>
            <div className={'bg-white p-5'}> © Copyright 2023. All Rights Reserved. Anand Ujan Code web3</div>
        </div>


    )
}
