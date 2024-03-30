import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import './CreateAccount.css'; // Import a CSS file for styling (create this file in your project)

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Address, setAddress] = useState('');
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);
  const [userType, setUserType] = useState(0); // Default to Regular Customer
  const [user, setUser] = useState(null);
  const [id, setId] = useState(uuidv4);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate('/', { state: { user: user } });
    }
  }, [user]);
  const handleCreateAccount = async () => {
    try {
      const response = await fetch('http://localhost:8080/demo/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `Id=${id}&name=${name}&email=${email}&password=${password}&Address=${Address}&type=${userType}&Promo=${subscribeToNewsletter}`,
      });

      if (response.ok) {
        const result = await response.text();
        console.log('Response:', result);
        setUser({id:id,type:userType,name:name,email:email,password:password,address:Address,promo:subscribeToNewsletter,freeflight:subscribeToNewsletter});
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
    <div>   <header style={{ background: '#ddd', color: '#001f3f', padding: '10px', textAlign: '', display: 'flex', justifyContent: '', alignItems: '' ,}}>
       
    <div> 
   </div>
   <h1 style={{ margin: '0 auto' ,marginLeft:'500px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Group 17 Airline</h1>
   <div>
  
    
   </div>
 </header> 
    <div className="create-account-container">
      
      <form className="account-form">
      <h2>Create Account</h2>
        <label>
          Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Address:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input value={Address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <br />
        <label>
          Register for membership:
          <input
            type="checkbox"
            checked={subscribeToNewsletter}
            onChange={() => setSubscribeToNewsletter(!subscribeToNewsletter)}
          />
        </label>
        <br />

        <div className="user-type-options">
          <label>
            <input type="radio" name="userType" value={0} checked={userType === 0} onChange={() => setUserType(0)} />
            Regular Customer
          </label>
          <label>
            <input type="radio" name="userType" value={1} checked={userType === 1} onChange={() => setUserType(1)} />
            Flight Attendant or Airline Agent
          </label>
          <label>
            <input type="radio" name="userType" value={2} checked={userType === 2} onChange={() => setUserType(2)} />
            System Admin
          </label>
          <button type="button" onClick={handleCreateAccount} style={{background: 'steelblue', fontWeight:'bold', border:'none', color:'white', height:'30px', borderRadius:'5px' }}>
          Create Account
        </button>
        </div>
      </form>
    </div></div>
  );
};

export default CreateAccount;
