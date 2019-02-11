import React from 'react'
import { withRouter } from 'next/router'
import MediaList from '../components/MediaList'
import Nav from '../components/Nav'
import PageTitle from '../components/PageTitle'

export default withRouter(({ router }) => {
  const type = router.query.type || 'anime'
  return (
    <div className="page">
      <PageTitle status="completed" />
      <Nav />
      <div>
        Check the {type} I completed on{' '}
        <a
          target="blank"
          href={`https://anilist.co/user/egoistlily/${type}list/Completed`}
        >
          AniList.co
        </a>
      </div>
    </div>
  )
})
