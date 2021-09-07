import { MintLayout, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { connection } from "./connection"

export const getMintInfo = async(mintKey) => {
    const mintPub = new PublicKey(mintKey);

    const info = await connection.getAccountInfo(mintPub);
    
    if(info == null){
        throw new Error('Failed to find the mint account');
    }
    if(!info.owner.equals(TOKEN_PROGRAM_ID)){
        throw new Error(`Invalid mint owner: ${JSON.stringify(info.owner)}`);
    }
    if(info.data.length !== MintLayout.span){
        throw new Error('Invalid mint size');
    }

    const data = Buffer.from(info.data);
    const mintInfo = MintLayout.decode(data);


    if (mintInfo.mintAuthorityOption === 0) {
      mintInfo.mintAuthority = null;
    } else {
      mintInfo.mintAuthority = new PublicKey(mintInfo.mintAuthority);
    }

    mintInfo.supply = u64.fromBuffer(mintInfo.supply);
    mintInfo.isInitialized = mintInfo.isInitialized !== 0;

    if (mintInfo.freezeAuthorityOption === 0) {
      mintInfo.freezeAuthority = null;
    } else {
      mintInfo.freezeAuthority = new PublicKey(mintInfo.freezeAuthority);
    }

    return mintInfo;
}