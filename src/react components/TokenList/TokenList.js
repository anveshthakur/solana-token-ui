import {useState} from 'react'
import {TokenListProvider} from '@solana/spl-token-registry';

export const TokenList = () => {

const [tokenList, setTokenList] = useState();

const clickHandler = async() => {
    new TokenListProvider().resolve().then(tokens => {
        const tokenList = tokens.filterByClusterSlug('devnet').getList();
        setTokenList(tokenList);
    });
}

    return(
        <div>
            <h1>Token List</h1>
            <button onClick = {clickHandler}>List!</button>
            <ul style = {{listStyle: 'none'}}>
            {
                tokenList && tokenList.map((token, key) => 
                    <div key = {key} style = {{margin : '50px'}}>
                    <img style = {{height: '80px'}} src={token.logoURI} key = {token.symbol} alt={token.symbol} />
                    <li key = {key}>{token.symbol}</li>
                    </div>
            )
            }
            </ul>
        </div>
    )
}

export default TokenList
