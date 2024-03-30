import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Aircrafts.css'; // Add a CSS file for styling (create this file in your project)
import { v4 as uuidv4 } from 'uuid';

const Seatmap = () => {
  const [seats, setSeats] = useState([]);
  const [flight, setFlight] = useState([]);
  const [flightId, setFlightID] = useState('');
  const [selected, setSelected] = useState({});
  
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState([]);
  const user = location.state?.user ?? null;
  const fligh = location.state?.fligh ?? null;

  useEffect(() => {
    if (user !== null) {
      setName(user);
    }
    if (fligh !== null) {
      setFlight(fligh);
      setFlightID(fligh.id);
    }
  }, [user]);

  useEffect(() => {
    if (flightId !== '') {
      getSeats();
    }
  }, [flight]);

  const getSeats = async () => {
    try {
      const response = await fetch(`http://localhost:8080/seat/${flight.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSeats(result);
        console.log(seats);
        groupSeatsByLayout(); // Call groupSeatsByLayout after updating seats
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const goback = () => {
    navigate('/', { state: { user: user } });
  };

  const bookSeats = () => {
    navigate('/Payment', { state: { user: user ,fligh:flight,seat:selected} });
  }

  const groupSeatsByLayout = () => {
    const groupedSeats = {};
    seats.forEach((seat) => {
      const match = seat.code.match(/(\d+)([A-Z]+)/);
      if (!match) {
        return;
      }
      const [row, column] = match.slice(1);
      if (!groupedSeats[column]) {
        groupedSeats[column] = {};
      }
      if (!groupedSeats[column][row]) {
        groupedSeats[column][row] = [];
      }
      groupedSeats[column][row].push(seat);
    });

    const columns = Object.keys(groupedSeats);
    const maxRows = Math.max(...columns.map((col) => Object.keys(groupedSeats[col]).length));
    columns.forEach((col) => {
      for (let i = 1; i <= maxRows; i++) {
        if (!groupedSeats[col][i]) {
          groupedSeats[col][i] = [{ empty: true }];
        }
      }
    });

    return groupedSeats;
  };

  const handleSeatClick = (selectedSeat) => {
    if (!selectedSeat.empty && !selectedSeat.taken) {
      if (selectedSeat === selected) {
        console.log(`Seat Unselected: ${selectedSeat.code}`);
        setSelected({});
      } else {
        setSelected(selectedSeat);
        console.log(`Seat Selected: ${selectedSeat.code}`);
      }
    }
  };

    

    const renderSeatmap = () => {
        const groupedSeats = groupSeatsByLayout();
        let columns = Object.keys(groupedSeats);
      
        columns.sort();
      
        return (
          
          <div style={{marginLeft:'650px'}}className="seatmap-container" >
            
            {columns.map((column) => (
              <div key={column} className="column">
                {Object.keys(groupedSeats[column]).map((row) => (
                  <div key={row} className="row">
                    {groupedSeats[column][row].map((seat) => (
                      <div
                        key={seat.id}
                        className={`seat ${seat.taken ? 'taken' : (seat.empty ? 'empty' : 'available')} ${
                          seat.type
                        } ${selected === seat ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat.empty ? '' : seat.code}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      };
  return (
    
    <div>
       <header style={{ background: '#ddd', color: '#001f3f', padding: '10px', textAlign: '', display: 'flex', justifyContent: '', alignItems: '' ,}}>
       
       <div>  <button style={{background: 'steelblue', fontWeight:'bold'  }} className="app-button" onClick={goback}>
        Main page
      </button>
      </div>
      <h1 style={{ margin: '0 auto' ,marginLeft:'500px'}}>Group 17 Airline</h1>
      <div>
     
       
      </div>
    </header>
     
      {renderSeatmap()}
      {Object.keys(selected).length > 0 && (
  <button style={{marginLeft:'700px', background:'steelblue', fontWeight:'bold'}}className="app-button" onClick={bookSeats}>
    Go to Payment
  </button>
)}
    </div>
  );
};

export default Seatmap;