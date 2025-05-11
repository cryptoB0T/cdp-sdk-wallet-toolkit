
import '../styles/globals.css'
import '../styles/test.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../components/ui/theme-provider'
import Layout from '../components/layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp
