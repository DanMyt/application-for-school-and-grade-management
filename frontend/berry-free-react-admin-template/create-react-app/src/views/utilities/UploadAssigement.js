import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FileUpload from 'react-material-file-upload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import moment from 'moment';


export default function UploadAssigment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assigementId, name, description, uploadedFileId, id, deadline } = location.state || {};
  const formattedDateTime = moment(deadline).format('MMMM DD, YYYY hh:mm A');
  const [files, setFiles] = useState([]);

  const buttonBack = () => {
    navigate('/utils/util-assigement', { state: {id } });
  };

  const uploadFile = async() => {
    try {
      const formData = new FormData();
      if (files.length === 0) {
        formData.append('fileName','');
        formData.append('file', files[0]);
        formData.append('assignmentId',assigementId);
      } else {
        formData.append('file', files[0]);
        formData.append('assignmentId',assigementId);
        formData.append('fileName',files[0].name);
      }
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/api/uploadFile', {
          method: 'POST',
          headers: {

              'Authorization': 'Bearer ' + token,
          },
          body: formData
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
          console.log('File uploaded!');
      } 
  } catch (error) {
      console.error('Error in fetch:', error);
  }
  };

  const getFileFromDatabase = () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/getFile/' + uploadedFileId, {
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
     
        const fileBlob = new Blob([data.fileData], { type: 'application/octet-stream' }); 
        const fileName = data.fileName || 'default_filename';
        const file = new File([fileBlob], fileName, { type: fileBlob.type });
        setFiles([file]); 
      })
      .catch((err) => {
        console.log(err);
      });
  };



  useEffect(() => {
    if (uploadedFileId != null) {
     
      getFileFromDatabase();
      
    }
  }, [uploadedFileId]);

  useEffect(() => {
  
    if(files.length === 0) {
      getFileFromDatabase();
    }
    
    uploadFile();
    
  }, [files]);

  
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={buttonBack} startIcon={<ArrowBackIcon />}>
          Späť
        </Button>
      </div>
      <div style={{ display: 'flex',flexDirection: 'column', width: '100%' }}>
        <h1>{name}</h1>
       
        <h3>Odovzdať do: {formattedDateTime}</h3>
        <TextareaAutosize
          id="outlined-adornment-courseName"
          name="inputValue"
          aria-label="empty textarea"
          placeholder="Popis zadania"
          value={description}
          style={{
            width: '100%',
            padding: '18.5px 14px',
            borderRadius: '4px',
            border: '1px solid #ced4da',
            marginTop: '8px',
            marginBottom: '8px'
          }} 
          
          minRows={7} 
          readOnly={true}
        />        
        <FileUpload buttonText='Nahrať zadanie' title='Do tohto priestoru môžeš odovzdávať zadania' value={files} onChange={setFiles} />
      </div>
    </>
  );
}
