import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [myKey, setMyKey] = useState({});
  const [mint, setMint] = useState({});
  const [mintB, setMintB] = useState({});
  const [tokenAccount, setTokenAccount] = useState({});
  const [tokenAccountB, setTokenAccountB] = useState({});
  const [mintAmount, setMintAmount] = useState(0);
  // const [transferAmount, setTransferAmount] = useState(0);
  // const [burnAmount, setBurnAmount] = useState(0);
  const [swapAmount, setSwapAmount] = useState(0);

  const [friendKey, setFriendKey] = useState({});
  const [friendTokenAcc, setFriendTokenAcc] = useState({});
  const [friendTokenAccB, setFriendTokenAccB] = useState({});

  useEffect(() => {
    axios('http://localhost:3001/').then(res => {
      setMyKey(res.data.myKey);
      setFriendKey(res.data.friendKey);
    })
  }, []);

  const getMint = (key) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/mint',
      data: {key}
    }).then(res => {
      if(Object.keys(mint).length === 0){
        setMint(res.data)
      }else{
        setMintB(res.data)
      }
    }).catch()
  }

  const getOrCreateAssociatedTokenAccount = (key, mint, cb) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/get-token-account',
      data: {key, mint}
    }).then(res => {
      cb(res.data);
    })
  }

  const mintTo = (key, mint, tokenAccount, cbMint, cbAcc) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/mint-to',
      data: {
        key,
        mint,
        tokenAccountAddr: tokenAccount.address,
        amount: mintAmount
      }
    }).then(res => {
      cbMint(res.data.mintInfo);
      cbAcc(res.data.tokenAccountInfo);
    })
  }

  // const burn = (key, mint, tokenAccount) => {
  //   axios({
  //     method: 'post',
  //     url: 'http://localhost:3001/burn',
  //     data: {
  //       key,
  //       mint,
  //       tokenAccountAddr: tokenAccount.address,
  //       amount: burnAmount
  //     }
  //   }).then(res => {
  //     console.log(res.data)
  //     setMint(res.data.mintInfo);
  //     setTokenAccount(res.data.tokenAccountInfo)
  //   })
  // }

  // const transfer = (key, tokenAccount, friendTokenAcc) => {
  //   axios({
  //     method: 'post',
  //     url: 'http://localhost:3001/transfer',
  //     data: {
  //       key,
  //       fromTokenAcc: tokenAccount,
  //       toTokenAcc: friendTokenAcc,
  //       amount: transferAmount
  //     }
  //   }).then(res => {
  //     console.log(res.data)
  //     setTokenAccount(res.data.fromTokenAccInfo)
  //     setFriendTokenAcc(res.data.toTokenAccInfo)
  //   })
  // }

  const swap = (key, poolKey, mySource, myDest, poolSource, poolDest, tokenIn) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/swap',
      data: {
        key,
        poolKey,
        mySource,
        myDest,
        poolSource, 
        poolDest, 
        tokenIn,
        amount: swapAmount
      }
    }).then(res => {
      console.log(res.data)
      if(mint.address === tokenIn.address){ // A source
        setTokenAccount(res.data.mySourceInfo);
        setTokenAccountB(res.data.myDestInfo);
        setFriendTokenAcc(res.data.poolSourceInfo);
        setFriendTokenAccB(res.data.poolDestInfo);
      }else{
        setTokenAccountB(res.data.mySourceInfo);
        setTokenAccount(res.data.myDestInfo);
        setFriendTokenAccB(res.data.poolSourceInfo);
        setFriendTokenAcc(res.data.poolDestInfo);
      }
    })
  }

  return (
    <div className="App bg-zinc-200 min-h-screen p-2 flex">
      <div className='text-left my-4 w-[35%] p-3'>
        <h3 className='my-2 text-lg'>my account(<span className='text-xs'>{myKey.address}</span>)</h3>
        <div className='my-2'>
          <button className='rounded bg-blue-400 px-2' onClick={() => getOrCreateAssociatedTokenAccount(myKey, mint, setTokenAccount)}>tokenA account</button>
          <ul>
            {Object.keys(tokenAccount).map(prop => <li className={prop === 'mint' ?'text-rose-600' : ''}>{prop}: {tokenAccount[prop]}</li>)}
          </ul>
        </div>
        <div className='my-2'>
          <button className='rounded bg-blue-400 px-2' onClick={() => getOrCreateAssociatedTokenAccount(myKey, mintB, setTokenAccountB)}>tokenB account</button>
          <ul>
            {Object.keys(tokenAccountB).map(prop => <li className={prop === 'mint' ?'text-violet-600' : ''}>{prop}: {tokenAccountB[prop]}</li>)}
          </ul>
        </div>
        <div className='my-2'>
          <input type="number" value={mintAmount} min={0} onChange={(e) => setMintAmount(e.target.value)}/>
          <div className=''>
            <button className='rounded bg-blue-400 px-2' onClick={() => mintTo(myKey, mint, tokenAccount, setMint, setTokenAccount)}>mint to A</button>
            <button className='rounded bg-blue-400 px-2 mx-2' onClick={() => mintTo(myKey, mintB, tokenAccountB, setMintB, setTokenAccountB)}>mint to B</button>
          </div>
        </div>
        <div className="">
           <input type="number" value={swapAmount} min={0} onChange={(e) => setSwapAmount(e.target.value)}/>
           <div className=''>
            <button className='rounded bg-blue-400 px-2' onClick={() => swap(myKey, friendKey, tokenAccount, tokenAccountB, friendTokenAcc, friendTokenAccB, mint)}>swap A</button>
            <button className='rounded bg-blue-400 px-2 mx-2' onClick={() => swap(myKey, friendKey, tokenAccountB, tokenAccount, friendTokenAccB, friendTokenAcc, mintB)}>swap B</button>
          </div>
        </div>
        {/* <div className="my-2"></div>
        <input type="number" value={transferAmount} min={0} onChange={(e) => setTransferAmountMintAmount(e.target.value)}/>
          <button className='rounded bg-blue-400 px-2 mx-2' onClick={() => transfer(myKey, tokenAccount, friendTokenAcc, transferAmount)}>transfer</button> */}
        {/* <div className="my-2"></div> 
        <input type="number" value={burnAmount} min={0} onChange={(e) => setBurnAmount(e.target.value)}/>
          <button className='rounded bg-blue-400 px-2 mx-2' onClick={() => burn(myKey, mint, tokenAccount, burnAmount)}>burn</button> */}
      </div>

      <div className='text-left my-4 w-[35%] p-3'>
        <h3 className='my-2 text-lg'>friend(<span className='text-xs'>{friendKey.address}</span>)</h3>
        <div className='my-4'></div>
        <button className='rounded bg-blue-400 px-2' onClick={() => getOrCreateAssociatedTokenAccount(friendKey, mint, setFriendTokenAcc)}>tokenA account</button>
        <ul>
          {Object.keys(friendTokenAcc).map(prop => <li className={prop === 'mint' ?'text-rose-600' : ''}>{prop}: {friendTokenAcc[prop]}</li>)}
        </ul>
        <div className='my-2'>
          <button className='rounded bg-blue-400 px-2' onClick={() => getOrCreateAssociatedTokenAccount(friendKey, mintB, setFriendTokenAccB)}>tokenB account</button>
          <ul>
            {Object.keys(friendTokenAccB).map(prop => <li className={prop === 'mint' ?'text-violet-600' : ''}>{prop}: {friendTokenAccB[prop]}</li>)}
          </ul>
        </div>
        <div className='my-2'>
          <input type="number" value={mintAmount} min={0} onChange={(e) => setMintAmount(e.target.value)}/>
          <div className=''>
            <button className='rounded bg-blue-400 px-2' onClick={() => mintTo(friendKey, mint, friendTokenAcc, setMint, setFriendTokenAcc)}>mint to A</button>
            <button className='rounded bg-blue-400 px-2 mx-2' onClick={() => mintTo(friendKey, mintB, friendTokenAccB, setMintB, setFriendTokenAccB)}>mint to B</button>
          </div>
        </div>
      </div>

      <div className='text-left my-4 w-[30%] p-4'>
        <button className='rounded bg-blue-400 px-2' onClick={() => getMint(myKey)}>create mintA</button>
        <ul>
          {Object.keys(mint).map(info => <li className={info === 'address' ?'text-rose-600' : ''}>{info}: {mint[info]}</li>)}
        </ul>
        <button className='rounded bg-blue-400 px-2 mt-4' onClick={() => getMint(myKey)}>create mintB</button>
        <ul>
          {Object.keys(mintB).map(info => <li className={info === 'address' ?'text-violet-600' : ''}>{info}: {mintB[info]}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;
