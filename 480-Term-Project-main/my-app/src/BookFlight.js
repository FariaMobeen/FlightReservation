import React, { useState, useEffect } from 'react';
import './BookFlight.css';
import { useLocation, useNavigate } from 'react-router-dom';

const BookFlight = () => {
  const location = useLocation();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [seatType, setSeatType] = useState('ordinary'); // Default to ordinary

  const [name, setName] = useState([]);
  const user = location.state?.user ?? null;
  const [airports, setAirports] = useState([]); // State to store airport data

  useEffect(() => {
    if (user !== null) {
      setName(user);
      console.log(user);
    }
  }, [user]);

  useEffect(() => {
    // Fetch airport data when the component mounts
    getAirports();
  }, []);

  const navigate = useNavigate();

  const handleGetFlights = (e) => {
    e.preventDefault();
    console.log('fromLocation:', fromLocation);
    console.log('toLocation:', toLocation);
    console.log('departureDate:', departureDate);
    console.log('returnDate:', returnDate);
    console.log('guests:', guests);
    console.log('seatType:', seatType);

    // Pass user inputs as URL parameters to FlightList
    navigate(`/FlightList?fromLocation=${fromLocation}&toLocation=${toLocation}&departureDate=${departureDate}&returnDate=${departureDate}&guests=${guests}&seatType=${seatType}`, { state: { user: user } });
  };

  const goback = () => {
    navigate('/', { state: { user: user } });
  };

  const getAirports = async () => {
    try {
      const response = await fetch(`http://localhost:8080/airport/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAirports(result);
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
         <header style={{ background: '#ddd', color: '#001f3f', padding: '10px', textAlign: '', display: 'flex', justifyContent: '', alignItems: '' ,}}>
       
       <div>  <button style={{background: 'steelblue', fontWeight:'bold'  }} className="app-button" onClick={goback}>
        Main page
      </button>
      </div>
      <h1 style={{ margin: '0 auto' ,marginLeft:'500px'}}>Group 17 Airline</h1>
      <div>
     
       
      </div>
    </header>
     
      <div className="book-flight-container">
        <div className="book-flight-form">
          <div className="book-flight-header">
            <h2>Book a Flight</h2>
          </div>
          {/* Flight search form */}
          <form onSubmit={handleGetFlights}>
            <div>
              <label>
                From
                <select value={fromLocation} onChange={(e) => setFromLocation(e.target.value)}>
                  <option value="">Select an origin city</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.city}>
                      {airport.city}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Going to
                <select value={toLocation} onChange={(e) => setToLocation(e.target.value)}>
                  <option value="">Select a destination city</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.city}>
                      {airport.city}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
                Departure date
                <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
              </label>
            </div>

            <div>
              <label>
                Seat Type
                <select value={seatType} onChange={(e) => setSeatType(e.target.value)}>
                  <option value="ordinary">$ Ordinary</option>
                  <option value="comfort">$$ Comfort</option>
                  <option value="business">$$$ Business Class</option>
                </select>
              </label>
            </div>

            <button type="submit" style={{ marginLeft: '100px' }}>GET FLIGHTS</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookFlight;
