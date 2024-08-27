import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useLocation } from 'react-router-dom';


export default function NameChange() {
  const [enteredName, setEnteredName] = React.useState('');
  const [enteredSubject, setEnteredSubject] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const location = useLocation();
  const { id } = location.state || {};



  const submitHandler = async (event) => {
    const bodyWithId = JSON.stringify({
      id: id,
      subject: enteredSubject,
      courseName: enteredName,
      students: filledStudents,
      teachers: filledTeachers
    });

    const bodyWithoutId = JSON.stringify({
      subject: enteredSubject,
      courseName: enteredName,
      students: filledStudents,
      teachers: filledTeachers
    });

    let body = bodyWithoutId;
    if (id != null) {
      body = bodyWithId;
    }

    const token = localStorage.getItem('jwtToken');
    event.preventDefault();
    try {
      const response = await fetch('/api/createCourse', {
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
      setData(responseData);
     
      {
        buttonHandler;
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const inputChangeHandler = (identifier, event) => {
    if (identifier === 'courseName') {
      setEnteredName(event);
   
    } else if (identifier === 'subject') {
      setEnteredSubject(event);
    }
  };

  



  useEffect(() => {
    
  }, []);

  return (
    <form onSubmit={submitHandler}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <div>
          
          Zmena údajov
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-subject">Meno</InputLabel>
            <OutlinedInput
              id="outlined-adornment-subject"
              type="text"
              name="inputValue"
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              label="subject"
              value={enteredSubject}
              onChange={(event) => inputChangeHandler('subject', event.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-subject">Priezvisko</InputLabel>
            <OutlinedInput
              id="outlined-adornment-subject"
              type="text"
              name="inputValue"
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              label="subject"
              value={enteredSubject}
              onChange={(event) => inputChangeHandler('subject', event.target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-subject">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-subject"
              type="text"
              name="inputValue"
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              label="subject"
              value={enteredSubject}
              onChange={(event) => inputChangeHandler('subject', event.target.value)}
            />
          </FormControl>
          

         
         
        </div>
      </Box>

      <Button variant="outlined" size="medium" style={{ marginTop: 2 + 'em', marginLeft: 0.6 + 'em' }} type="submit" disableElevation>
        Potvrdiť
      </Button>
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
