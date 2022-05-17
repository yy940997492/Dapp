import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/MouseBallot.json";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({ walletAddress: "", transferAmount: "", proposals: "", voteAmount: "" ,proposalNumber:""});
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState(null);
  const [yourWalletAddress, setYourWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = '0x39B7029d454694c2683ab5b6873C7385AA436a1C';
  const contractABI = abi.abi;

  const giveTokenToVote = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await tokenContract.transfer(inputValue.walletAddress, utils.parseEther(inputValue.transferAmount));
        console.log("Transfering tokens...");
        await txn.wait();
        console.log("Tokens Transfered", txn.hash);

        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = utils.formatEther(tokenSupply)
        setTokenTotalSupply(tokenSupply);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const creatProposals = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        const pro = eval( inputValue.proposals)
        const txn = await tokenContract.creatPropsal(pro);
        console.log("creatProposals...");
        await txn.wait();
        console.log("creatProposaled", txn.hash);

        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = utils.formatEther(tokenSupply)
        setTokenTotalSupply(tokenSupply);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const vote = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        const txn = await tokenContract.vote(utils.parseEther(inputValue.transferAmount), utils.parseEther(inputValue.voteAmount));
        console.log("vote...");
        await txn.wait();
        console.log("voted...", txn.hash);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setYourWalletAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Install a MetaMask wallet to get our token.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const winProposal = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        const txn = await tokenContract.winProposal();
        console.log("Transfering tokens...");
        await txn.wait();
        console.log("Tokens Transfered", txn.hash);

        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = utils.formatEther(tokenSupply)
        setTokenTotalSupply(tokenSupply);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getTokenInfo = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        let tokenName = await tokenContract.name();
        let tokenSymbol = await tokenContract.symbol();
        let tokenOwner = await tokenContract.owner();
        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = utils.formatEther(tokenSupply)

        setTokenName(`${tokenName} 🐀`);
        setTokenSymbol(tokenSymbol);
        setTokenTotalSupply(tokenSupply);
        setTokenOwnerAddress(tokenOwner);

        if (account.toLowerCase() === tokenOwner.toLowerCase()) {
          setIsTokenOwner(true)
        }

        console.log("Token Name: ", tokenName);
        console.log("Token Symbol: ", tokenSymbol);
        console.log("Token Supply: ", tokenSupply);
        console.log("Token Owner: ", tokenOwner);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (event) => {
    console.log(event.target.name);
    setInputValue(Object.assign({},inputValue,{ [event.target.name]:event.target.value}));
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getTokenInfo();
  }, [])

  return (
    <main className="main-container" style={{
      textAlign: 'center'
    }}>
      <h1 className="headline" style={{
        justifyContent: 'center',
        display: 'flex',
      }}
      >
        <span className="headline-gradient">MouseVote</span>
        <img className="inline p-3 ml-2" src="https://www.mmjbh.com/rw/wp-content/uploads/2020/11/qAZZjy.jpg" alt="Meme Coin" width="60" height="30" />
      </h1>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          <span className="mr-5"><strong>Coin:</strong> {tokenName} </span>
          <span className="mr-5"><strong>Ticker:</strong>  {tokenSymbol} </span>
          <span className="mr-5"><strong>Total Supply:</strong>  {tokenTotalSupply}</span>
        </div>
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-double"
              onChange={handleInputChange}
              name="walletAddress"
              placeholder="Mouse Address"
              value={inputValue.walletAddress}
            />
            <input
              type="text"
              className="input-double"
              onChange={handleInputChange}
              name="transferAmount"
              placeholder={`0 ${tokenSymbol}`}
              value={inputValue.transferAmount}
            />
            <button
              className="btn-purple"
              onClick={giveTokenToVote}>Give Token To</button>
          </form>
        </div>
        {isTokenOwner && (
          <section>
            <div className="mt-10 mb-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="proposals"
                  placeholder={`proposalsNumber[]`}
                  value={inputValue.proposals}
                />
                <button
                  className="btn-purple"
                  onClick={creatProposals}>
                  Creat Proposals
                </button>
              </form>
            </div>
            <div className="mt-10 mb-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-double"
                  onChange={handleInputChange}
                  name="proPosalNumber"
                  placeholder="Proosal Number"
                  value={inputValue.pro}
                />
                <input
                  type="text"
                  className="input-double"
                  onChange={handleInputChange}
                  name="transferAmount"
                  placeholder={`0 ${tokenSymbol}`}
                  value={inputValue.transferAmount}
                />
                <button
                  className="btn-purple"
                  onClick={vote}>
                  vote
                </button>
              </form>
            </div>
            <div className="mt-10 mb-10">
              <form className="form-style">
                <button
                  className="btn-purple"
                  onClick={creatProposals}>
                  winProposal
                </button>
              </form>
            </div>
          </section>
        )}
        <div className="mt-5">
          <p><span className="font-bold">Contract Address: </span>{contractAddress}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Mouse King: </span>{tokenOwnerAddress}</p>
        </div>
        <div className="mt-5">
          {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{yourWalletAddress}</p>}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>

        <img src={ "https://www.mmjbh.com/rw/wp-content/uploads/2020/11/qAZZjy.jpg" } />

      </section>
    </main>
  );
}
export default App;