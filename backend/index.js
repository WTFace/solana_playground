import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
    createMint,
    getMint,
    mintTo,
    getOrCreateAssociatedTokenAccount,
    getAccount,
    createSetAuthorityInstruction,
    burn
} from '@solana/spl-token';

const payer = Keypair.generate();
const mintAuthority = Keypair.generate();
const freezeAuthority = Keypair.generate();

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
);

connection.confirmTransaction(airdropSignature).then(async () => {
    const mint = await createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        freezeAuthority.publicKey,
        9
    );
    console.log('\nfungible token:');
    console.log(mint.toBase58());

    const mintInfo = await getMint(connection, mint);
    console.log('\nmintInfo');
    console.log(mintInfo);

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    );

    console.log('\naccount address');
    console.log(tokenAccount.address.toBase58());

    const tokenAccountInfo = await getAccount(connection, tokenAccount.address);

    console.log('\naccount info');
    console.log(tokenAccountInfo);

    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        mintAuthority,
        100000000000 // because decimals for the mint are set to 9
    );
    const mintInfo2 = await getMint(connection, mint);
    console.log('\nmintInfo2');
    console.log(mintInfo2);
});
