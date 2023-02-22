import "./App.css";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>{component}</>
    </LocalizationProvider>
  );
}

export default App;
