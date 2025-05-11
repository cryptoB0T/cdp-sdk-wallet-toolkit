
import '../styles/globals.css'
import '../styles/test.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../components/ui/theme-provider'
import Layout from '../components/layout'
import { WalletProvider } from '../components/providers/WalletProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <WalletProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletProvider>
    </ThemeProvider>
  )
}

export default MyApp
