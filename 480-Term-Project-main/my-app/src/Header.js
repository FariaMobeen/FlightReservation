// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Login button clicked');
    navigate('/Login');
  };

  const handleCreateAccount = () => {
    navigate('/createAccount');
  };

  return (
    <header style={{ background: '#ddd', color: '#001f3f', padding: '10px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ margin: '0 auto' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Group 17 Airline</h1>
      <div>
        <button className="app-button" onClick={handleLogin} style={{ background: '#001f3f' }}>
          Login
        </button>
        <button className="app-button" onClick={handleCreateAccount} style={{ background: '#001f3f' }}>
          Create Account
        </button>
      </div>
    </header>
  );
};

export default Header;
