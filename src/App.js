// version 0.2 //CAN NOW ADD TOKENS WITH OwN DECIMAL NUMBER OR SUPPLY  
import React, { useEffect, useState } from 'react';
import { AirDrop } from './utils/airDrop';
import { createAssociatedTokenAccount } from './components/associatedAccounts'
import { createSupply } from './components/initial_supply';
import {TokenCreation} from './components/tokenCreation';
import TransferToken from './react components/TransferToken/TransferToken';
import CheckAccount from './react components/CheckAccount';
import {TokenList} from './react components/TokenList/TokenList'
import './App.css';


const App = () => {
    const [count, setCount] = useState();
    const [pubKey, setPubKey] = useState();
    const [mintKey, setMintKey] = useState();
    const [asAccount, setAsAccount] = useState(null);
    const [amount, setAmount] = useState(1);
    const [decimal, setDecimal] = useState(0);

    useEffect(() => {}, [pubKey])

/////////////////////////////////////////////////////////////Connections////////////////////////////////////////////    
    const getConnectedWallet = async()=> {    
    const provider = await window.solana;
    if(provider){
        setPubKey(provider.publicKey);
        localStorage.setItem("pubKey", provider.pubKey);
    }
    else console.log("Try to connect again");
    }


    const connectWallet = async() => {
        const provider = window.solana;
        console.log(provider);
        if(provider){
                setCount(count + 1);
                await window.solana.connect();
                window.solana.on("connect", () => console.log("connect"));
                getConnectedWallet();
            }
        else window.open("https://phantom.app/", "_blank")
    }

    const disconnectWallet = () => {
        window.solana.disconnect();
        localStorage.removeItem('pubKey')
        setPubKey();
    }

    const TokenCreationHandler = async() => {
        const createdTokenAccount = await TokenCreation(pubKey, decimal);
        
        setMintKey(createdTokenAccount.publicKey.toString());

        const res = await createAssociatedTokenAccount(
            "",
            true,
            createdTokenAccount.publicKey,
            pubKey
        );

        setAsAccount(res); //associatedAccount
        
        createSupply(
            createdTokenAccount.publicKey,
            res,
            pubKey,
            [],
            amount * Math.pow(10, decimal)
        )
    }


return (
        <div className = "App">
            <h1>Hey: { pubKey ? pubKey.toString() : ""}</h1>
            <br />
            <button onClick = {connectWallet}>Connect Here!</button>
            <button onClick = {disconnectWallet}>Disconnect Here!</button>
            <button onClick={() => AirDrop(pubKey)}>AirDrop</button>
            <br />
            <br />
            <br />
            <label>Amount: </label>
            <input type="text" onChange = {(e) => setAmount(e.target.value)} />
            <br />
            <br />
            <label>Decimal </label>
            <input type="text" onChange = {(e) => setDecimal(e.target.value)} />
            <br />
            <br />
            <button onClick={TokenCreationHandler}>TokenCreation</button>
            <br />
            <br />
            <h2>MINT ACCOUNT: {mintKey ? mintKey : ''}</h2>
            <a  href={`https://explorer.solana.com/address/${mintKey}?cluster=devnet`}>Take me to my Token</a>
            {asAccount ? (
                <h5>
                    The created Associated account is : {asAccount}
                </h5>
            ):
            (<br />)}
            <br />
            <br />
            <br />
            <TransferToken payer = {pubKey} />
            <br />
            <br />
            <br />
            <CheckAccount payer = {pubKey} />
            <br />
            <br />
            <TokenList />
        </div>
    )
}
export default App