import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import { Element } from "react-scroll"; // Import Element

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>

      <Element name="transactions">
        <Transactions />
      </Element>

      <Element name="services">
        <Services />
      </Element>

      <Footer />
    </div>
  );
};

export default App;
