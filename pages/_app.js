import React from 'react';
import '../styles/globals.css'
import PropTypes from 'prop-types';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any
}

export default MyApp
