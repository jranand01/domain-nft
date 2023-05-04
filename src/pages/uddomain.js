import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Accordion} from "react-bootstrap";
import Link from "next/link";

const Udomain = () => {
    const myaddress = '0x5bba9780a85979af73d43cef8cce9aea330677ec';
    const namehash = '0xb37452fd494928f069a0157e5b1e79cf49361193a746275f2df0e2117000c229';

    const waddress = '0xDA4f3b40Ad025DF3516C345919cff348F285e507';

    const [totalSupply, setTotalSupply] = useState();
    const [contract, setContract] = useState();
    const [tokenURI, setTokenURI] = useState();
    const [tokenData, setTokenData] = useState([
        {
            "name": "",
            "tokenId": "",
            "namehash": "",
            "description": "",
            "external_url": "",
            "image": "",
            "image_url": "",
            "attributes": [
                {
                    "trait_type": "Ending",
                    "value": "nft"
                },
                {
                    "trait_type": "Level",
                    "value": 2
                },
                {
                    "trait_type": "Length",
                    "value": 7
                },
                {
                    "trait_type": "Subdomains",
                    "value": 0
                },
                {
                    "trait_type": "Type",
                    "value": "standard"
                },
                {
                    "trait_type": "Character Set",
                    "value": "letter"
                }
            ],
        }
    ])
    const [tokenMetadata, setTokenMetadata] = useState([])

    const tID = '81169526927703813252991023882262508115607789893741981623649683318767934816809';

    const CA = '0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f';
    const tokenIds = [
        "81169526927703813252991023882262508115607789893741981623649683318767934816809",
    ]


    async function sendRequests() {
        let tData = []
        for (const tokenId of tokenIds) {
            try {
                const response = await axios.get(`https://metadata.unstoppabledomains.com/metadata/${tokenId}`);
                if (response.data.length !== 0) {
                    tData.push(response.data)
                }
                // console.log(`Response from ${tokenId}: ${response.data}`);
            } catch (error) {
                console.error(`Error from ${tokenId}: ${error.message}`);
            }
        }
        return tData
    }

    useEffect(() => {
        sendRequests().then(r => {
            console.log(r)
            setTokenData(r)
        })
    }, [])

    return (
        <>
            <hr/>
            <div className={'container'}>
                <div>
                    <img src={"https://www.endlessdomains.io/_next/image?url=%2Flogo%2Fblack-logo%2Fblack-logo2x.png&w=256&q=75"}/>
                </div>
                <div className={'row'}>
                    <div className={'col-lg-7 col-md-7'}>
                        <img className="img-fluid img-thumbnail" width={'100%'} src={tokenData[0].image}/>
                        <br/>
                        <a className="sc-1f719d57-0 fKAlPV"
                           href={`https://polygonscan.com/address/${contract}`} rel="nofollow noopener"
                           target="_blank">{contract}</a>

                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Description</Accordion.Header>
                                <Accordion.Body>
                                    <p>{tokenData[0].description}</p>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Details</Accordion.Header>
                                <Accordion.Body>
                                    <p><b>Name:</b> {tokenData[0].name}</p>
                                    <p><b>Contract Address:</b> <a
                                        href={`https://polygonscan.com/address/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f`}
                                        target="_blank">0xa9a6...9e9f</a></p>
                                    <p><b>Token ID:</b> <a href={`https://metadata.unstoppabledomains.com/metadata/${tokenData[0].tokenId}`} target={'_blank'}>{tokenData[0].tokenId}</a></p>
                                    <p><b>Token Standard:</b> ERC721</p>
                                    <p><b>Chain:</b> Polygon</p>
                                    <p><b>Last Updated:</b> 8 months ago</p>
                                    <p><b>Creator Earning:</b> 0%</p>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Attributes</Accordion.Header>
                                <Accordion.Body>
                                    {/*{tokenData[0].attributes.map(function (attribute) {
                                            <p><b>{attribute.trait_type}</b> {attribute.value}</p>
                                        })}*/}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                    </div>
                    <div className={'col-lg-5 col-md-5'}>
                        <h1>{tokenData[0].name}</h1>
                        <p><b>Owned By:</b> {waddress}</p>
                        {tokenData[0].attributes[0].trait_type}

                        {(tokenData[0].attributes).map((attr, i) => {
                            <h1 key={i}>{attr.trait_type}</h1>
                        })}
                        <br/>
                        <Link href={"#"} className={"btn btn-lg btn-primary"}>Resell Now</Link>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Udomain;
