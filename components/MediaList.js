import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import humanizeDuration from 'humanize-duration'
import mediaListQuery from '../lib/gql/media-list.gql'
import { getList } from '../lib/utils'

export default ({ status }) => {
  const router = useRouter()
  const mediaType = (router.query.type || 'anime').toUpperCase()
  const sort =
    status === 'completed'
      ? ['SCORE_DESC', 'UPDATED_TIME_DESC']
      : ['UPDATED_TIME_DESC']
  const scoreFilter = items => {
    const { rating } = router.query
    return items.filter(item => {
      if (status === 'completed') {
        if (rating === 'perfect') {
          return item.score && item.score >= 9.5
        }
        if (rating === 'great') {
          return item.score && item.score >= 8.5 && item.score < 9.5
        }
        if (rating === 'good') {
          return item.score && item.score >= 7.5 && item.score < 8.5
        }
      }
      return true
    })
  }
  const mediaListResult = useQuery(mediaListQuery, {
    variables: { user: 135910, type: mediaType, sort }
  })

  const { loading, data } = mediaListResult

  if (loading || !data) {
    return (
      <div className="loading">
        <style jsx>{`
          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 50px 0;
          }
        `}</style>
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#067df7"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </svg>
      </div>
    )
  }

  const list = getList(
    data.MediaListCollection.lists,
    status === 'completed'
      ? 'Completed'
      : status === 'current'
      ? mediaType === 'MANGA'
        ? 'Reading'
        : 'Watching'
      : 'Planning'
  )
  const items = scoreFilter(list.entries)
  if (items.length === 0) {
    return (
      <div className="empty-list">
        No Result
        <style jsx>{`
          .empty-list {
            padding: 50px 30px;
            text-align: center;
            border: 1px solid #e2e2e2;
            color: #666;
            border-radius: 4px;
            font-size: 2rem;
          }
        `}</style>
      </div>
    )
  }
  return (
    <div className="media-list">
      {items.map(entry => {
        const useVolumes = entry.progressVolumes && entry.progressVolumes > 0
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
                {!/^tv/i.test(entry.media.format) && (
                  <span className="media-format">{entry.media.format}</span>
                )}
              </div>
              <div className="media-meta">
                {status === 'completed' && entry.score ? (
                  <span className="media-score">Score: {entry.score}</span>
                ) : null}
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
                      entry.media.nextAiringEpisode.timeUntilAiring * 1000,
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
              {entry.media.season && entry.media.seasonYear && (
                <div className="media-season">
                  ({entry.media.seasonYear}{' '}
                  <span style={{ textTransform: 'capitalize' }}>
                    {entry.media.season.toLowerCase()}
                  </span>{' '}
                  Season)
                </div>
              )}
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
          display: flex;
          align-items: center;
        }
        .media-format {
          background: #0366d6;
          color: white;
          border-radius: 4px;
          padding: 0 5px;
          margin-left: 10px;
          font-size: 11px;
          height: 20px;
          line-height: 20px;
        }
        .media-meta {
          margin-bottom: 5px;
          font-size: 13px;
          color: #03a9f4;
          font-style: italic;
          font-weight: bold;
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
        .media-season {
          color: #999;
          margin-top: 10px;
          font-size: 13px;
        }
      `}</style>
    </div>
  )
}
