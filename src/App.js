import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import UserDetails from './components/UserDetails/UserDetails';
import Description from './components/descriptionPage/Description';

function App() {


  


  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/user-details/:repo_name" element={<Description />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
