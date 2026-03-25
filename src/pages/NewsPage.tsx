import { Link } from 'react-router-dom';
import { PixelDivider } from '@/components/chrome/PixelDivider';
import { RetroWindow } from '@/components/chrome/RetroWindow';
import { useBayAreaNews } from '@/api/hooks';
import { isUsableSnippet, plainNewsSnippet } from '@/utils/newsSnippet';
import styles from './NewsPage.module.css';

function formatPublished(raw: string): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (!Number.isFinite(d.getTime())) return raw;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

export function NewsPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useBayAreaNews();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bay & BART headlines</h1>
        <p className={styles.lead}>Recent stories from the web about BART.</p>
        <div className={styles.toolbar}>
          <Link to="/map" className={styles.cta}>
            ← Back to map
          </Link>
          <button type="button" className={styles.refresh} onClick={() => void refetch()} disabled={isFetching}>
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </header>

      <PixelDivider />

      <RetroWindow
        title="Recent stories from the web about BART"
        className={styles.window}
        contentClassName={styles.windowBody}
      >
        {isPending && <p className={styles.status}>Loading headlines…</p>}
        {isError && (
          <div className={styles.error} role="alert">
            <p className={styles.errorTitle}>Couldn&apos;t load news</p>
            <p className={styles.errorBody}>
              {error instanceof Error ? error.message : 'Something went wrong.'} If you&apos;re running the app locally,
              start the API worker so <code className={styles.code}>/api/news</code> is available (see{' '}
              <code className={styles.code}>npm run dev:worker</code>).
            </p>
          </div>
        )}
        {data && data.items.length === 0 && (
          <p className={styles.status}>No stories returned right now. Try again in a few minutes.</p>
        )}
        {data && data.items.length > 0 && (
          <ul className={styles.list} aria-label="News articles">
            {data.items.map((item) => {
              const snippet = plainNewsSnippet(item.snippet);
              const showSnippet = snippet.length > 0 && isUsableSnippet(snippet);
              return (
                <li key={item.link} className={styles.item}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.headline}
                  >
                    {item.title}
                  </a>
                  <div className={styles.meta}>
                    {item.sourceName ? <span className={styles.source}>{item.sourceName}</span> : null}
                    {item.pubDate ? (
                      <time className={styles.time} dateTime={item.pubDate}>
                        {formatPublished(item.pubDate)}
                      </time>
                    ) : null}
                  </div>
                  {showSnippet ? <p className={styles.snippet}>{snippet}</p> : null}
                </li>
              );
            })}
          </ul>
        )}
        {data && data.fetchedAt ? (
          <>
            <p className={styles.fetched}>
              Fetched{' '}
              <time dateTime={data.fetchedAt}>
                {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
                  new Date(data.fetchedAt),
                )}
              </time>
            </p>
            <p className={styles.refreshNote}>
              Headlines are not a one-time snapshot: this page refetches about every five minutes, again when you come
              back to the tab, and whenever you press Refresh.
            </p>
          </>
        ) : null}
      </RetroWindow>

      <PixelDivider />

      <p className={styles.disclaimer}>
        This page is unofficial and not affiliated with BART or any news outlet. Summaries and links come from
        third-party RSS; always verify details with the original source.
      </p>
    </div>
  );
}
