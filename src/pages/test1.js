import React, {useState} from 'react';

const Test1 = () => {

    // const waddress = useAddress();
    const waddress = '0x509fc6Fc64c22D40613c2474cCD50782706F4f5b';
    const [totalSupply, setTotalSupply] = useState(null);
    async function main() {
        const Web3 = require('web3');
        const contractAddress = '0x34eEBEE6942d8Def3c125458D1a86e0A897fd6f9';
        const abi = [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"payable","type":"receive"}];
        const web3 = new Web3("https://polygon-mainnet.infura.io/v3/1ee87a9a45ee44ef941f7e214bd2886a");

        const contractInstance = new web3.eth.Contract(abi, contractAddress);
        const totalSupply2 = await contractInstance.methods.totalSupply(1).call();
        const totalSupply = parseInt(totalSupply2);
        setTotalSupply(totalSupply);

        console.log(contractInstance)

    //     =======================more code
        for (let i = 0; i < totalSupply; i++) {
                       // retrieve the NFT ID
                       const tokenId = await contractInstance.methods.tokenByIndex(i).call();

                       // retrieve the NFT's metadata
                       const tokenURI = await contractInstance.methods.tokenURI(tokenId).call();
                       const tokenMetadata = await fetch(tokenURI).then(response => response.json());

                       // list the NFT's information on your platform
                       console.log(`Name: ${tokenMetadata.name}`);
                       console.log(`Description: ${tokenMetadata.description}`);
                       // console.log(`Image: ${tokenMetadata.image}`);
                       console.log(`Token ID: ${tokenId}`);
                   }

    }

    main()
    return (
        <>
            <h1>Total supply: {totalSupply}</h1>
            <h1>NFT Name: </h1>
            <h1>NFT Token ID: </h1>
            <h1>NFT Price: </h1>



        </>
    );
}

export default Test1;