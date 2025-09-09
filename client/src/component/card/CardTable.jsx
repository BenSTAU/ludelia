import "../card.scss";

export default function Card({
  height,
  backgroundHeader,
  title,
  subtitle,
  children,
}) {
  return (
    <article className="card" style={{ height: height }}>
      <div className="cardHeader" style={{ backgroundColor: backgroundHeader }}>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </div>
      {children}
    </article>
  );
}
