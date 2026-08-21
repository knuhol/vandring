import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

import type { Hike } from '@/types'

import styles from './page.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getHikeSlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const hike = await getHike(slug)

  if (hike === null) {
    return {
      title: 'Vandringen hittades inte',
    }
  }

  return {
    title: `Knut på ${hike.summary_title}`,
    description: `Följ Knuts vandring genom ${hike.summary_title} – live-position, framsteg, utrustning och bilder från fjällen.`,
    openGraph: {
      title: `Knut på ${hike.summary_title}`,
      description: `Följ Knuts vandring genom ${hike.summary_title} – live-position, framsteg, utrustning och bilder från fjällen.`,
      type: 'website',
      locale: 'sv_SE',
    },
  }
}

export default async function HikePage({ params }: Props) {
  const { slug } = await params
  const hike = await getHike(slug)

  if (hike === null) {
    notFound()
  }

  return (
    <>
      <header className="header">
        {hike.logo_url && (
          <img className={styles.logo} src={hike.logo_url} alt={hike.summary_title} />
        )}

        <Link href="/">
          <Image
            className="profile-photo"
            src="/knut.png"
            alt="Knut på leden"
            width={132}
            height={132}
            priority
          />
        </Link>

        <h1 className="title">{hike.title}</h1>
        <p className="subtitle">{hike.sub_title}</p>
      </header>

      <main className={styles.container}>
        <section
          className={styles.card}
          dangerouslySetInnerHTML={{ __html: hike.description_html }}
        />

        {hike.sheet_url && (
          <section className={styles.card}>
            <h2>📊 Framsteg i siffror</h2>
            <p>Här uppdaterar jag kilometer, etapper och milstolpar längs vägen.</p>
            <a
              className={styles.button}
              href={hike.sheet_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Öppna framsteg i Google Sheets (öppnas i ny flik)"
            >
              Se senaste uppdateringen
            </a>
          </section>
        )}

        {hike.status === 'ongoing' ? (
          <section className={styles.card}>
            <h2>📍 Live-position</h2>

            <p>Undrar du var jag är just nu? Följ min position live via Garmin MapShare.</p>

            <p className={styles.passwordNote}>
              <strong>Lösenord:</strong>{' '}
              <code className={styles.passwordCode}>Jämtlandsfjällen2026</code>
            </p>

            <a
              className={styles.button}
              href="https://share.garmin.com/share/knuhol"
              target="_blank"
              rel="noopener noreferrer"
            >
              Öppna live-kartan
            </a>
          </section>
        ) : (
          <section className={`${styles.card} ${styles.cardDisabled}`}>
            <h2>📍 Live-position</h2>
            <p> Live-positionen är endast aktiv under pågående vandringar.</p>
            <p className={styles.passwordNote}>
              <strong>Status:</strong> <code className={styles.passwordCode}>Ej aktiv</code>
            </p>
            <a
              className={`${styles.button} ${styles.buttonDisabled}`}
              aria-disabled="true"
              tabIndex={-1}
            >
              Live-kartan är inte tillgänglig
            </a>
          </section>
        )}

        {hike.packing_list_url && (
          <section className={styles.card}>
            <h2>🎒 Utrustning</h2>
            <p>Nyfiken på vad jag bär med mig? Här hittar du hela min packlista.</p>
            <a
              className={styles.button}
              href={hike.packing_list_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Se packlista på Packwizard (öppnas i ny flik)"
            >
              Se min gear-lista
            </a>
          </section>
        )}

        {hike.show_pictures_link && (
          <section className={styles.card}>
            <h2>📸 Från leden</h2>

            <p>På Instagram delar jag bilder, korta rapporter och livet mellan etapperna.</p>

            <a
              className={styles.button}
              href="https://www.instagram.com/knutvandrar"
              target="_blank"
              rel="noopener noreferrer"
            >
              Se bilder och uppdateringar
            </a>
          </section>
        )}
      </main>
    </>
  )
}

async function getHike(slug: string): Promise<Hike | null> {
  'use cache'
  cacheLife('max')
  cacheTag('hikes')

  const response = await fetch(
    `https://cjfkbcgbpxxvejfvexwi.supabase.co/rest/v1/hike?slug=eq.${encodeURIComponent(slug)}&select=*`,
    {
      headers: {
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY!,
        Accept: 'application/vnd.pgrst.object+json',
      },
    },
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch hike')
  }

  return response.json()
}

async function getHikeSlugs(): Promise<{ slug: string }[]> {
  'use cache'

  cacheLife('max')
  cacheTag('hikes')

  const response = await fetch(
    'https://cjfkbcgbpxxvejfvexwi.supabase.co/rest/v1/hike?select=slug',
    {
      headers: {
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY!,
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch hike slugs')
  }

  return response.json()
}
