import {useState} from 'react';
import {transferTokenHandler} from '../../components/transferToken'

const TransferToken = ({payer}) => {
    
    const [owner, setOwner] = useState();
    const [destination, setDestination] = useState();
    const [transferToken, settransferToken] = useState();
    const [amount, setAmount] = useState();
    
    
    return (
        <>
            <h1>Transfer Tokens</h1>
            <form>  
                <label htmlFor=""> Owner: </label>
                <input type="text" placeholder="Public Account Address" onChange={(e) => setOwner(e.target.value)} />
                <br />
                <br />

                <label htmlFor=""> Destination: </label>
                <input type="text" placeholder="Public Account Address" onChange={(e) => setDestination(e.target.value)} />
                <br />
                <br />

                <label htmlFor=""> Token-Mint: </label>
                <input type="text" placeholder="Public Account Address" onChange={(e) => settransferToken(e.target.value)} />                        
                <br />
                <br />

                <label htmlFor=""> Amount: </label>
                <input type="text" placeholder="Token Value" onChange={(e) => setAmount(e.target.value)} />                        
                <br />
                <br />
            </form>
            <button onClick = {() => transferTokenHandler(owner, destination, transferToken, amount, payer)}> Transfer </button>
        </>
    )
}

export default TransferToken
