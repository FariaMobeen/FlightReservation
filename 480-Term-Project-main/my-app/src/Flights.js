import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Aircrafts.css'; // Add a CSS file for styling (create this file in your project)
import { v4 as uuidv4 } from "uuid";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const location = useLocation();
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [flightnumber, setFlightnumber] = useState('');
  const [airports, setAirports] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDesination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [aircrafts, setAircrafts] = useState([]);
  const [aircraft,setAircraft] = useState('');
  const [ordinarySeats,setOrdinarySeats] = useState(0);
  const [comfortSeats, setComfortSeats] = useState(0);
  const [businessSeats,setBusinessSeats] = useState(0);
  const [price,setPrice] = useState(100);
  const [id, setId] = useState(uuidv4);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch flights from the Spring Boot backend
    getFlights();
    getAircrafts();
    getAirports();
  }, []); // Include variables in the dependency array

  const [name, setName] = useState([]);
  const user = location.state?.user ?? null;

  useEffect(() => {
    if (user !== null) {
      setName(user);
      console.log(user); // Use user directly here
    }
  }, [user]);

  const deleteFlight = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/flights/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the state to remove the deleted aircraft
        setFlights(flights.filter((flight) => flight.id !== id));
        console.log('Flight deleted successfully');
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }finally {
      setIsLoading(false); // Set loading to false when the request is complete (either success or error)
    }
  };

  const addFlight = () => {
    setIsAddPopupVisible(true);
  };

  const closeAddPopup = () => {
    setIsAddPopupVisible(false);
  };

  const addFlight2 = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/flights/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}&flightNumber=${flightnumber}&origin=${origin}&destination=${destination}&departureDate=${departureDate}&departureTime=${departureTime}&aircraft=${aircraft}&ordinarySeats=${ordinarySeats}&comfortSeats=${comfortSeats}&businessSeats=${businessSeats}&returnDate=${departureDate}&ordinaryFare=${price}`,
      });

      if (response.ok) {
        const result = await response.text();
        console.log('Response:', result); // Log the response
        // Now, try to parse the response as JSON
        setFlights([...flights, { id: id, flightnumber:flightnumber, origin:origin,destination:destination,departureDate:departureDate,departureTime:departureTime,aircraft:aircraft,ordinarySeats:ordinarySeats,comfortSeats:comfortSeats,businessSeats:businessSeats,returnDate:departureDate,ordinaryFare:price }]);
        setId(uuidv4);
        closeAddPopup();
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }finally {
      setIsLoading(false); // Set loading to false when the request is complete (either success or error)
    }
  };

  const getFlights = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/flights/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Assuming the response is in JSON format
        },
      });

      if (response.ok) {
        const result = await response.json(); // Parse the response as JSON
        setFlights(result); // Update the state with the fetched data
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getAircrafts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/aircraft/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Assuming the response is in JSON format
        },
      });

      if (response.ok) {
        const result = await response.json(); // Parse the response as JSON
        setAircrafts(result); // Update the state with the fetched data
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleAircraftChange = (event) => {
    setAircraft(event.target.value);
  };

  const getAirports = async () => {
    try {
      const response = await fetch(`http://localhost:8080/airport/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Assuming the response is in JSON format
        },
      });

      if (response.ok) {
        const result = await response.json(); // Parse the response as JSON
        setAirports(result); // Update the state with the fetched data
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOriginChange = (event) => {
    setOrigin(event.target.value);
  };
  const handleDestChange = (event) => {
    setDesination(event.target.value);
  };


  const [selectedFlightCrew, setSelectedFlightCrew] = useState([]);
  const [newCrew, setNewCrew] = useState('');
  const [isCrewPopupVisible, setIsCrewPopupVisible] = useState(false);
  const [flightId,setFlightID] = useState('');
  const [isPassagerPopupVisible, setIsPassengerPopupVisible] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const manageCrew = (flight) => {
    const crewMembersArray = flight.crew ? flight.crew.split(',') : [];
  setSelectedFlightCrew(crewMembersArray);
  setFlightID(flight.id);
  setIsCrewPopupVisible(true);
  };

  const viewPassengers = (flight) =>{
    setIsPassengerPopupVisible(true);
    viewPassengers2(flight);
  }

  const closeCrewPopup = () => {
    setIsCrewPopupVisible(false);
  };

  const addCrewMember = () => {
    setSelectedFlightCrew([...selectedFlightCrew, newCrew]);
    setNewCrew(''); // Clear the input field after adding a crew member
  };

  const deleteCrewMember = (index) => {
    const updatedCrew = [...selectedFlightCrew];
    updatedCrew.splice(index, 1);
    setSelectedFlightCrew(updatedCrew);
  };
  const [isLoading, setIsLoading] = useState(false);

 const saveCrewChanges = async () => {
  const crewString = selectedFlightCrew.join(',');

  // Create a URLSearchParams object to encode the parameters
  const params = new URLSearchParams();
  params.append('id', flightId);
  params.append('crew', crewString);

  try {
    const response = await fetch(`http://localhost:8080/api/flights/changecrew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Change content type if necessary
      },
      body: params.toString(), // Convert parameters to a URL-encoded string
    });

    if (response.ok) {
      const result = await response.text();
      console.log('Success:', result);

      // Update the flight.crew in the state with the new crewString
      setFlights((prevFlights) => {
        return prevFlights.map((flight) => {
          if (flight.id === flightId) {
            return { ...flight, crew: crewString };
          }
          return flight;
        });
      });
    }  else if (response.status === 404) {
      console.error('Flight not found');
    } else {
      const result = await response.text();
      console.error('Error:', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  closeCrewPopup(); // Close the crew management modal after saving changes
};

const viewPassengers2 = async(flight) =>{
  try {
    const response = await fetch(`http://localhost:8080/ticket/flight/${flight.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Assuming the response is in JSON format
      },
    });

    if (response.ok) {
      const result = await response.json(); // Parse the response as JSON
      setPassengers(result); // Update the state with the fetched data
    } else {
      console.error('Request failed with status:', response.status);
      const result = await response.text();
      console.error('Response:', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

  const goback = () =>{
    navigate('/', { state: { user: user } }); // Change this to a certain path for handling guest
  }

  return (
    <div>
       <header style={{ background: '#ddd', color: '#001f3f', padding: '10px', textAlign: '', display: 'flex', justifyContent: '', alignItems: '' ,}}>
       
       <div>  <button style={{background: 'steelblue', fontWeight:'bold'  }} className="app-button" onClick={goback}>
        Main page
      </button>
      </div>
      <h1 style={{ margin: '0 auto' ,marginLeft:'500px'}}>Group 17 Airline</h1>

    </header>

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
  <h2>Flights List</h2>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {flights.map((flight) => (
      <div
        key={flight.id}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '800px',
          marginBottom: '10px',
          border: '1px solid #ddd', // Add border style
          borderRadius: '5px', // Add border-radius for rounded corners
          padding: '10px', // Add padding for better spacing
        }}
      >
        
          {flight.number} From: {flight.origin}, To: {flight.destination}
          {user.type === 2 && (
            <button className="app-button"  style={{ background: 'steelblue',}}onClick={() => manageCrew(flight)}>
              Manage Crew
            </button>
          )}
      
        
          <button
            className="app-button"
            style={{ background: 'steelblue' }}
            onClick={() => viewPassengers(flight)}
          >
            View Passengers
          </button>
          {user.type === 2 && (
            <button
              className="app-button"
              onClick={() => deleteFlight(flight.id)}
              disabled={isLoading}  style={{ background: 'steelblue' }}
            >
              Cancel Flight
            </button>
          )}
        </div>
      
    ))}
  </div>



      {user.type === 2 ? (<>
      <button className="app-button" style={{background: '#001f3f', fontWeight:'bold'}}onClick={addFlight}>
        Add Flight
      </button></>):(<></>)}

      {user.type === 2 ? (<>
      {isAddPopupVisible && (
        <div className="modal-overlay">
          <div className="add-aircraft-modal">
            <h3>Add Aircraft</h3>
            <label >
              Flight Number:
              <input style={{ marginLeft: '70px' }}type="text" value={flightnumber} onChange={(e) => setFlightnumber(e.target.value)} />
            </label>
            <br/><br/>
            <label htmlFor="aircraftDropdown">Select a Origin City:</label>
      <select style={{ marginLeft: '72px' }}
        id="aircraftDropdown"
        value={origin}
        onChange={handleOriginChange}
      >
        <option value="">Select a Origin City</option>
        {airports.map((airport) => (
          <option key={airport.id} value={airport.city}>
            {airport.city}
          </option>
        ))}

      </select>
      <br/><br/>
      <label htmlFor="aircraftDropdown">Select a Destination City:</label>
      <select style={{ marginLeft: '7px' }}
        id="aircraftDropdown"
        value={destination}
        onChange={handleDestChange}
      >
        <option value="">Select a Destination City</option>
        {airports.map((airport) => (
          <option key={airport.id} value={airport.city}>
            {airport.city}
          </option>
        ))}
      </select>
      <br/><br/>
            <label>
            Departure Date:
              <input style={{ marginLeft: '127px' }}type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            </label>
            <br/><br/>
            <label>
            Departure Time:
              <input style={{ marginLeft: '145px' }}type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
            </label>
            <br/><br/>
            <label htmlFor="aircraftDropdown">Select Aircraft:</label>
      <select style={{ marginLeft: '130px' }}
        id="aircraftDropdown"
        value={aircraft}
        onChange={handleAircraftChange}
      >
        <option value="">Select an aircraft</option>
        {aircrafts.map((aircraft) => (
          <option key={aircraft.id} value={aircraft.name}>
            {aircraft.name}
          </option>
        ))}
      </select>
      <br/><br/>
            <label>
            Number of Ordinary Seats:&nbsp;
              <input type="number"  value={ordinarySeats} onChange={(e) => setOrdinarySeats(e.target.value)} />
            </label>
            <br/><br/>
            <label>
            Number of Comfort Seats:&nbsp;
              <input type="number" value={comfortSeats} onChange={(e) => setComfortSeats(e.target.value)} />
            </label>
            <br/><br/>
            <label>
            Number of Business Seats:&nbsp;
              <input type="number" value={businessSeats} onChange={(e) => setBusinessSeats(e.target.value)} />
            </label>
            <br/><br/>
            <label>
            Price for seat:
              <input style={{ marginLeft: '93px' }}type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <br/><br/>
            <button className="app-button" style={{marginLeft:'70px',background: 'steelblue', fontWeight:'bold'  }}onClick={addFlight2} disabled={isLoading}>
              Add Flight
            </button>
            <button className="app-button" style={{background: 'steelblue', fontWeight:'bold'  }}onClick={closeAddPopup} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </div>
      )}
     {isCrewPopupVisible && (
  <div className="modal-overlay">
    <div className="manage-crew-modal">
      <h3 style={{ textAlign: 'center' }}>Manage Crew</h3>
      <ul>
        {selectedFlightCrew.map((crewMember, index) => (
          <li key={`crew-${index}`}>
            {crewMember}
            <button className="app-button" onClick={() => deleteCrewMember(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <label>
        New Crew member: &nbsp;
        <input type="text" value={newCrew} onChange={(e) => setNewCrew(e.target.value)} />
      </label>
      <br/><br/>
      <button className="app-button" style={{ background: 'steelblue', fontWeight: 'bold' }} onClick={addCrewMember}>
        Add Crew Member
      </button>
      <button className="app-button" style={{ background: 'steelblue', fontWeight: 'bold' }} onClick={saveCrewChanges}>
        Save Changes
      </button>
      <button className="app-button" style={{ background: 'steelblue', fontWeight: 'bold' }} onClick={closeCrewPopup}>
        Cancel
      </button>
    </div>
  </div>
)}

      </>):(<></>)}
      {isPassagerPopupVisible && (
        <div className="modal-overlay">
          <div className="manage-crew-modal">
            <h3>View Passengers</h3>
            <ul>
              {passengers.map((passenger) => (
                <li key={`${passenger.id}`}>
                  {passenger.name} - In Seat {passenger.seatcode}
                </li>
              ))}
            </ul>
            <button className="app-button" style={{  marginLeft:'30px',background: 'steelblue', fontWeight: 'bold' }}onClick={() => setIsPassengerPopupVisible(false)}>
              Back
            </button>
          </div>
        </div>
      )}
    </div> </div>
  );
};

export default Flights;