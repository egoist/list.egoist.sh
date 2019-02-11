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
        <Link href={{ pathname: '/planning', query: router.query }}prefetch>
          <a className={router.pathname === '/planning' ? 'active' : null}>
            Planning
          </a>
        </Link>
      </li>
      <li>
        <a href="https://anilist.co/user/egoistlily" target="blank">
          My AniList
        </a>
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
      <option value='anime'>Anime</option>
      <option value='manga'>Manga</option>
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
      a.active {
        color: #000;
      }
    `}</style>
  </nav>
))
