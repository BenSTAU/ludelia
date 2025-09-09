import "./card.scss";

export default function CardAuth({ height, children }) {
  return (
    <article className="card cardAuth">
      <form style={{ height: height }}>{children}</form>
    </article>
  );
}
