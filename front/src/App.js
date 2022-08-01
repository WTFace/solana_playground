import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [myKey, setMyKey] = useState({});
  const [mint, setMint] = useState({});
  const [tokenAccount, setTokenAccount] = useState({});
  const [mintAmount, setMintAmount] = useState(0);
  const [transferAmount, setTransferAmountMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

  
  const [friendKey, setFriendKey] = useState({});
  const [friendTokenAcc, setFriendTokenAcc] = useState({});

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
      setMint(res.data)
    }).catch()
  }

  const getOrCreateAssociatedTokenAccount = (key, mint, friend=false) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/get-token-account',
      data: {key, mint}
    }).then(res => {
      friend && setFriendTokenAcc(res.data);
      !friend && setTokenAccount(res.data);
    })
  }

  const mintTo = (key, mint, tokenAccount) => {
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
      console.log(res.data)
      setMint(res.data.mintInfo);
      setTokenAccount(res.data.tokenAccountInfo)
    })
  }

  const burn = (key, mint, tokenAccount) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/burn',
      data: {
        key,
        mint,
        tokenAccountAddr: tokenAccount.address,
        amount: burnAmount
      }
    }).then(res => {
      console.log(res.data)
      //setMint(res.data.mintInfo);
      setTokenAccount(res.data.tokenAccountInfo)
    })
  }

  const transfer = (key, tokenAccount, friendTokenAcc) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/transfer',
      data: {
        key,
        fromTokenAcc: tokenAccount,
        toTokenAcc: friendTokenAcc,
        amount: transferAmount
      }
    }).then(res => {
      console.log(res.data)
      setTokenAccount(res.data.fromTokenAccInfo)
      setFriendTokenAcc(res.data.toTokenAccInfo)
    })
  }

  return (
    <div className="App bg-zinc-200 min-h-screen px-[3%] flex">
      <div className='text-left my-4 w-1/2 p-4'>
        <h3 className='my-2 text-lg'>my public key <br /> {myKey.address}</h3>
        <button className='rounded bg-blue-400 px-2' onClick={() => getMint(myKey)}>create mint</button>
        <ul>
          {Object.keys(mint).map(info => <li className={info === 'address' ?'text-rose-600' : ''}>{info}: {mint[info]}</li>)}
        </ul>

        <div className='my-2'></div>
        <button className='rounded bg-blue-400 px-2' onClick={() => getOrCreateAssociatedTokenAccount(myKey, mint)}>my token account</button>
        <ul>
          {Object.keys(tokenAccount).map(prop => <li className={prop === 'mint' ?'text-rose-600' : ''}>{prop}: {tokenAccount[prop]}</li>)}
        </ul>
        <div className='my-4'></div>
          <input type="number" value={mintAmount} min={0} onChange={(e) => setMintAmount(e.target.value)}/>
          <button className='rounded bg-blue-400 px-2 mx-2' onClick={() => mintTo(myKey, mint, tokenAccount)}>mint to the account</button>
        
        <div className="my-2"></div>
        <input type="number" value={transferAmount} min={0} onChange={(e) => setTransferAmountMintAmount(e.target.value)}/>
          <button className='rounded bg-blue-400 px-2 mx-2' onClick={() => transfer(myKey, tokenAccount, friendTokenAcc, transferAmount)}>transfer</button>
  
        <div className="my-2"></div> 
        <input type="number" value={burnAmount} min={0} onChange={(e) => setBurnAmount(e.target.value)}/>
          <button className='rounded bg-blue-400 px-2 mx-2' onClick={() => burn(myKey, mint, tokenAccount, burnAmount)}>burn</button>

      </div>

      <div className='text-left my-4 w-1/2 p-4'>
        <h3 className='my-2 text-lg'>friend <br />{friendKey.address}</h3>
        <div className='my-4'></div>
        <button className='rounded bg-blue-400 px-2' onClick={() => getOrCreateAssociatedTokenAccount(friendKey, mint, true)}>create friend's token account</button>
        <ul>
          {Object.keys(friendTokenAcc).map(prop => <li className={prop === 'mint' ?'text-rose-600' : ''}>{prop}: {friendTokenAcc[prop]}</li>)}
        </ul>
        
      </div>
    </div>
  );
}

export default App;
