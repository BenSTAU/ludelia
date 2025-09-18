
export default function Card({ height, children, cardStyle, onClick }) {
  return (
    <article className={`card  cardLanding ${cardStyle}`}>
      <button onClick={onClick} style={{ height: height }}>
        {children}
      </button>
    </article>
  );
}
