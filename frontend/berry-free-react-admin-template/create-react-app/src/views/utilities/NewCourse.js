import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';
import '../../css/xlsxInput.css';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';


export default function NewCourse() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [enteredName, setEnteredName] = React.useState('');
  const [enteredSubject, setEnteredSubject] = React.useState('');
  const [filledStudents, setFilledStudents] = React.useState([]);
  const [filledTeachers, setFilledTeachers] = React.useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openErrorSnackbarTeacher, setOpenErrorSnackbarTeacher] = useState(false);
  const [notFoundStudents, setNotFoundStudents] = useState([]);
  const [notFoundTeachers, setNotFoundTeachers] = useState([]);
  const location = useLocation();
  const { id } = location.state || {};

  const buttonBack = () => {
    navigate('/utils/util-courses');
  };


  const handleSudentFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }


    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonArr = XLSX.utils.sheet_to_json(worksheet);
      const notFoundStudents1 = [];
      const enteredStudents = jsonArr
        .filter((record) => record.mail)
        .map((record) => {
          const foundStudent = students.find((s) => s.mail === record.mail);
          if (!foundStudent) {
            notFoundStudents1.push(record);
          }
          return foundStudent;
        })
        .filter(s => s);
      
      setNotFoundStudents(notFoundStudents1);
      setFilledStudents(enteredStudents);
    };

    fileReader.readAsBinaryString(file);
    event.target.value = '';
  };

  
  const handleTeacherFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected for teachers.");
      return;
    }
    console.log("Selected file for teachers:", file.name);

    const fileReader = new FileReader();
    fileReader.onerror = (error) => {
      console.error("Error reading teacher file:", error);
    };

    fileReader.onload = (e) => {
      console.log("File loaded, processing teacher data.");
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonArr = XLSX.utils.sheet_to_json(worksheet);
      const notFoundTeachers1 = [];
      const enteredTeachers = jsonArr
        .filter((record) => record.mail) 
        .map((record) => {
          const foundTeacher = teachers.find((s) => s.email === record.mail);
          if (!foundTeacher) {
            notFoundTeachers1.push(record);
          }
          return foundTeacher;
        })
        .filter(s => s); 

      setNotFoundTeachers(notFoundTeachers1);
      setFilledTeachers(enteredTeachers);
    };

    fileReader.readAsBinaryString(file);
    event.target.value = ''; // Reset file input
};



  useEffect(() => {
    if (notFoundStudents.length > 0) {
    
      setOpenErrorSnackbar(true);
    }
  }, [notFoundStudents]);

  useEffect(() => {
    if (notFoundTeachers.length > 0) {
     
      setOpenErrorSnackbarTeacher(true);
    }
  }, [notFoundTeachers]);



  
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
      buttonHandler();
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

  const handleStudentAutocompleteChange = (event, newValue) => {
    setFilledStudents(newValue);
  };

  const handleTeacherAutocompleteChange = (event, newValue) => {
    setFilledTeachers(newValue);
  };

  const findCourseById = async () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/courses/content/' + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
      
        if (!res.ok) {
          throw new Error('Response not OK');
        }
        return res.json();
      })
      .then((data) => {
        setEnteredName(data.courseName)
        setEnteredSubject(data.subject)
        setFilledStudents(data.students)
        setFilledTeachers(data.teachers)
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  

  const studentsHandler = async () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/students', {
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
        setStudents(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const teachersHandler = async () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/teachers/teachers', {
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
        setTeachers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const manageStates = () => {
    setOpenErrorSnackbar(false);
   
    setNotFoundStudents([]);
  }

  useEffect(() => {
    studentsHandler();
    teachersHandler();
    if (id != null) {
      findCourseById();
    }
  }, []);

  return (
    <div>
     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button onClick={buttonBack} startIcon={<ArrowBackIcon />}>
        Späť
      </Button>
    </div>
    
    <form onSubmit={submitHandler}>
     
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <div>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-courseName">Názov kurzu</InputLabel>
            <OutlinedInput
              id="outlined-adornment-courseName"
              type="text"
              name="inputValue"
              label="courseName"
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              value={enteredName}
              onChange={(event) => inputChangeHandler('courseName', event.target.value)}
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-subject">Predmet</InputLabel>
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

          <input
            type="button"
            className="upload-button"
            id="loadFileXml"
            value="Načítaj študentov"
            onClick={() => document.getElementById('studentFileUpload')?.click()}
          />
          <Tooltip title="Je potrebné nahrat xls súbor s 1 stĺpcom: mail">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
          <input
            type="file"
            name="files"
            onChange={handleSudentFileUpload}
            id="studentFileUpload"
            accept=".xls,.xlsx"
            style={{ display: 'none' }}
          />

          <Autocomplete
            fullWidth
            sx={{ m: 1 }}
            multiple
            limitTags={2}
            id="multiple-limit-tags"
            options={students}
            value={filledStudents}
            getOptionLabel={(option) => option.mail}
            onChange={handleStudentAutocompleteChange}
            isOptionEqualToValue={(var1, var2) => var1.mail == var2.mail}
            renderInput={(params) => <TextField {...params} label="Študenti" placeholder="Favorites" />}
          />

          <input
            type="button"
            className="upload-button"
            id="loadFileXml"
            value="Načítaj učiteľov"
            onClick={() => document.getElementById('teacherFileUpload')?.click()}
          />
           <Tooltip title="Je potrebné nahrat xls súbor s 1 stĺpcom: email">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
          <input
            type="file"
            name="files"
            onChange={handleTeacherFileUpload}
            id="teacherFileUpload"
            accept=".xls,.xlsx"
            style={{ display: 'none' }}
          />
          <Autocomplete
            fullWidth
            sx={{ m: 1 }}
            multiple
            limitTags={2}
            id="multiple-limit-tags2"
            options={teachers}
            value={filledTeachers}
            getOptionLabel={(option) => option.email}
            onChange={handleTeacherAutocompleteChange}
            isOptionEqualToValue={(var1, var2) => var1.email == var2.email}
            renderInput={(params) => <TextField {...params} label="Učitelia" placeholder="Favorites" />}
          />
        </div>
      </Box>

      <Button variant="contained" color="primary" size="medium" style={{ marginTop: 2 + 'em', marginLeft: 0.6 + 'em' }} type="submit" disableElevation>
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
            Dáta boli úspešne uložené.
          </Alert>
        </Snackbar>
      )}
       {openErrorSnackbar && (
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={6000}
          onClose={() => manageStates()}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => manageStates()} severity="error" sx={{ width: '100%' }}>
            Týchto študentov sa nepodarilo nájsť: {
              notFoundStudents
              .map(s => s.mail)
              .join(", ")
            }
          </Alert>
          
        </Snackbar>
      )}
      {openErrorSnackbarTeacher && (
        <Snackbar
          open={openErrorSnackbarTeacher}
          autoHideDuration={6000}
          onClose={() => setOpenErrorSnackbarTeacher(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setOpenErrorSnackbarTeacher(false)} severity="error" sx={{ width: '100%' }}>
            Týchto učiteľov sa nepodarilo nájsť: {
              notFoundTeachers
              .map(t => t.mail)
              .join(", ")
            }
          </Alert>
          
        </Snackbar>
      )}
     
    </form>
    </div>
  );
}