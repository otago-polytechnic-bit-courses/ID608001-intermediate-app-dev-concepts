import { BrowserRouter, Routes, Route } from "react-router";

import "./index.css";
import Home from "./components/Home.tsx";
import Contact from "./components/Contact.tsx";
import Details from "./components/Details.tsx";
import NotFound from "./components/NotFound.tsx";
import Navbar from "./components/Navbar.tsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route
            path="/"
            element={
              <>
                <Home />
              </>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
