import React from "react";
import { useEffect, useState } from "react";
import Header from './Header'; // Import the Header component
import { useLocation,useNavigate } from "react-router-dom";
import "./App.css"; // Import a CSS file for styling
import "./Aircrafts.css"; // Import a CSS file for styling

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState([]);
  const user = location.state?.user?? null;
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user !== null) {
      setName(user);
      console.log(user); // Use user directly here
    }
  }, [user]);
  const handleLogin = () => {
    console.log('Login button clicked');
    // Add logic for handling login button click
    navigate('/Login'); // Change this to a certain path for handling login
  };

  const handleCreateAccount = () => {
    navigate('/createAccount');
  };

  const handleGuest = () => {
    console.log('Guest button clicked');
    // Add logic for handling guest button click
    navigate('/BookFlight'); // Change this to a certain path for handling guest
  };

  const handleBookflight = () => {
    console.log('Book Flight button clicked');
    // Add logic for handling guest button click
    navigate('/BookFlight', { state: { user: name } }); // Change this to a certain path for handling guest
  };

  const handleAircrafts = () => {
    console.log('Aircrafts button clicked');
    // Add logic for handling guest button click
    navigate('/Aircrafts', { state: { user: name } });  };

  const handleAccounts = () => {
    console.log('Aircrafts button clicked');
      // Add logic for handling guest button click
    navigate('/Accounts', { state: { user: name } });  };
    
    const handleFlights = () => {
      console.log('Aircrafts button clicked');
        // Add logic for handling guest button click
        navigate('/Flights', { state: { user: name } });  };

        const handleAirports = () => {
          console.log('Airports button clicked');
            // Add logic for handling guest button click
            navigate('/Airport', { state: { user: name } });  };
      
  const handleBookings = () => {
    console.log('Bookings button clicked');
    // Add logic for handling guest button click
    navigate('/Bookings', { state: { user: name } });  };
            
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [ticketId, setTicketId] = useState('');

    const handleCancel = () =>{
      setIsPopupVisible(true);
    }
    const closeAddPopup = () =>{
      setIsPopupVisible(false);
      setTicketId('');
    }

    const cancelTicket = async() =>{
      try {
        setIsLoading(true); // Set loading to true when Pay is initiated

        const response = await fetch(`http://localhost:8080/ticket/delete/${ticketId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // Update the state to remove the deleted aircraft
          console.log('Booking deleted successfully');
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
    }

  const logout = () =>{
    navigate('/');  
  };

  const membership = async () => {
    try {
      setIsLoading(true); // Set loading to true when Pay is initiated

      const response = await fetch(`http://localhost:8080/demo/promo/${name.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the state to remove the deleted aircraft
        console.log('Changed Promo successfully');
        setName({address:name.address,email:name.email,id:name.id,name:name.name,password:name.password,type:name.type,promo:!(name.promo),freeflight:true})
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
  }
  
  return (
    <div className="app-container">
      <Header />
      {user == null? (<></>):(<>
      
        <h1 className="app-header" style={{color:'black'}}>Welcome {user.name}</h1>
        <button className="app-button" style={{ background: '#001f3f'}}onClick={logout}>
        Logout
      </button>
        
        {name.promo == true? (<>
          <button className="app-button" style={{ background: '#001f3f'}}onClick={membership} disabled={isLoading}>
          End membership
        </button>
          </>):(<>
            <button className="app-button" style={{ background: '#001f3f'}}onClick={membership} disabled={isLoading}>
          Enroll in membership
        </button>
            </>
        )}</>
        
      )}
     
      <div className="button-container">
       
       
        {user == null? (   <>     <button className="app-button"style={{marginTop:'200px', background: '#001f3f'}} onClick={handleGuest}>
          Book Flight as Guest
        </button>

                <button className="app-button" style={{marginTop:'200px', background: '#001f3f'}} onClick={handleCancel}>
                Cancel Booking
              </button></>):<><button className="app-button" style={{marginTop:'200px', background: '#001f3f'}}onClick={handleBookflight}>
          Book Flight
        </button>
        <button className="app-button" style={{marginTop:'200px', background: '#001f3f'}}onClick={handleBookings}>
        View/Cancel Your Bookings
      </button></>}
        {user == null ? (<></>):user.type > 0 ? (user.type === 2 ? (<div>
          <button className="app-button"  style={{background: '#001f3f'}}onClick={handleAircrafts}>
          Edit/View Aircrafts
        </button>
        <button className="app-button" style={{background: '#001f3f'}}onClick={handleFlights}>
          Edit/View Flights
        </button>
        <button className="app-button" style={{background: '#001f3f'}}onClick={handleAccounts}>
          Edit/View Users
        </button>
        <button className="app-button" style={{background: '#001f3f'}}onClick={handleAirports}>
          Edit/View Airports
        </button>
        </div>):(<><button className="app-button" style={{background: '#001f3f'  }}onClick={handleFlights}>
          Browse Passengers on flights
        </button></>)):(<></>)}
      </div>
      {isPopupVisible && (
        <div className="modal-overlay">
          <div className="add-aircraft-modal">
            <h3>Cancel Booking</h3>
            <label>
              Ticket ID: &nbsp;
              <input type="text" value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
            </label>
            <br/>
            <br/>
            

            <button className="app-button" style = {{background:'steelblue'}}onClick={cancelTicket} disabled={isLoading}>
              Cancel Ticket
            </button>
            <button className="app-button" style = {{background:'steelblue'}}onClick={closeAddPopup} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
