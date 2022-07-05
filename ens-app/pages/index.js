import Head from 'next/head'
import Image from 'next/image'
import {providers} from 'ethers'
import Web3Modal from 'web3modal'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false)

  const web3ModalRef = useRef()

  const [ens, setENS] = useState("")

  const [address, setAddress] = useState("")


  const setENSOrAddress = async (address, web3Provider) => {
    var _ens = await web3Provider.lookupAddress(address)

    if(_ens) {
      setENS(_ens)
    } else {
      setAddress(address)
    }
  }

  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const {chainId} = await web3Provider.getNetwork()

    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby")
      throw new Error("Change network to Rinkeby")
    }

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    await setENSOrAddress(address, web3Provider)
    return signer
  }


  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true)
      setWalletConnected(true)
    } catch (err) {
      console.log(err)
    }
  }



  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      })
      connectWallet()
    }
  },[walletConnected])


  const renderButton = () => {
    if(walletConnected) {
      <div>wallet Connected</div>
    } else {
      return(
        <button onClick={connectWallet} className={styles.button}>
        Connect your wallet
      </button>
      )
    }
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to Maverick Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for Maverick Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./web3punks.png" />
        </div>
      </div>

     
      <footer className={styles.footer}>
      Made with &#10084; by Bellz
      </footer>
    </div>
  )
}
