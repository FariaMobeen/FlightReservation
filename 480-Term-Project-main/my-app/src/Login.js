import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css'; // Import a CSS file for styling (create this file in your project)

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate('/', { state: { user: user } });
    }
  }, [user, navigate]);

  const handleCreateAccount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/demo/login?name=${name}&password=${password}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result[0] == null) {
          setError('Invalid username or password. Please try again.');
        } else {
          setUser(result[0]);
          setError(null); // Clear any previous error
          console.log(user);
        }
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
    <div>
      <header
        style={{
          background: '#ddd',
          color: '#001f3f',
          padding: '10px',
          textAlign: '',
          display: 'flex',
          justifyContent: '',
          alignItems: '',
        }}
      >
        <div></div>
        <h1 style={{ margin: '0 auto', marginLeft: '600px' }}>Group 17 Airline</h1>
        <div></div>
      </header>
      <div
        className="create-account-container"
        style={{
          
        }}
      >
        <form
          className="account-form"
          style={{
            background: '#f2f2f2',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <label style={{ marginBottom: '10px', display: 'block' }}>
            Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
            />
          </label>
          <label style={{ marginBottom: '10px', display: 'block' }}>
            Password:&nbsp;&nbsp;&nbsp;
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
            />
          </label>
          <br />
          <button
            type="button"
            onClick={handleCreateAccount}
            style={{
              marginLeft: '120px',
              width: '50px',
              height: '30px',
              background: 'steelblue',
              border: 'none',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
