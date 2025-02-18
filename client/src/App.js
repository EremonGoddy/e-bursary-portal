import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Homepage from "./components/homepage/Homepage";
import About from "./components/homepage/About";
import Services from "./components/homepage/Services";
import Contact from "./components/homepage/Contact";

function App() {
  return (
    <Router>
    <div className="App">
    <Routes>
    <Route exact path="/"  element={<Homepage/>}/>
    <Route path="/about"  element={<About/>}/>
    <Route path="/services"  element={<Services/>}/>
    <Route path="/contact"  element={<Contact/>}/>
    </Routes>
    </div>
    </Router>
  );
}

export default App;
