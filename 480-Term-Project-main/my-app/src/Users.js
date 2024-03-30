import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Aircrafts.css'; // Add a CSS file for styling (create this file in your project)
import { v4 as uuidv4 } from "uuid";

const Users = () => {
  const [accounts, setAccounts] = useState([]);
  const location = useLocation();
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [emailbody, setEmailbody] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch flights from the Spring Boot backend
    getAccounts();
  }, []); // Include variables in the dependency array

  const [name, setName] = useState([]);
  const user = location.state?.user ?? null;

  useEffect(() => {
    if (user !== null) {
      setName(user);
      console.log(user); // Use user directly here
    }
  }, [user]);

  const deleteAccount = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/demo/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the state to remove the deleted aircraft
        setAccounts(accounts.filter((acount => acount.id !== id)));
        console.log('Account deleted successfully');
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


 
  const getAccounts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/demo/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Assuming the response is in JSON format
        },
      });
      if (response.ok) {
        const result = await response.json(); // Parse the response as JSON
        setAccounts(result); // Update the state with the fetched data
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
  const popup = () => {
    setIsAddPopupVisible(true);
  };

  const closeAddPopup = () => {
    setIsAddPopupVisible(false);
  };
  const [isLoading, setIsLoading] = useState(false);

  const sendmail = async() =>{
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/demo/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `newsbody=${emailbody}`,
      });

      if (response.ok) {
        const result = await response.text();
        console.log('Response:', result); // Log the response
        // Now, try to parse the response as JSON
        closeAddPopup();
      } else {
        console.error('Request failed with status:', response.status);
        const result = await response.text();
        console.error('Response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    finally{
      setIsLoading(false);
    }
  }
  return (
    <>
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
        <h2>Accounts List</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {accounts.map((account) => (
            <li
              key={account.id}
              style={{
                width: '20%',
                marginBottom: '10px',
                border: '1px solid #ddd', // Add border style
                borderRadius: '5px', // Add border-radius for rounded corners
                padding: '10px', // Add padding for better spacing
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {account.name} : {account.type}  Membership : {!account.promo?(<>Nonmember</>):(<>Member</>)}
              <button className="app-button"style={{background: 'steelblue', fontWeight:'bold'  }}  onClick={() => deleteAccount(account.id)}>
                Delete account
              </button>
            </li>
          ))}
        </ul>
        <button className="app-button" style={{background: '#001f3f', fontWeight:'bold'  }} onClick={popup}>
          Send News Mail to Members
        </button>
      </div>
    </div>
  

  {isAddPopupVisible && (
    <div className="modal-overlay">
  <div className="add-aircraft-modal">
    <h3>Send News Mail</h3>
    <label>
      News:&nbsp;
      <textarea value={emailbody} onChange={(e) => setEmailbody(e.target.value)} />
    </label>
    <br/><br/>
    <button className="app-button" style={{background: 'steelblue', fontWeight:'bold'  }}  onClick={sendmail} disabled={isLoading}>
      Send
    </button>
    
    <button className="app-button" style={{background: 'steelblue', fontWeight:'bold'  }}  onClick={closeAddPopup} disabled={isLoading}>
      Cancel
    </button>
  </div>
</div>

  )}
  </>
  );
};

export default Users;