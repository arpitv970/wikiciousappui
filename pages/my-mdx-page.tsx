import { MDXProvider } from '@mdx-js/react'
import React from 'react'

const components = {}

const MyMDXPage = () => {
  return (
    <MDXProvider components={components}>
      # Hey
    </MDXProvider>
  )
}

export default MyMDXPage
