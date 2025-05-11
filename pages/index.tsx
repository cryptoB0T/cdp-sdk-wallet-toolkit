
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Web3 Account Manager</title>
        <meta name="description" content="Web3 Account Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Web3 Account Manager</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Link href="/create-account" className="block">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:border-primary hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold mb-2">Create Account &rarr;</h2>
              <p className="text-muted-foreground">Create a new Web3 account (EVM or Solana)</p>
            </div>
          </Link>

          <Link href="/list-accounts" className="block">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:border-primary hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold mb-2">List Accounts &rarr;</h2>
              <p className="text-muted-foreground">View all your accounts and their balances</p>
            </div>
          </Link>

          <Link href="/transfer-funds" className="block">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:border-primary hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold mb-2">Transfer Funds &rarr;</h2>
              <p className="text-muted-foreground">Send funds between your accounts</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
