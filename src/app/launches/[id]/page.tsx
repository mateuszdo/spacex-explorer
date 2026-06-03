import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchLaunchById } from "@/lib/launches";
import { FavoriteButton } from "@/components/FavoriteButton";
import { formatLaunchDate } from "@/lib/formatDate";
import styles from "./page.module.css";

export default async function LaunchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const launch = await fetchLaunchById(id);

  if (!launch) {
    notFound();
  }

  const images = launch.links.flickr.original;

  return (
    <>
      <Link href="/" className={styles.back}>
        ← Back to launches
      </Link>

      <div className={styles.header}>
        <h1>{launch.name}</h1>
        <FavoriteButton launch={{ id: launch.id, name: launch.name }} />
      </div>

      <div className={styles.card}>
        <p className={styles.meta}>
          {formatLaunchDate(launch.date_utc, launch.date_precision)}
          {" · "}
          {launch.upcoming
            ? "Upcoming"
            : launch.success === true
              ? "Success"
              : launch.success === false
                ? "Failure"
                : "Unknown"}
        </p>

        {launch.details && <p className={styles.section}>{launch.details}</p>}

        {launch.rocket && (
          <section className={styles.section}>
            <h2>Rocket</h2>
            <p>
              {launch.rocket.name} ({launch.rocket.type})
            </p>
            {launch.rocket.description && <p>{launch.rocket.description}</p>}
          </section>
        )}

        {launch.launchpad && (
          <section className={styles.section}>
            <h2>Launchpad</h2>
            <p>{launch.launchpad.full_name}</p>
            <p>
              {launch.launchpad.locality}, {launch.launchpad.region} —{" "}
              {launch.launchpad.status}
            </p>
          </section>
        )}

        <section className={styles.section}>
          <h2>Links</h2>
          <ul>
            {launch.links.webcast && (
              <li>
                <a href={launch.links.webcast} target="_blank" rel="noreferrer">
                  Webcast
                </a>
              </li>
            )}
            {launch.links.article && (
              <li>
                <a href={launch.links.article} target="_blank" rel="noreferrer">
                  Article
                </a>
              </li>
            )}
            {launch.links.wikipedia && (
              <li>
                <a
                  href={launch.links.wikipedia}
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikipedia
                </a>
              </li>
            )}
          </ul>
        </section>

        {images.length > 0 && (
          <section className={styles.section}>
            <h2>Gallery</h2>
            <div className={styles.gallery}>
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={`${launch.name} photo ${i + 1}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
