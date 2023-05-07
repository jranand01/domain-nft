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

const Index = () => {
    const values = [true];
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
                    //apiKey: "nXdL5qBg2eRqrGMNKGPVwSx03qA9f25hhklyoH3FEnB115PyleGkbVAPZHAVjMcu",
                    //apiKey: "4bgfzTMcyFlZoKOUyL6mzEVzy7dHRHc1mMXKxyk4Woc5vy62Dju2HFgGxJRglVQ2",
                    apiKey: "o51apwdpAy9uwovgBotIisyFSTR3N8zXW1ncHotAGNdj5mIY45OiQaa6fJfx49xU",


                    // ...and any other configuration
                });
            }
            const allNFTsResult = [];
            const allNFTs = [];

            const address = waddress;
            //const address = "0x5bba9780a85979af73d43cef8cce9aea330677ec";
            //const address = "0xe7C161519b315AE58f42f3B1709F42aE9A34A9E0";


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
    runApp()

    return (
        <>
            {/*<span>My wallet Address: {waddress}</span>*/}
            <div className="container">
                <p className={'text-danger'}>Note: Please connect your main wallet address first to list your NFTs. </p><p className={'text-danger'}>Chain: POLYGON,ETHEREUM,Binance</p>
                <h2 className="text-2xl py-2"> My NFTs Assets ( )</h2>
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
                                                <h2>{JSON.parse(nft.metadata).name}</h2>
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
                    <h4 onClick={handleClose} className={'btn btn-sm btn-outline-info'}>Back</h4>
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
                                            <b>Name:</b>{!!Object.keys(selected_nfts).length && JSON.parse(selected_nfts.metadata).name}
                                        </p>
                                        <p><b>Contract Address:</b> <a
                                            href={`https://polygonscan.com/address/${selected_nfts.token_address}`}
                                            target="_blank">0xa9a6...9e9f</a></p>
                                        <p><b>Token ID:</b> <a
                                            href={`https://polygonscan.com/address/${selected_nfts.token_id}`}
                                            target={'_blank'}>{selected_nfts.token_id}</a></p>
                                        <p><b>Token Standard:</b> {selected_nfts.contract_type}</p>
                                        <p><b>Chain:</b> {selected_nfts.name}</p>
                                        <p><b>Last Updated: </b> {selected_nfts.last_metadata_sync} </p>
                                        <p><b>Token URI:</b> <a href={`${selected_nfts.token_uri}`}
                                                                target={'_blank'}>{selected_nfts.block_number}</a></p>
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
                            <Link href={"#"} className={"btn btn-lg btn-warning"}>Resell Now</Link>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>

        </>
    );

};
export default Index;
