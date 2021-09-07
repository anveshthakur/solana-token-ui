import { useState } from "react";
import {getOrCreateAssociatedAccount} from '../components/getOrCreateAssociatedAccount';


const CheckAccount = ({payer}) => {
    const [mint, setMint] = useState()
    const [owner, setOwner] = useState()
    
    const submitHandler = async() => {
        await getOrCreateAssociatedAccount(owner, mint, payer)
    }

    return (
        <>
        <h1>Create Associated Account!</h1>
        <div>
            <form action="">
                <label>Address: </label>
                <input type="text" onChange = {(e) => setOwner(e.target.value)} />
                <br />
                <br />
                <label>Mint Account: </label>
                <input type="text" onChange = {(e) => setMint(e.target.value)} />
            </form>
            <br />
            <button onClick = {submitHandler}>Check!</button>
            <br />
            <br />
        </div>
        </>
    )
}

export default CheckAccount;