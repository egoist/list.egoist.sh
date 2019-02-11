import Link from 'next/link'
import { withRouter } from 'next/router'

export default withRouter(({ router }) => (
  <nav>
    <ul>
      <li>
        <Link href={{ pathname: '/', query: router.query }} prefetch>
          <a className={router.pathname === '/' ? 'active' : null}>
            Currently Watching
          </a>
        </Link>
      </li>
      <li>
        <Link href={{ pathname: '/planning', query: router.query }} prefetch>
          <a className={router.pathname === '/planning' ? 'active' : null}>
            Planning
          </a>
        </Link>
      </li>
      <li>
        <a href="https://anilist.co/user/egoistlily" target="blank">
          My AniList
        </a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          width="15"
          height="15"
          className="external-link-icon"
        >
          <path
            fill="currentColor"
            d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
          />{' '}
          <polygon
            fill="currentColor"
            points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
          />
        </svg>
      </li>
    </ul>
    <select
      defaultValue={router.query.type || 'animes'}
      onChange={e =>
        router.push({
          pathname: router.pathname,
          query: { type: e.target.value }
        })
      }
    >
      <option value="anime">Anime</option>
      <option value="manga">Manga</option>
    </select>
    <style jsx>{`
      nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
      }
      select {
        appearance: none;
        border: 1px solid #eaeaea;
        padding: 5px 10px;
        background-color: white;
      }
      select:hover {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      ul {
        margin: 0;
        list-style: none;
        padding-left: 0;
        display: flex;
      }
      li {
        margin-right: 20px;
      }
      a {
        color: #999;
      }
      a:hover {
        color: #666;
      }
      a.active {
        color: #000;
      }
      .external-link-icon {
        color: #999;
        margin-left: 3px;
      }
    `}</style>
  </nav>
))
