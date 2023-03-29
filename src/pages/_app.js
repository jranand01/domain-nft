import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import Link from "next/link";

function Marketplace({Component, pageProps}) {
    return (
        <div>
            <div className={'container'}>
                <nav className="p-6">
                    <h1 className="text-dark text-center"><span><img src={'img/customer3.jpg'} className={'rounded'} height={'30px'}/> <span style={{fontSize:"12px"}}>Hi, Anand</span></span> Endless Domain <span style={{fontSize:"14px"}} className="text-primary">Logout</span></h1>
                    <div className="mt-4 p-2">
                        <Link href="/"
                              className="btn btn-dark p-3 mx-1">
                            Market Place

                        </Link>
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
                        <Link href="/resell-test"
                              className="btn btn-warning p-3 mx-1">
                            Re-sale-Test

                        </Link>
                        <Link href="/connect"
                              className="btn btn-dark p-3 mx-1">
                            Connect your Wallet

                        </Link>
                    </div>
                </nav>
            </div>
            <Component {...pageProps} />
            <div className={'container'}>
                <br/>

            </div>

        </div>

    )
}

export default Marketplace
