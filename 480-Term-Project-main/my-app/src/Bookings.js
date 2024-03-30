import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Aircrafts.css'; // Add a CSS file for styling (create this file in your project)
import { v4 as uuidv4 } from "uuid";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const location = useLocation();
  const [id, setId] = useState('');
  const navigate = useNavigate();
  const [name, setName] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    // Fetch flights from the Spring Boot backend
    if(id!==''){
    getBookings();
    }
  }, [name]); // Include variables in the dependency array

  const user = location.state?.user ?? null;

  useEffect(() => {
    if (user !== null) {
      setName(user);
      setId(user.id);
      console.log(user); // Use user directly here
    }
  }, [user]);

  const deleteBooking = async (id) => {
    try {
        setIsLoading(true); // Set loading to true when Pay is initiated

      const response = await fetch(`http://localhost:8080/ticket/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the state to remove the deleted aircraft
        setBookings(bookings.filter((booking) => booking.id !== id));
        console.log('Booking deleted successfully');
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
        setIsLoading(false); // Set loading to false when the request is complete (either success or error)
      }
  };


  const getBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/ticket/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Assuming the response is in JSON format
        },
      });

      if (response.ok) {
        const result = await response.json(); // Parse the response as JSON
        setBookings(result); // Update the state with the fetched data
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
  
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Bookings List</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {bookings.map((booking) => (
            <li key={booking.id} style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', margin: '10px 0', width: '400px' }}>
              <p> Flight: {booking.origin} &#x2192; {booking.dest} </p>
              <p> Seat: {booking.seatcode}</p>
              <p> At: {booking.depature} - {booking.time}</p>
              <button
                className="app-button"
                style={{ background: 'steelblue', fontWeight: 'bold', border: 'none', color: 'white', borderRadius: '5px' }}
                onClick={() => deleteBooking(booking.id)}
                disabled={isLoading}
              >
                Cancel Booking
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
};

export default Bookings;