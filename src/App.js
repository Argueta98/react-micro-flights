import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowFlights from "./components/ShowFlights";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ShowFlights />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
