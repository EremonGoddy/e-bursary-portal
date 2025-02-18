import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Homepage from "./components/homepage/Homepage";
import About from "./components/homepage/About";

function App() {
  return (
    <Router>
    <div className="App">
    <Routes>
    <Route exact path="/"  element={<Homepage/>}/>
    <Route path="/about"  element={<About/>}/>
    </Routes>
    </div>
    </Router>
  );
}

export default App;
