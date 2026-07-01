/**
 * RatingRing.jsx — elemen signature MovieList.
 * Cincin melingkar (mengingatkan pada "focus ring" kamera/lensa film)
 * yang mem-visualisasikan skor TMDB (0–10) sebagai persentase lingkaran.
 */
export default function RatingRing({ voteAverage = 0, size = 56 }) {
  const percentage = Math.round((voteAverage / 10) * 100);
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color = percentage >= 70 ? 'var(--color-forest)' : percentage >= 40 ? 'var(--color-amber)' : 'var(--color-danger)';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Skor ${voteAverage.toFixed(1)} dari 10`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute font-mono text-xs font-semibold" style={{ color }}>
        {percentage}%
      </span>
    </div>
  );
}
