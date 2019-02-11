import React from 'react'
import MediaList from '../components/MediaList'
import Nav from '../components/Nav'
import PageTitle from '../components/PageTitle'

export default () => {
  return (
    <div className="page">
      <PageTitle status="current" />
      <Nav />
      <MediaList status="current" />
    </div>
  )
}
