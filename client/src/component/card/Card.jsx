export default function Card({ height, children, cardStyle, onClick }) {
  return (
    <article className={`card ${cardStyle} cardLanding`}>
      <button onClick={onClick} style={{ height: height }}>
        {children}
      </button>
    </article>
  );
}
