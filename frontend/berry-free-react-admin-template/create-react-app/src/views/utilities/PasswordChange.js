import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useLocation } from 'react-router-dom';

export default function PasswordChange() {
  const [enteredOldPassword, setEnteredOldPassword] = React.useState('');
  const [enteredNewPassword, setEnteredNewPassword] = React.useState('');
  const [enteredNewPasswordAgain, setEnteredNewPasswordAgain] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const location = useLocation();
  const { id } = location.state || {};

  const submitHandler = async (event) => {
    const body = JSON.stringify({
      oldPassword: enteredOldPassword,
      newPassword: enteredNewPassword,
      newPasswordAgain: enteredNewPasswordAgain,
    });

    const token = localStorage.getItem('jwtToken');
    event.preventDefault();
    try {
      const response = await fetch('/api/password/passwordChange', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        setOpenSnackbar(true);
      }

      const responseData = await response.json();
   
      
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const inputChangeHandler = (identifier, event) => {
    if (identifier === 'oldPassword') {
      setEnteredOldPassword(event);
    } else if (identifier === 'newPassword') {
      setEnteredNewPassword(event);
    } else if (identifier === 'confirmNewPassword') {
      setEnteredNewPasswordAgain(event);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0 20px 0',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };
  
  const snackbarStyle = {
    visibility: 'visible',
    minWidth: '250px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    textAlign: 'center',
    border: '1px solid #4CAF50',
    padding: '16px',
    position: 'fixed',
    zIndex: '1',
    left: '50%',
    bottom: '30px',
    fontSize: '17px',
    transform: 'translateX(-50%)'
  };


  useEffect(() => {}, []);

  return (
    <form onSubmit={submitHandler} style={{ maxWidth: '450px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
    <h2 style={{ textAlign: 'center', color: '#333' }}>Zmena hesla</h2>
  
    <div style={{ marginBottom: '1em' }}>
      <label htmlFor="old-password" style={{ display: 'block', marginBottom: '.5em' }}>Staré heslo</label>
      <input id="old-password" type="password" name="oldPassword" placeholder="Zadajte staré heslo" style={inputStyle} onChange={(event) => inputChangeHandler('oldPassword', event.target.value)} required />
    </div>
  
    <div style={{ marginBottom: '1em' }}>
      <label htmlFor="new-password" style={{ display: 'block', marginBottom: '.5em' }}>Nové heslo</label>
      <input id="new-password" type="password" name="newPassword" placeholder="Zadajte nové heslo" style={inputStyle} onChange={(event) => inputChangeHandler('newPassword', event.target.value)} required />
    </div>
  
    <div style={{ marginBottom: '1em' }}>
      <label htmlFor="confirm-password" style={{ display: 'block', marginBottom: '.5em' }}>Zopakuj nové heslo</label>
      <input id="confirm-password" type="password" name="confirmNewPassword" placeholder="Zopakujte nové heslo" style={inputStyle} onChange={(event) => inputChangeHandler('confirmNewPassword', event.target.value)} required />
    </div>
  
    <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#1976D2', color: 'white', fontSize: '16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
      Potvrdiť
    </button>
  
    {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            Operácia prebehla úspešne.
          </Alert>
        </Snackbar>
         )}
  </form>
  
  );
}
