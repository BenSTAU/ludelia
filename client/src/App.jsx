import Card from "./component/card/Card";
import Footer from "./component/footer/Footer";
import Nav from "./component/nav/Nav";

function App() {
  return (
    <>
      <Nav />
      <main>
        <Card
          height="200px"
          backgroundHeader={"var(--color-accent-1)"}
          title={"Card Title"}
          subtitle={"Card Subtitle"}
        />
      </main>
      <Footer />
    </>
  );
}

export default App;
