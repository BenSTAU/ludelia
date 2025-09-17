import "./styles/card.scss"

export default function CardForm({ height, children, cardStyle = "" }) {
  return (
    <article className={`card cardForm ${cardStyle}`}>
      <form style={{ height: height }}>{children}</form>
    </article>
  );
}
