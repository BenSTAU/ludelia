import "./card.scss";

export default function CardForm({ height, children }) {
  return (
    <article className="card cardForm">
      <form style={{ height: height }}>{children}</form>
    </article>
  );
}
