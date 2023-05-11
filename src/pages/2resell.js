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
import {nftaddress, nftmarketaddress} from "../../config";;
import Market from '/artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '/artifacts/contracts/NFT.sol/NFT.json'
import {useRouter} from "next/router";

const Index = () => {
    const values = [true];
    const [nftCount, setNftcount] = useState(0);
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [nfts, setNfts] = useState([])
    const [selected_nfts, setSelected_nfts] = useState({})
    const handleShow2 = (j, i) => {
        setSelected_nfts(nfts[j][i])
        setShow(true);

    }
    const handleClose = () => setShow(false);
    const handleShow = (breakpoint) => {
        setFullscreen(breakpoint);
        setShow(true);
    }
    const waddress = useAddress();




    const runApp = async () => {
        try {
            if (!Moralis.Core.isStarted) {
                await Moralis.start({

                    //apiKey: "4RU0eLSFjSgPQ18NT5BwzjYXgmpHrjNzUhRqXTTPnAscuwLAmnepyuv1Enuka5kz",
                    //apiKey:"b4EmKq4fQf6VfnIUTGp1Y3kUawuQNLPOHmPIyTslv6J0jO0HGR60LDJRgnxMWOfb",
                    //apiKey:"LR4MaImuhPwERyz5wRbu1nucPAS7OpTRNUmN8NBvS0NkxTsbyZ2z2BVPnjr5F9Ve",
                    //apiKey:"EoTGJXXlB7tkZDGHZPYIM6W6o5azMMfCud95GdMEGN8BKB9lW90KuttG8FBp3a4M",
                    //apiKey: "KdjkU96qdEJYq1rawMj8rA7yxnDbqlJmM8OABLYhxYYkKP1HJnjPrCMlnT72U6pa",
                    apiKey: "nXdL5qBg2eRqrGMNKGPVwSx03qA9f25hhklyoH3FEnB115PyleGkbVAPZHAVjMcu",
                    //apiKey: "4bgfzTMcyFlZoKOUyL6mzEVzy7dHRHc1mMXKxyk4Woc5vy62Dju2HFgGxJRglVQ2",
                    //apiKey: "o51apwdpAy9uwovgBotIisyFSTR3N8zXW1ncHotAGNdj5mIY45OiQaa6fJfx49xU",


                    // ...and any other configuration
                });
            }
            const allNFTsResult = [];
            const allNFTs = [];

            //const address = waddress;
            const address = "0x5bba9780a85979af73d43cef8cce9aea330677ec";
            //const address = "0xd7dEa8a8864ec89Db0E310Ded5a174Eac3724643";
            //const address = "0xbBf6b85F355F802bB10C7065f48634003003573C";
            //const address = "0xB4778b0b44c635e9Ad453674D66C19fE828Ef45A";

            const chains = [EvmChain.POLYGON, EvmChain.ETHEREUM, EvmChain.BSC];

            for (const chain of chains) {
                const response = await Moralis.EvmApi.nft.getWalletNFTs({
                    address,
                    chain,
                });

                allNFTs.push(response);
            }

            allNFTs.map((n) => {
                allNFTsResult.push(n.jsonResponse.result);
                console.log(n.jsonResponse.result);
            })
            setNfts(allNFTsResult)
        } catch (e) {
            console.log(e)
        }
    }

    const [appRun, setApprun] = useState(0)
    useEffect(()=>{
        if(!appRun){
            runApp()
        }
        setApprun(1)
        let c = 0
        nfts.map((n)=>{
            c +=n.length
        })
        console.log(c)
        setNftcount(c)
    },[nfts])

    async function listNFTForSale() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const price2 = ethers.utils.parseUnits('0.005', 'ether')
        let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = 0.005

        listingPrice = listingPrice.toString()
        alert('ready?.............to resell ')
        let transaction = await contract.resellToken('12','0x5E1192BFFB02e100b5F2aAbe8A345386371FeEDE', {value: listingPrice})
        await transaction.wait()
        alert('nft listed done.............')
        router.push('/')
    }

    return (
        <>
            {/*<span>My wallet Address: {waddress}</span>*/}
            <div className="container">
                <h6 className={'text-dark'}>Note: Please connect your main wallet address first to list your NFTs. </h6><h5 className={'text-dark'}>Chain: POLYGON,ETHEREUM,Binance</h5>
                <h2 className="text-2xl py-2"> My NFTs Assets ({nftCount})</h2>
                <div className={'row'}>
                    {
                        nfts.map((n, j) => (
                            n.map((nft, i) => (
                                <div key={i} className="col col-4">
                                    <div className={'card h-100'}>
                                        <div className={'card-body bg-light'}>
                                            <div className={'card  ratio ratio-4x3'}>
                                                <img src={JSON.parse(nft.metadata).image} className={'card-img '}
                                                     alt={'NFT Image'}/>
                                            </div>
                                            <div className="p-1">
                                                <h2>{nft.name}</h2>
                                                <p>{JSON.parse(nft.metadata).description}</p>
                                                <p>Owner: {nft.owner_of}</p>
                                                <p>Token Standard: {nft.contract_type}</p>
                                            </div>
                                        </div>
                                        <div className={'footer'}>
                                            {/*<a className="btn btn-lg btn-warning w-100" href={`/view-nfts?data=${btoa(nft)}`}>*/}
                                            {/*    View*/}
                                            {/*</a>*/}

                                            <Button className="btn btn-lg btn-warning w-100" variant="primary"
                                                    onClick={() => handleShow2(j, i)}>
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ))
                    }
                </div>
            </div>

            <Modal show={show} backdrop="static" onHide={handleClose} fullscreen={fullscreen}>
                <Modal.Header className={'text-primary bg-light'} closeButton>
                    <Modal.Title> <img className={'w-25'}
                                       src={"https://www.endlessdomains.io/_next/image?url=%2Flogo%2Fblack-logo%2Fblack-logo2x.png&w=256&q=75"}/> Assects
                        Details</Modal.Title>
                    <h4 onClick={handleClose} className={'btn btn-lg btn-danger'}>Close</h4>
                </Modal.Header>
                <Modal.Body>

                    {/*<img className="img-fluid img-thumbnail" width={'50%'} src={JSON.parse(selected_nfts.metadata).image}/>*/}
                    {/*<br/>*/}

                    <div className={'row'}>
                        <div className={'col-lg-7 col-md-7'}>
                            <img className="img-fluid img-thumbnail" width={'75%'}
                                 src={!!Object.keys(selected_nfts).length && JSON.parse(selected_nfts.metadata).image}/>
                            <br/>

                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Description</Accordion.Header>
                                    <Accordion.Body>
                                        <h6>{!!Object.keys(selected_nfts).length && JSON.parse(selected_nfts.metadata).description}</h6>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Details</Accordion.Header>
                                    <Accordion.Body>
                                        <p>
                                            <b>Assets Name: </b>{!!Object.keys(selected_nfts).length && JSON.parse(selected_nfts.metadata).name}
                                        </p>
                                        <p><b>Contract Address:</b> <a
                                            href={selected_nfts.symbol === "UD" ? (`https://polygonscan.com/address/${selected_nfts.token_address}`) : selected_nfts.symbol === "ENS" ? (`https://etherscan.io/address/${selected_nfts.token_address}`) : ''}
                                            target="_blank">0xa9a6...9e9f</a></p>
                                        <p><b>Token URI:</b> <a href={`${selected_nfts.token_uri}`}
                                                                target={'_blank'}>{selected_nfts.block_number}</a></p>
                                        <p ><b>Token ID: </b>
                                            {selected_nfts.token_id}
                                        </p>
                                        <p><b>Token Standard:</b> {selected_nfts.contract_type}</p>
                                        <p><b>Chain:</b> {selected_nfts.symbol === "UD" ? (`Polygen`) : selected_nfts.symbol === "ENS" ? (`Ethereum`) : ''}</p>
                                        <p><b>Chain From:</b> {selected_nfts.name}</p>
                                        <p><b>Last Updated: </b> {selected_nfts.last_metadata_sync} </p>

                                        <p><b>Creator Earning:</b> 0%</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>Attributes</Accordion.Header>
                                    <Accordion.Body>
                                        {/*{JSON.parse(selected_nfts.metadata).attributes.map(function (attribute) {*/}
                                        {/*            <p><b>{JSON.parse(attribute).trait_type}</b> {JSON.parse(attribute).value}</p>*/}
                                        {/*        })}*/}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                        </div>
                        <div className={'col-lg-5 col-md-5'}>
                            <h1>{!!Object.keys(selected_nfts).length && JSON.parse(selected_nfts.metadata).name}</h1>
                            <p><b>Owned By:</b> {selected_nfts.owner_of}</p>
                            <p>From: {selected_nfts.name}</p>
                            <h2> Best Offers</h2>
                            <h3>ETH:0.00 </h3> <span>0.00 USD</span>

                            <br/>
                            <Link href={"#"} className={"btn btn-lg btn-warning"} onClick={listNFTForSale}>Resell Now</Link>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>

        </>
    );

};
export default Index;
