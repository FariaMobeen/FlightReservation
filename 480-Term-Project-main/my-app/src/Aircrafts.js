import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Aircrafts.css'; // Add a CSS file for styling (create this file in your project)
import { v4 as uuidv4 } from "uuid";

const Aircrafts = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const location = useLocation();
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [aircraftname, setAircraftName] = useState('');
  const [aircrafttype, setAircraftType] = useState('');
  const [id, setId] = useState(uuidv4);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch flights from the Spring Boot backend
    getAircrafts();
  }, []); // Include variables in the dependency array

  const [name, setName] = useState([]);
  const user = location.state?.user ?? null;

  useEffect(() => {
    if (user !== null) {
      setName(user);
      console.log(user); // Use user directly here
    }
  }, [user]);

  const deleteAircraft = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/aircraft/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the state to remove the deleted aircraft
        setAircrafts(aircrafts.filter((aircraft) => aircraft.id !== id));
        console.log('Aircraft deleted successfully');
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addAircraft = () => {
    setIsAddPopupVisible(true);
  };

  const closeAddPopup = () => {
    setIsAddPopupVisible(false);
  };

  const addAircraft2 = async () => {
    try {
      const response = await fetch('http://localhost:8080/aircraft/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `Id=${id}&name=${aircraftname}&type=${aircrafttype}`,
      });

      if (response.ok) {
        const result = await response.text();
        console.log('Response:', result); // Log the response
        // Now, try to parse the response as JSON
        setAircrafts([...aircrafts, { id: id, type: aircrafttype, name: aircraftname }]);
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

  const goback = () =>{
    navigate('/', { state: { user: user } }); // Change this to a certain path for handling guest
  }

  return (
    <div>
      <header style={{ background: '#ddd', color: '#001f3f', padding: '10px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button style={{ background: 'steelblue', fontWeight: 'bold' }} className="app-button" onClick={goback}>
            Main page
          </button>
        </div>
        <h1>Group 17 Airline</h1>
        <div></div>
      </header>
  
      <div style={{ textAlign: 'center' }}>
        <h2>Aircrafts List</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px', width:'50%', marginLeft:'35%' }}>
  {aircrafts.map((Aircraft) => (
    <li key={Aircraft.id} style={{ marginBottom: '10px',border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', width:'50%' }}>
      {Aircraft.name} : {Aircraft.type} 
      <button className="app-button" style={{background: 'steelblue', fontWeight:'bold', marginLeft:'30px'  }}onClick={() => deleteAircraft(Aircraft.id)}>
        Delete Aircraft
      </button>
    </li>
  ))}
</ul>
  
        <button className="app-button" style={{background: '#001f3f', fontWeight:'bold'  }} onClick={addAircraft}>
          Add Aircraft
        </button>
  
        {/* Add Aircraft Modal */}
        {isAddPopupVisible && (
          <div className="modal-overlay">
            <div className="add-aircraft-modal">
              <h3>Add Aircraft</h3>
              <label>
                Aircraft Name:&nbsp;
                <input type="text" value={aircraftname} onChange={(e) => setAircraftName(e.target.value)} />
              </label>
              <br/> <br/>
              <label>
                Aircraft Type: &nbsp;&nbsp;
                <input type="text" value={aircrafttype} onChange={(e) => setAircraftType(e.target.value)} />
              </label>
              <br/> <br/>
              <button className="app-button" style={{background: 'steelblue', fontWeight:'bold'  }}  onClick={addAircraft2}>
                Add Aircraft
              </button>
              
              <button className="app-button" style={{background: 'steelblue', fontWeight:'bold'  }}  onClick={closeAddPopup}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Aircrafts;