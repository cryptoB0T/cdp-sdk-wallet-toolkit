import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Wallet Creator</title>
        <meta name="description" content="Create Web3 Wallets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Web3 Wallet Creator</h1>
        <WalletCreator />
      </main>
    </div>
  );
};

export default Home;
