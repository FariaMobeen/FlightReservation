import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const { search } = useLocation();
  const location = useLocation();
  const params = new URLSearchParams(search);
  const fromLocation = params.get('fromLocation');
  const toLocation = params.get('toLocation');
  const departureDate = params.get('departureDate');
  const returnDate = params.get('returnDate');
  const guests = params.get('guests');
  const seatType = params.get('seatType');

  const [apiResponse, setApiResponse] = useState(null);
  const [name, setName] = useState([]);
  const user = location.state?.user ?? null;
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null) {
      setName(user);
      console.log(user); // Use user directly here
    }
  }, [user]);
  useEffect(() => {
    const getFlights = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/flights/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          setFlights(result);
          setApiResponse(result); // Set the entire API response
          console.log('API Response:', result);
        } else {
          console.error('Request failed with status:', response.status);
          const result = await response.text();
          console.error('Response:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getFlights();
  }, [fromLocation, toLocation, departureDate, returnDate, guests, seatType]);

  // Filter flights based on criteria
  const filteredFlights = flights.filter((flight) => {
    const formattedDepartureDate = new Date(flight.departureDate).toISOString().split('T')[0];

    const enoughSeats =
      seatType === 'ordinary'
        ? flight.ordinarySeats >= guests
        : seatType === 'comfort'
        ? flight.comfortSeats >= guests
        : seatType === 'business'
        ? flight.businessSeats >= guests
        : false;

    // Check if returnDate from API response matches user's returnDate
    const returnDateMatches = returnDate ? flight.returnDate === returnDate : true;

    return (
      flight.arrival === fromLocation &&
      flight.destination === toLocation &&
      formattedDepartureDate === departureDate &&
      enoughSeats &&
      returnDateMatches
    );
  });
  const goback = () =>{
    navigate('/', { state: { user: user } }); // Change this to a certain path for handling guest
  }
  const goSeatMap  = (flight) => {
    navigate('/Seatmap', { state: { user: user , fligh:flight} });
  }
  
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
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <div style={{ background: '', padding: '20px', borderRadius: '5px', marginBottom: '' }}>
        <h2 style={{ fontSize: '24px', margin: 0 ,color:  '#001f3f'}}>Flight Search Results</h2>
        <br/>
        <div style={{ border: '2px solid #001F3F', borderWidth: '40%', padding: '10px', borderRadius: '5px', width:'500px', marginLeft:'475px' }}>
  <p style={{ fontSize: '18px', margin: '10px 0', fontWeight: 'bold' }}>
    {fromLocation} <span>&rarr;</span> {toLocation}
  </p>
  <p style={{ fontSize: '18px', margin: '10px 0', fontWeight: 'bold' }}>
    Departure Date: {departureDate}
  </p>
</div>

      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredFlights.map((flight) => (
          <li
            key={flight.id}
            style={{
              marginBottom: '20px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              display: 'flex',
              width: '60%', // Set the width to 70%
              margin: '0 auto', // Center the list item
              marginTop: '20px', // Add margin to the top
              paddingBottom: '20px', // Add padding to the bottom
            }}
          >
            <div style={{ flex: '1', padding: '10px' }}>
              <p style={{ fontSize: '18px', margin: '5px 0' ,fontWeight: 'bold' }}>
                {flight.arrival} to {flight.destination}
              </p>
              <p style={{ fontSize: '18px', margin: '5px 0',fontWeight: 'bold'  }}>Departure Time: {flight.departureTime}</p>
              
              {returnDate && (
                <p style={{ fontSize: '18px', margin: '5px 0',fontWeight: 'bold'  }}>Departure Date: {flight.returnDate}</p>
              )}
              <p style={{ fontSize: '18px', margin: '5px 0',fontWeight: 'bold'  }}>
                Operated by: Group17Airline
              </p>
              <p style={{ fontSize: '18px', margin: '5px 0' ,fontWeight: 'bold' }}>Aircraft: {flight.aircraft}</p>
              <p style={{ fontSize: '18px', margin: '5px 0',fontWeight: 'bold'  }}>
                Seat Class: {seatType.charAt(0).toUpperCase() + seatType.slice(1)}
              </p>
            </div>
            <div style={{ flex: '1', padding: '10px' }}>
              <p style={{ fontSize: '18px', margin: '5px 0',marginTop:'10px' ,fontWeight: 'bold'}}>
                Fare Price: ${calculateFarePrice(flight, seatType, guests)}
              </p>
           
                <button style={{ fontSize: '18px', margin: '10px 0', padding: '10px 20px', cursor: 'pointer' ,marginTop:'80px', borderRadius:'5px', background:'steelblue', border:'none', color:'white', fontWeight:'bold'}} onClick={() => goSeatMap(flight)}>
  Continue to Seat map
                </button>
      
            </div>
          </li>
        ))}
      </ul>
 
    </div>
    </>
  );
};

export default FlightList;

// Helper function to calculate fare price based on seat type
const calculateFarePrice = (flight, seatType, guests) => {
  const ordinaryFare = parseFloat(flight.ordinaryFare);

  switch (seatType) {
    case 'ordinary':
      return `${ordinaryFare}`;
    case 'comfort':
      return `${(1.4 * ordinaryFare).toFixed(2)}`;
    case 'business':
      return `${(2 * ordinaryFare).toFixed(2)}`;
    default:
      return 'Unknown';
  }
};
