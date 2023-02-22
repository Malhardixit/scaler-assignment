import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";

function App() {
  let component;

  switch (window.location.pathname) {
    case "/":
      component = <Home />;
      break;

    case "/schedule":
      component = <Schedule />;
      break;
  }

  return <>{component}</>;
}

export default App;
