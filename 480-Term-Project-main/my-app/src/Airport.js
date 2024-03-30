import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Aircrafts.css'; // Add a CSS file for styling (create this file in your project)
import { v4 as uuidv4 } from "uuid";

const Airport = () => {
  const [airports, setAirports] = useState([]);
  const location = useLocation();
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [airportcode, setAirportcode] = useState('');
  const [airportcity, setAirportcity] = useState('');
  const [id, setId] = useState(uuidv4);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch flights from the Spring Boot backend
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

  const deleteAirport = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/airport/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the state to remove the deleted aircraft
        setAirports(airports.filter((airport) => airport.id !== id));
        console.log('Airport deleted successfully');
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addAirport = () => {
    setIsAddPopupVisible(true);
  };

  const closeAddPopup = () => {
    setIsAddPopupVisible(false);
  };

  const addAirport2 = async () => {
    try {
      const response = await fetch('http://localhost:8080/airport/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `Id=${id}&code=${airportcode}&city=${airportcity}`,
      });

      if (response.ok) {
        const result = await response.text();
        console.log('Response:', result); // Log the response
        // Now, try to parse the response as JSON
        setAirports([...airports, { id: id, code: airportcode, city: airportcity }]);
        setId(uuidv4);
        closeAddPopup();
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
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

  const goback = () =>{
    navigate('/', { state: { user: user } }); // Change this to a certain path for handling guest
  }

  return (
    <div>
      <header style={{ background: '#ddd', color: '#001f3f', padding: '10px', textAlign: '', display: 'flex', justifyContent: '', alignItems: '' }}>
        <div>
          <button style={{ background: 'steelblue', fontWeight: 'bold' }} className="app-button" onClick={goback}>
            Main page
          </button>
        </div>
        <h1 style={{ margin: '0 auto', marginLeft: '500px' }}>Group 17 Airline</h1>
        <div></div>
      </header>
  
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <h2>Airports List</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {airports.map((airport) => (
            <li
              key={airport.id}
              style={{
                width: '30%', // Adjust width based on your design
                marginBottom: '10px',
                border: '1px solid #ddd', // Add border style
                borderRadius: '5px', // Add border-radius for rounded corners
                padding: '10px', // Add padding for better spacing
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center', // Center content vertically
              }}
            >
              {airport.code} : {airport.city}
              <button className="app-button" style={{background: 'steelblue', fontWeight:'bold'  }} onClick={() => deleteAirport(airport.id)}>
                Delete Airport
              </button>
            </li>
          ))}
        </ul>
        <button style={{ background: '#001f3f', fontWeight:'bold'}}className="app-button" onClick={addAirport}>
          Add Airport
        </button>
  
        {/* Add Aircraft Modal */}
        {isAddPopupVisible && (
          <div className="modal-overlay">
            <div className="add-aircraft-modal">
              <h3>Add Airport</h3>
              <label>
                Airport Code:
                <input type="text" value={airportcode} onChange={(e) => setAirportcode(e.target.value)} />
              </label>
              <label>
                City:
                <input type="text" value={airportcity} onChange={(e) => setAirportcity(e.target.value)} />
              </label>
              <button className="app-button" onClick={addAirport2}>
                Add Airport
              </button>
              <button className="app-button" onClick={closeAddPopup}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Airport;