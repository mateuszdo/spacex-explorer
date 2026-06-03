import Link from "next/link";
import type { Launch } from "@/types/launch";
import { FavoriteButton } from "@/components/FavoriteButton";
import { formatLaunchDate } from "@/lib/formatDate";
import styles from "./LaunchCard.module.css";

function statusLabel(launch: Launch) {
  if (launch.upcoming) return "Upcoming";
  if (launch.success === true) return "Success";
  if (launch.success === false) return "Failure";
  return "Unknown";
}

export function LaunchCard({ launch }: { launch: Launch }) {
  return (
    <li className={styles.card}>
      <div className={styles.top}>
        <span className={styles.status}>{statusLabel(launch)}</span>
        <FavoriteButton launch={{ id: launch.id, name: launch.name }} />
      </div>
      <Link href={`/launches/${launch.id}`} className={styles.name}>
        {launch.name}
      </Link>
      <time className={styles.date} dateTime={launch.date_utc}>
        {formatLaunchDate(launch.date_utc, launch.date_precision)}
      </time>
    </li>
  );
}
