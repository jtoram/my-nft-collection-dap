import { ChainId, ConnectWallet, ThirdwebNftMedia, useAddress, useContract, useDisconnect, useMetamask, useMintNFT, useNetwork, useNetworkMismatch, useNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const { contract } = useContract(
    "0x6DC2a06b79ce93a31CB7c3990Eb0e1C9C98a3A28"
  );

  const { data: nfts, isLoading: isLoadingNfts } = useNFTs(contract);
  const { mutate: mintNft, isLoading: isMinting } = useMintNFT(contract);

  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  async function mintAnNft() {

    // Check if the user has connected
    if (!address) {
      connectWithMetamask();
      return;
    }

    // Check if the user is on the right network
    if (isWrongNetwork) {
      switchNetwork?.(ChainId.Goerli);
      return;
    }

    mintNft(
      {
        metadata: {
          name: "Yellow Star",
          image:
            "https://gateway.ipfscdn.io/ipfs/QmZbovNXznTHpYn2oqgCFQYP4ZCpKDquenv5rFCX8irseo/0.png",
        },
        to: address,
      },
      {
        onSuccess(data) {
          alert(`🚀 Successfully Minted NFT!`);
        },
      },
    );
  
  }

  return (
    <div>
      {address ? (
        <>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
          <p>Your address: {address}</p>

          {!isLoadingNfts ? (
            <div className={styles.nftBoxGrid}>
              {nfts?.map((nft) => (
                <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                  <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftMedia} />
                  <h3>{nft.metadata.name}</h3>
                  <p>Owner: {nft.owner.slice(0, 6) + "..."}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading NFTs...</p>
          )}

          <button onClick={mintAnNft} className={`${styles.mainButton} ${styles.spacerTop}`}>
            {isMinting ? "Minting..." : "Mint NFT"}
          </button>
        </>
      ) : (
        <button onClick={connectWithMetamask}>Connect with Metamask</button>
      )}
    </div>
  );
};

export default Home;
