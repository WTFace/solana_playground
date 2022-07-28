(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

import express, { Request, response, Response } from 'express';
import bodyParser from 'body-parser';
import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
} from '@solana/web3.js';
import {
    createMint,
    getMint,
    mintTo,
    getOrCreateAssociatedTokenAccount,
    getAccount,
    transfer,
} from '@solana/spl-token';

const cors = require('cors');
const app: express.Application = express();

const payer = Keypair.generate();
const mintAuthority = Keypair.generate();
const freezeAuthority = Keypair.generate();
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const friend = Keypair.generate();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);

app.get('/', async (req, res) => {
    // console.log(payer)
    const myKey = { ...payer, address: payer.publicKey };
    const friendKey = { ...friend, address: friend.publicKey };
    res.json({ myKey, friendKey });
});

app.post('/mint', async (req, res) => {
    const { key } = req.body;
    const secret = new Uint8Array(Object.values(key._keypair.secretKey));
    const pubKey = new PublicKey(key.address);

    const sign = {
        publicKey: pubKey,
        secretKey: secret,
    };
    const mint = await createMint(
        connection,
        sign,
        mintAuthority.publicKey,
        freezeAuthority.publicKey,
        9
    );

    const mintInfo = await getMint(connection, mint);
    res.json(mintInfo);
});

app.post('/get-token-account', async (req, res) => {
    const { key, mint } = req.body;
    const pubKey = new PublicKey(key.address);
    const secret = new Uint8Array(Object.values(key._keypair.secretKey));

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        new PublicKey(mint.address),
        pubKey
    );
    // console.log(tokenAccount.address.toBase58());
    const tokenAccountInfo = await getAccount(connection, tokenAccount.address);
    console.log(tokenAccountInfo);
    res.json(tokenAccountInfo);
});

app.post('/mint-to', async (req, res) => {
    const { key, mint, tokenAccountAddr, amount } = req.body;
    const pubKey = new PublicKey(key.address);
    const secret = new Uint8Array(Object.values(key._keypair.secretKey));
    const sign = {
        publicKey: pubKey,
        secretKey: secret,
    };

    await mintTo(
        connection,
        sign,
        new PublicKey(mint.address),
        new PublicKey(tokenAccountAddr),
        mintAuthority,
        Number(amount)
    );

    const mintInfo = await getMint(connection, new PublicKey(mint.address));
    const tokenAccountInfo = await getAccount(
        connection,
        new PublicKey(tokenAccountAddr)
    );
    res.json({ mintInfo, tokenAccountInfo });
});

app.post('/transfer', async (req, res) => {
    const { key, fromTokenAcc, toTokenAcc, amount } = req.body;
    const pubKey = new PublicKey(key.address);
    const secret = new Uint8Array(Object.values(key._keypair.secretKey));
    const sign = {
        publicKey: pubKey,
        secretKey: secret,
    };

    const signiture = await transfer(
        connection,
        sign,
        new PublicKey(fromTokenAcc.address),
        new PublicKey(toTokenAcc.address),
        // payer.publicKey,
        pubKey,
        amount
    );
    console.log(signiture);
    const fromTokenAccInfo = await getAccount(
        connection,
        new PublicKey(fromTokenAcc.address)
    );
    const toTokenAccInfo = await getAccount(
        connection,
        new PublicKey(toTokenAcc.address)
    );

    res.json({ fromTokenAccInfo, toTokenAccInfo });
});

app.listen(3001, async function () {
    const airdropSignature = await connection.requestAirdrop(
        payer.publicKey,
        // friend.publicKey,
        LAMPORTS_PER_SOL
    );
});

export default app;
