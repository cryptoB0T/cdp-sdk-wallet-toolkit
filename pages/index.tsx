
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Web3 Account Manager</title>
        <meta name="description" content="Web3 Account Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Web3 Account Manager</h1>
        
        <nav className={styles.nav}>
          <Link href="/create-account" className={styles.card}>
            <h2>Create Account &rarr;</h2>
            <p>Create a new Web3 account (EVM or Solana)</p>
          </Link>

          <Link href="/list-accounts" className={styles.card}>
            <h2>List Accounts &rarr;</h2>
            <p>View all your accounts and their balances</p>
          </Link>

          <Link href="/transfer-funds" className={styles.card}>
            <h2>Transfer Funds &rarr;</h2>
            <p>Send funds between your accounts</p>
          </Link>
        </nav>
      </main>
    </div>
  );
};

export default Home;
