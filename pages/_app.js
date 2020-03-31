import App from 'next/app'
import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import { withApollo } from '../lib/apollo'
import '../css/global.css'

Router.events.on('routeChangeStart', url => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    if (ctx.res) {
      ctx.res.setHeader('Cache-Control', 'maxage=180,s-maxage=60')
    }

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </>
    )
  }
}

export default withApollo({ ssr: true })(App)
