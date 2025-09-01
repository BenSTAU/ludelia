import "../card.scss";

export default function CardAuth({
  height,
  children,
}) {
  return (
    <article className="card cardAuth" style={{ height: height }}>
      {children}
    </article>
  );
}
