import { PublicKey } from '@solana/web3.js';
import {createAssociatedTokenAccount, findAssociatedTokenAccountPublicKey} from '../components/associatedAccounts';
import { getAccountInfo } from '../utils/getAccountInfo'; 

export const getOrCreateAssociatedAccount = async(owner, mint) => {
    let pubOwner = new PublicKey(owner); 
    let pubMint = new PublicKey(mint);
    
    let associatedAddress = await findAssociatedTokenAccountPublicKey(pubOwner, pubMint)
    
    try{
        return await getAccountInfo(associatedAddress);
    }catch(err){
        if(err){
            try{
                await createAssociatedTokenAccount(
                    null,
                    true,
                    pubMint,
                    pubOwner,
                )
            }catch(err){
                console.log(err);
            }
    }
        return associatedAddress;
    }
}


// DW3HCnnRpN5PSPjGA9f68JN9EikwJ4CmC4CjwZRi6SkK