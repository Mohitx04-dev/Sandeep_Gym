import logo from './logo.svg';
import './App.css';
import React , {useState} from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Main from './components/main';

function App() {

  return (
    <div className="App">
      <Router>
      <Header />
      <Main />
      <Footer />
      </Router>
    </div>
  );
}
export default App;
