import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Aircrafts.css'; // Add a CSS file for styling (create this file in your project)
import { v4 as uuidv4 } from "uuid";

const Payment = () => {
  const location = useLocation();
  const [seat,setSeat] = useState([]);
  const [flight,setFlight] = useState([]);
  const [flightId, setFlightID] = useState('');
  const [id, setId] = useState(uuidv4);
  const [price, setPrice] = useState(0);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [email, setEmail] = useState('');

  const [isTravelInsuranceChecked, setIsTravelInsuranceChecked] = useState(false);
  const [freeflight, setFreeflight] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState([]);
  const [nam, setNam] = useState('');
  const user = location.state?.user ?? null;
  const fligh = location.state?.fligh ?? null;
  const sea = location.state?.seat ?? null;

  useEffect(() => {
    if (user !== null) {
        setName(user);
        setNam(user.name);
        setEmail(user.email);
      }
      if (fligh !== null) {
        setFlight(fligh);
        setFlightID(fligh.id);
      }
      if (sea!== null){
        setSeat(sea)
      }
  }, [user]);
  
  const calculateFarePrice = (flight, seatType) => {
    const ordinaryFare = parseFloat(flight.ordinaryFare);
        switch (seatType) {
      case 'ordinary':
        return `${(ordinaryFare).toFixed(2)}`
      case 'comfort':
        return `${(1.4 * ordinaryFare).toFixed(2)}`;
      case 'business':
        return `${(2 * ordinaryFare).toFixed(2)}`;
      default:
        return 'Unknown';
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const PayPopup = () => {
    setIsAddPopupVisible(true);
    setPrice(((freeflight? 0: ((isTravelInsuranceChecked ? 0.05 * calculateFarePrice(flight, seat.type) : 0) + (1.15 * calculateFarePrice(flight, seat.type))))).toFixed(2))
  };

  const closeAddPopup = () => {
    setIsAddPopupVisible(false);
  };

  const Pay = async() => {
    try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/ticket/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `Id=${id}&flight=${flight.id}&seat=${seat.id}&user=${name.id}&type=${seat.type}&seatcode=${seat.code}&origin=${flight.arrival}&dest=${flight.destination}&depature=${flight.departureDate}&time=${flight.departureTime}&name=${nam}&email=${email}&price=${price}&card=${cardNumber}`,
        });
  
        if (response.ok) {
          const result = await response.text();
          console.log('Response:', result); // Log the response
          if (freeflight){
            try {          
                const response = await fetch(`http://localhost:8080/demo/free/${name.id}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
          
                if (response.ok) {
                  // Update the state to remove the deleted aircraft
                  console.log('Changed freeflight successfully');
                  setName({address:name.address,email:name.email,id:name.id,name:name.name,password:name.password,type:name.type,promo:name.promo,freeflight:false})

                } else {
                  console.error('Request failed with status:', response.status);
                  const result = await response.text();
                  console.error('Response:', result);
                }
              } catch (error) {
                console.error('Error:', error);
          }}
          // Now, try to parse the response as JSON
          closeAddPopup();
          goback();
        } else {
          console.error('Request failed with status:', response.status);
          const result = await response.text();
          console.error('Response:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }finally {
        setIsLoading(false);
    };
}
    const handleTravelInsuranceChange = () => {
        setIsTravelInsuranceChecked(!isTravelInsuranceChecked);
      };
      const handlefreeflightChange = () => {
        setFreeflight(!freeflight);
      };
  useEffect(() => {
    if (flightId !== '') {
        calculateFarePrice(flight,seat.type);
    }
  }, [flight]);
  const goback = () =>{
    if (user !== null) {
    navigate('/', { state: { user: name } }); // Change this to a certain path for handling guest
    }
    else{
    navigate('/');
    }
  }

  return (
    <div>
    <header style={{ background: '#ddd', color: '#001f3f', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <button style={{ background: 'steelblue', fontWeight: 'bold' }} className="app-button" onClick={goback}>
        Main page
      </button>
    </div>
    <h1 style={{ margin: '0' }}>Group 17 Airline</h1>
    <div></div>
  </header>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontWeight:'bold' }}>
     
  
      <div style={{  background: '#f0f0f0', padding: '20px', borderRadius: '10px', margin: '20px', textAlign: 'center', width: '30%' }}>
        <p>Seat Price: ${calculateFarePrice(flight, seat.type)}</p>
        <p>Tax: 15%</p>
        <p>Tax Price: ${(0.15 * calculateFarePrice(flight, seat.type)).toFixed(2)}</p>
        <p>Total: ${(1.15 * calculateFarePrice(flight, seat.type)).toFixed(2)}</p>
        <div>
          <label>
            Travel Insurance:
            <input
              type="checkbox"
              checked={isTravelInsuranceChecked}
              onChange={handleTravelInsuranceChange}
            />
          </label>
        </div>
        <p>Travel Insurance Price: ${(isTravelInsuranceChecked ? 0.05 * calculateFarePrice(flight, seat.type) : 0).toFixed(2)}</p>
        {name.freeflight ?(
        <div>
          <label>
            Use membership free flight:
            <input
              type="checkbox"
              checked={freeflight}
              onChange={handlefreeflightChange}
            />
          </label>
        </div>):(<></>)}
        <p>Total: ${(freeflight? 0: ((isTravelInsuranceChecked ? 0.05 * calculateFarePrice(flight, seat.type) : 0) + (1.15 * calculateFarePrice(flight, seat.type))).toFixed(2))}</p>
        <button className="app-button" style={{background:'steelblue', fontWeight:'bold'}} onClick={PayPopup}>
          Pay
        </button>
        {isAddPopupVisible && (
         <div className="modal-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}>
         <div className="add-aircraft-modal" style={{ background: '#fff', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
           <h3 style={{ marginBottom: '20px' }}>Payment Details</h3>
           <label style={{ display: 'block', marginBottom: '10px' }}>
             Credit Card #: &nbsp;
             <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
           </label>
           <br />
           <label style={{ display: 'block', marginBottom: '10px' }}>
             Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             <input type="text" value={nam} onChange={(e) => setNam(e.target.value)} />
           </label>
           <br />
           <label style={{ display: 'block', marginBottom: '20px' }}>
             Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
           </label>
           <button style={{background:'steelblue', fontWeight:'bold'}} className="app-button"  onClick={Pay} disabled={isLoading}>
             Pay
           </button>
           <button style={{background:'steelblue', fontWeight:'bold'}} className="app-button" onClick={closeAddPopup} disabled={isLoading}>
             Cancel
           </button>
         </div>
       </div>
       
        )}
      </div></div>
    </div>
  );
  
};

export default Payment;