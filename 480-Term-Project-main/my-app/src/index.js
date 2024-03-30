import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css';
import App from './App';
import CreateAccount from './CreateAccount'; // Assuming you have a CreateAccount component
import BookFlight from './BookFlight';
import FlightList from './FlightList';
import Login from './Login';
import Aircrafts from './Aircrafts';
import Users from './Users';
import Flights from './Flights';
import Airport from './Airport';
import Seatmap from './Seatmap';
import Payment from './Payment';
import Bookings from './Bookings';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/BookFlight" element={<BookFlight />} />
        <Route path="/FlightList" element={<FlightList />} />
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Aircrafts" element={<Aircrafts/>}/>
        <Route path="/Accounts" element={<Users/>}/>
        <Route path="/Flights" element={<Flights/>}/>
        <Route path="/Airport" element={<Airport/>}/>
        <Route path="/Seatmap" element={<Seatmap/>}/>
        <Route path="/Payment" element={<Payment/>}/>
        <Route path="Bookings" element={<Bookings/>}/>
      </Routes>
    </Router>
  </React.StrictMode>,
);

// ... rest of the code


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

