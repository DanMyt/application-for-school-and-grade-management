import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';

const ResponsiveBox = styled(Box)({
  height: 'auto',
  padding: '20px',
  margin: '0 auto',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  backgroundColor: '#fff',
  width: '100%', 
  '@media (min-width: 768px)': {
    width: '90%' 
  },
  '@media (min-width: 1024px)': {
    width: '70%' 
  }
});

export default function FileDetail() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { studentId, assigementId, assigementName, id } = location.state || {};
  const [rating, setRating] = useState('');
  const navigate = useNavigate();

  const containerStyle = {
    backgroundColor: '#f0f0f0', // Light grey background
    borderRadius: '8px' // Rounded corners
  };

  const linkStyle = {
    color: '#0066cc', // Blue color for the link
    fontWeight: 'bold' // Bold font for emphasis
  };

  const iconStyle = {
    marginRight: '5px' // Space between icon and text
  };

  const handleChange = (event) => {
    setRating(event.target.value);
  };

  const sendGradeToBackend = () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = fetch('/api/addGrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          assigmentId: assigementId,
          studentId: studentId,
          grade: rating
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const sendMail = async (event) => {
    const token = localStorage.getItem('jwtToken');
    event.preventDefault();
    try {
      const response = await fetch('/api/templates/sendEmailToStudent', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: studentId,
          mailText: message
        })
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

  const getFile = () => {
    const token = localStorage.getItem('jwtToken');
  
    fetch('/api/getFileByStudent/' + assigementId + '/' + studentId, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }

        return res.json();
      })
      .then((data) => {
       
        setFile({
          fileName: data.fileName,
          fileUrl: `data:application/octet-stream;base64,${btoa(String.fromCharCode(...new Uint8Array(data.uploadedFile)))}`
        });
      })
      .catch((err) => {
        console.error('Error fetching file:', err);
      });
  };

  const inputChangeHandler = (identifier, event) => {
    if (identifier === 'message') {
      setMessage(event);
    }
  };

  const buttonBack = () => {
  
    navigate('/utils/util-submittedDetail', { state: { id } });
  };

  useEffect(() => {
    if (studentId && assigementId) {
     
      getFile();
    }
  }, [studentId, assigementId]);

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={buttonBack} startIcon={<ArrowBackIcon />}>
            Späť
          </Button>
        </div>
       <ResponsiveBox>
          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333', fontSize: '24px' }}>
            {assigementName}
          </h2>

          {file && (
            <div style={{ ...containerStyle, marginBottom: '20px' }}>
              <a
                href={file.fileUrl}
                download={file.fileName}
                style={{ ...linkStyle, textDecoration: 'none', color: '#1a76d2', fontWeight: 'bold' }}
              >
                <i className="fas fa-download" style={{ ...iconStyle, marginRight: '10px' }}></i>
                Vypracovanie na stiahnutie: {file.fileName}
              </a>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <TextField
              id="outlined-number"
              label="Hodnotenie"
              type="number"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              style={{ flexGrow: 1, marginRight: '10px' }}
              value={rating}
              onChange={handleChange}
            />
            <Button style={{ flexShrink: 0, textTransform: 'none' }} onClick={sendGradeToBackend} variant="contained" color="primary" size="medium">
              Odoslať hodnotenie
            </Button>
          </div>

          <TextareaAutosize
            id="outlined-adornment-courseName"
            name="inputValue"
            aria-label="empty textarea"
            placeholder="Správa pre študenta"
            style={{
              width: '100%',
              padding: '18.5px 14px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '16px',
              lineHeight: '1.5',
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
            }}
            value={message}
            onChange={(event) => inputChangeHandler('message', event.target.value)}
            minRows={3}
          />

          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={sendMail}
            style={{ marginTop: '20px', display: 'block', width: '100%', textTransform: 'none' }}
          >
            Odoslať študentovi správu
          </Button>
          </ResponsiveBox>

        {openSnackbar && (
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
              Email bol úspešne odoslaný.
            </Alert>
          </Snackbar>
        )}
      </div>
    </>
  );
}
