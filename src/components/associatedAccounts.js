import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import {createAccount} from "./accounts";
import {COMMITMENT, connection} from "../utils/connection";
// import { sendTxUsingExternalSignature } from './externalWallet';

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const createIx = (funderPubkey, associatedTokenAccountPublicKey, ownerPublicKey, tokenMintPublicKey
) =>
  new TransactionInstruction({
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
    keys: [
      { pubkey: funderPubkey, isSigner: true, isWritable: true },
      {
        pubkey: associatedTokenAccountPublicKey,
        isSigner: false,
        isWritable: true
      },
      { pubkey: ownerPublicKey, isSigner: false, isWritable: false },
      { pubkey: tokenMintPublicKey, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
    ]
});

export const findAssociatedTokenAccountPublicKey = async(ownerPublicKey, tokenMintPublicKey) =>(
    await PublicKey.findProgramAddress(
        [
            ownerPublicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintPublicKey.toBuffer()
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
)[0];

export const sendTxUsingExternalSignature = async(
    instructions,
    connection,
    feePayer,
    signersExceptWallet,
    wallet //this is a public key
) => {

    let tx = new Transaction();
    tx.add(...instructions);
    tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

    tx.setSigners(
            ...(feePayer
            ? [(feePayer).publicKey, wallet] //change user
            : [wallet]), //change user
            ...signersExceptWallet.map(s => s.publicKey)
    );
    signersExceptWallet.forEach(acc => {
        tx.partialSign(acc);
    });
    const signedTransaction = await window.solana.signTransaction(tx);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: COMMITMENT
    });

    console.log(signature);
}

export const createAssociatedTokenAccount = async(
    feePayerSecret, //dont need it since we are externally signing the transaction 
    feePayerSignsExternally, //true 
    tokenMintAddress, //token public address //
    ownerAddress //token owner address //string
) => {

    //owner is the creator assuming that.
    const tokenMintPublicKey = new PublicKey(tokenMintAddress); 
    const ownerPublicKey = new PublicKey(ownerAddress);
    
    const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
        ownerPublicKey,
        tokenMintPublicKey
    );

    if(feePayerSignsExternally){
        const ix = createIx(
            ownerAddress,
            associatedTokenAccountPublicKey,
            ownerPublicKey,
            tokenMintPublicKey
        );

        await sendTxUsingExternalSignature([ix], connection, null, [], ownerAddress);
    }

    return associatedTokenAccountPublicKey.toBase58();
}