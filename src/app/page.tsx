import Link from 'next/link'
import { cacheLife, cacheTag } from 'next/cache'

import type { Hike } from '@/types'

import styles from '@/app/page.module.css'

const HomePage = async () => {
  const hikes = await getHikes()

  return (
    <>
      <header className="header">
        <img className="profile-photo" src="/knut.jpg" alt="Knut" />

        <h1 className="title">🥾 Knuts vandringar</h1>
        <p className="subtitle">Följ mina vandringar och fjälläventyr runt om i Sverige 🇸🇪</p>
      </header>

      <main className={styles.container}>
        {hikes.map((hike) => (
          <article className={styles.card} key={hike.id}>
            <span className={`${styles.badge} ${styles[STATUS_CLASS_MAP[hike.status]]}`}>
              {HIKE_STATUS_MAP[hike.status]}
            </span>

            <h2 className={styles.cardTitle}>{hike.summary_title}</h2>

            <div className={styles.meta}>
              <div>🗓️ {new Intl.NumberFormat('sv-SE').format(hike.total_days)} dagar</div>
              {hike.total_distance && (
                <div>🥾 {new Intl.NumberFormat('sv-SE').format(hike.total_distance)} km</div>
              )}
              {hike.total_ascent && (
                <div>⛰️ {new Intl.NumberFormat('sv-SE').format(hike.total_ascent)} m</div>
              )}
            </div>

            <p>{hike.summary_description}</p>

            <Link className={styles.button} href={`/${hike.slug}`}>
              Visa vandringen →
            </Link>
          </article>
        ))}
      </main>
    </>
  )
}

const getHikes = async (): Promise<Hike[]> => {
  'use cache'
  cacheLife('max')
  cacheTag('hikes')

  const response = await fetch(
    'https://cjfkbcgbpxxvejfvexwi.supabase.co/rest/v1/hike?select=*&order=id.desc',
    {
      headers: {
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY!,
      },
    },
  )

  return (await response.json()) as Hike[]
}

const HIKE_STATUS_MAP: Record<Hike['status'], string> = {
  completed: 'Genomförd',
  ongoing: 'Pågående',
  planned: 'Planerad',
}

const STATUS_CLASS_MAP: Record<Hike['status'], keyof typeof styles> = {
  completed: 'badgeCompleted',
  ongoing: 'badgeOngoing',
  planned: 'badgePlanned',
}

export default HomePage
