import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';

const NewAssigment = (props) => {
  const navigate = useNavigate();
  const [assigmentName, setAssigmentName] = useState('');
  const { id, columnsHandler, setShowNewAssignment, assigment, setAssigment } = props;
  const [maxPoints, setMaxPoints] = useState(0);
  const [popis, setPopis] = useState('');
  const [show, setShow] = React.useState('dontshow');
  const [valueEnd, setValueEnd] = React.useState(null);

  const handleChange = (event, newAlignment) => {
    setShow(newAlignment);
  };

  const inputChangeHandler = (identifier, event) => {
    if (identifier === 'assigmentName') {
      setAssigmentName(event);
   
    } else if (identifier === 'maxPoints') {
      setMaxPoints(event);
    } else if (identifier === 'popis') {
      setPopis(event);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    var uploading = show === 'show' ? true : false;
    let body;
    if (assigment) {
      body = JSON.stringify({
        id: assigment.id,
        name: assigmentName,
        maxPoints: maxPoints,
        courseId: id,
        description: popis,
        withFileUploading: uploading,
        deadline: valueEnd
      })
    } else {
      body = JSON.stringify({
        name: assigmentName,
        maxPoints: maxPoints,
        courseId: id,
        description: popis,
        withFileUploading: uploading,
        deadline: valueEnd
      })
    }
    
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/api/createAssigment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        columnsHandler();
        setShowNewAssignment(false);
        setAssigment(null);
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const deleteAssigment = () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = fetch('/api/removeAssigment/' + assigment.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (!response.ok) {
        console.log('Sth went wrong');
      }
      columnsHandler();
      const data = response.json();
      
    } catch (error) {
      console.log('error');
    }
  }

  useEffect(() => {
    if (assigment != null) {
      setPopis(assigment.description);
      setAssigmentName(assigment.name);
      setMaxPoints(assigment.maxPoints);
      setValueEnd(dayjs(assigment.deadline));
      if (assigment.withFileUploading) {
        setShow('show');
      } else {
        setShow('dontshow');
      }
    }
  }, [assigment]);

  return (
    <form onSubmit={submitHandler}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Názov zadania/testu"
        type="text"
        value={assigmentName}
        onChange={(event) => inputChangeHandler('assigmentName', event.target.value)}
        margin="normal"
        fullWidth
      />
  
      <TextField
        label="Maximálny počet bodov"
        type="number"
        value={maxPoints}
        onChange={(event) => inputChangeHandler('maxPoints', event.target.value)}
        margin="normal"
        fullWidth
        InputProps={{
          inputProps: { min: 0 },
        }}
      />
  
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={show}
          onChange={handleChange}
        >
          <FormControlLabel value="show" control={<Radio />} label="S priestorom na odovzdávku" />
          <FormControlLabel value="dontshow" control={<Radio />} label="Bez priestoru na odovzdávku" />
        </RadioGroup>
      </FormControl>
  
      {show === 'show' && (
        <>
          <TextField
            label="Popis zadania"
            placeholder="Zadajte popis zadania..."
            multiline
            rows={4}
            value={popis}
            onChange={(event) => inputChangeHandler('popis', event.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
  
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Dátum odovzdávky"
              value={valueEnd}
              onChange={setValueEnd}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </>
      )}
  
      <Button
        variant="contained"
        color="primary"
        size="large"
        type="submit"
        disableElevation
      >
        Potvrdiť
      </Button>
      {assigment && <Button
        variant="outlined"
        color="error" // Red color
        size="large"
        type="submit"
        onClick={deleteAssigment}
        disableElevation
      >
        Odstrániť zadanie
      </Button>}

    </Box>
  </form>
  
  );
};

export default NewAssigment;
