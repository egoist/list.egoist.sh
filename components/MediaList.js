import { Query } from 'react-apollo'
import { withRouter } from 'next/router'
import humanizeDuration from 'humanize-duration'
import mediaListQuery from '../lib/gql/media-list.gql'
import { getList } from '../lib/utils'

export default withRouter(({ status, router }) => {
  const mediaType = (router.query.type || 'anime').toUpperCase()
  return (
    <Query query={mediaListQuery} variables={{ user: 135910, type: mediaType }}>
      {({ loading, data }) => {
        if (loading) {
          return <div>Loading...</div>
        }
        const list = getList(
          data.MediaListCollection.lists,
          status === 'current'
            ? mediaType === 'MANGA'
              ? 'Reading'
              : 'Watching'
            : 'Planning'
        )
        return (
          <div className="media-list">
            {list.entries.map(entry => {
              const useVolumes =
                entry.progressVolumes && entry.progressVolumes > 0
              const useChapters =
                mediaType === 'MANGA' && entry.progress && entry.progress > 0
              const total =
                (useVolumes && entry.media.volumes) ||
                entry.media.chapters ||
                entry.media.episodes
              return (
                <a
                  href={entry.media.siteUrl}
                  target="blank"
                  key={entry.media.id}
                  className="media-item"
                >
                  <div
                    className="media-cover"
                    style={{
                      backgroundColor: entry.media.coverImage.color,
                      backgroundImage: `url(${entry.media.coverImage.large})`
                    }}
                  />
                  <div className="media-content">
                    <div className="media-title">
                      {entry.media.title.english || entry.media.title.romaji}
                    </div>
                    <div className="media-meta">
                      {status === 'current' && (
                        <span className="media-progress">
                          {mediaType === 'MANGA' ? 'Read' : 'Watched'}{' '}
                          {useVolumes ? entry.progressVolumes : entry.progress}
                          {total ? `/${total}` : ''}{' '}
                          {useVolumes
                            ? 'Volumes'
                            : useChapters
                            ? 'Chapters'
                            : 'Episodes'}
                        </span>
                      )}
                      {entry.media.nextAiringEpisode && (
                        <span className="media-date">
                          Next Episode in{' '}
                          {humanizeDuration(
                            entry.media.nextAiringEpisode.timeUntilAiring *
                              1000,
                            { largest: 1 }
                          )}
                        </span>
                      )}
                    </div>
                    <div
                      className="media-description"
                      dangerouslySetInnerHTML={{
                        __html: entry.media.description
                      }}
                    />
                  </div>
                </a>
              )
            })}
            <style jsx>{`
              .media-list {
                display: grid;
                grid-template-columns:
                  calc((100% - 40px) / 3) calc((100% - 40px) / 3)
                  calc((100% - 40px) / 3);
                grid-gap: 20px;
              }
              @media (max-width: 768px) {
                .media-list {
                  grid-template-columns: 100%;
                }
              }
              .media-item {
                display: flex;
                font-size: 16px;
                text-decoration: none;
                padding: 10px;
                color: #000;
                border-radius: 3px;
                background-color: #fff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease-in-out;
              }
              .media-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
                  0 5px 15px 0 rgba(0, 0, 0, 0.08);
              }
              .media-title {
                font-size: 18px;
                margin-bottom: 5px;
              }
              .media-meta {
                margin-bottom: 5px;
                font-size: 13px;
                color: #999;
                font-style: italic;
              }
              .media-meta span:not(:first-child):before {
                content: '·';
                margin: 0 5px;
              }
              .media-description {
                color: #999;
                font-size: 14px;
              }
              .media-cover {
                height: 140px;
                width: 100px;
                background-size: cover;
                margin-right: 20px;
              }
              .media-content {
                width: calc(100% - 120px);
              }
              .media-description {
                max-height: 150px;
                overflow: auto;
              }
            `}</style>
          </div>
        )
      }}
    </Query>
  )
})
