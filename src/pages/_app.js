import React, {useEffect, useState} from 'react'
import Link from "next/link";
import { ConnectWallet, useAddress ,ThirdwebProvider} from "@thirdweb-dev/react";
import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';

function Marketplace({Component, pageProps}) {

    const desiredChainId = 80001;
    const address = useAddress();
    // const{connectWalletaddress, setconnectWalletaddress} = useState(null);
    return (
        <ThirdwebProvider desiredChainId={desiredChainId}>
            <div className={'container'}>
                <nav className="p-6">
                    <div>
                        <img src={"https://www.endlessdomains.io/_next/image?url=%2Flogo%2Fblack-logo%2Fblack-logo2x.png&w=256&q=75"}/>
                        <h1 className="text-dark text-center">Endless Domain Marketplace</h1>
                    </div>

                    <hr/>
                    <div className="mt-4 p-2">
                        <Link href="/"
                              className="btn btn-danger p-3 mx-1">
                            Market Place

                        </Link>
                        {/*<Link href="/marketplace"*/}
                        {/*      className="btn btn-dark p-3 mx-1">*/}
                        {/*    Buy NFT*/}

                        {/*</Link>*/}
                        <Link href="/create-item"
                              className="btn btn-dark p-3 mx-1">
                            Create Sell

                        </Link>
                        <Link href="/my-assets"
                              className="btn btn-dark p-3 mx-1">
                            My NFTs

                        </Link>
                        <Link href="/creator-dashboard"
                              className="btn btn-dark p-3 mx-1">
                            Dashboard

                        </Link>
                        <Link href="/re-sell"
                              className="btn btn-warning p-3 mx-1">
                            Re-sale

                        </Link>
                        <Link href="/codetest"
                              className="btn btn-warning p-3 mx-1">
                            Load Domain
                        </Link>
                        <Link href="/uddomain"
                              className="btn btn-warning p-3 mx-1">
                           UD domain test fetch
                        </Link>
                        <ConnectWallet
                            theme="light"
                            address
                            className={'btn btn-primary btn-lg '}
                        />

                        {/*Address: <span>{address}</span>*/}




                    </div>
                </nav>
            </div>
            <Component {...pageProps} />
            <div className={'container'}>
                <br/>
            </div>

        </ThirdwebProvider>

    )
}


export default Marketplace
