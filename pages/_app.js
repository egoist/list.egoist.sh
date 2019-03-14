import App, { Container } from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import withApolloClient from '../lib/with-apollo-client'
import GitHub from '../components/GitHub'

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
      <Container>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <GitHub />
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
        <style jsx global>{`
          body {
            font: 14px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
              'Helvetica Neue', sans-serif;
            margin: 5vh 10vw;
            background: #f9f9f9;
          }
          * {
            box-sizing: border-box;
          }
          a {
            color: #067df7;
            text-decoration: none;
          }
          .page {
            margin: 0 auto;
          }
          .page-title {
            margin: 0;
            font-weight: 400;
          }
        `}</style>
      </Container>
    )
  }
}

export default withApolloClient(MyApp)
