export default function Card({ children, }) {
  return (
    <article className={`card  cardTableContent`}>
      {children}
    </article>
  );
}
