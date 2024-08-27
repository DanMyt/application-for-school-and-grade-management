import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import NewAssigment from './NewAssigment';
import { useLocation } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

export default function Grade() {
  const [rows, setRows] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showTeacherPart, setShowTeacherPart] = useState(true);
  const [filledTemplate, setFilledTemplate] = useState(null);
  const [autoCompleteAssigements, setAutoCompleteAssigements] = useState([]);
  const location = useLocation();
  const [assigments, setAssigments] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const { id } = location.state || {};
  const [assigment, setAssigment] = useState(null);
  const navigate = useNavigate();

  const buttonHandler = () => {
    setShowNewAssignment(!showNewAssignment);
    setAssigment(null);
  };

  const buttonBack = () => {
    const roles = localStorage.getItem('roles');
    if (roles == 'STUDENT') {
      navigate('/utils/util-studentCourses');
    } else {
      navigate('/utils/util-courses');
    }
  };

  const columns = [
    { field: 'firstName', headerName: 'Meno', width: 150 },
    {
      field: 'lastName',
      headerName: 'Priezvisko',
      width: 120,
      editable: false
    }
  ];

  const sendGradeToBackend = (payLoad) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = fetch('/api/addGrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          assigmentId: payLoad.assigmentId,
          studentId: payLoad.studentId,
          grade: payLoad.grade
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const rowsHandler = () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/templates/allTemplates', {
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
        setTemplates(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendMail = async (event) => {
    const token = localStorage.getItem('jwtToken');
    event.preventDefault();
    try {
      const assigmentsIds = autoCompleteAssigements.map((assignment) => assignment.id);
      const response = await fetch('/api/templates/sendInfoForEmail', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: filledTemplate.id,
          assigementsIds: assigmentsIds,
          studentsIds: selectedStudentIds
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

  const handleEditClick = (params, assigment) => {
    setAssigment(assigment);
    setShowNewAssignment(true);
  }

  const handleTemplateAutocompleteChange = (event, newValue) => {
    setFilledTemplate(newValue);
  };

  const handleAutoCompleteAssigeements = (event, newValue) => {
    setAutoCompleteAssigements(newValue);
  };

  useEffect(() => {
    columnsHandler();
    rowsHandler();
    if (localStorage.getItem('roles') == 'STUDENT') {
      setShowTeacherPart(false);
    }
  }, []);

  const columnsHandler = () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/testsandassigments/' + id, {
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
        setAssigments(data);
        const newCols = [...columns];
        if (localStorage.getItem('roles') == 'STUDENT') {
          setShowTeacherPart(false);
        }
        const roles2 = localStorage.getItem('roles');
        const showTeacherPartFlag = roles2 !== 'STUDENT';
        
        data.forEach((assignment) => {
          
          newCols.push({
            field: 'assignmentGrade.' + assignment.name,
            headerName: assignment.name.charAt(0).toUpperCase() + assignment.name.slice(1),
            width: 200,
            editable: showTeacherPart,
            type: 'number',
            renderHeader: (params) => (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{params.colDef.headerName}</span>
                {showTeacherPartFlag && (
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={() => handleEditClick(params, assignment)} 
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </div>
            ),
            valueGetter: (params) => {
              return params.row.assignmentGrade[assignment.name];
            },
            valueSetter: (params) => {
              const row = JSON.parse(JSON.stringify(params.row));
              row.assignmentGrade[assignment.name] = params.value;
              return row;
            }
          });
        });
        setGridColumns(newCols);

        const roles = localStorage.getItem('roles');
        let url = '/api/gradings/course/';
        if (roles == 'STUDENT') {
          
          url = '/api/gradings/course/student/';
        }

        fetch(url + id, {
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
            
            setRows(data);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

 

  return (
    <>
      { showTeacherPart && <div style={{display:"flex", justifyContent:"space-between"}}>
        {showTeacherPart && (
          <Button variant="outlined" size="medium" onClick={buttonHandler} style={{ textTransform: 'none'}}>
            Nový test/Zadanie
          </Button>
        )}
        <div>
          <Button onClick={buttonBack} startIcon={<ArrowBackIcon />}>
            Späť
          </Button>
        </div>
      </div>}
      {!showTeacherPart && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={buttonBack} startIcon={<ArrowBackIcon />}>
            Späť
          </Button>
        </div>}
      {showNewAssignment && <NewAssigment id={id} columnsHandler={columnsHandler} setShowNewAssignment={setShowNewAssignment} assigment={assigment} setAssigment={setAssigment} />}
      <Box sx={{ height: 400, width: '100%', marginTop:"2em" }}>
        <DataGrid
          rows={rows}
          columns={gridColumns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          pageSizeOptions={[5]}
          checkboxSelection={showTeacherPart}
          disableRowSelectionOnClick
          onRowSelectionModelChange={(ids) => {
            setSelectedRowIds(ids);
            const selectedStudentIds = ids.map((id) => {
              const row = rows.find((row) => row.id === id);
              return row.studentId;
            });
            setSelectedStudentIds(selectedStudentIds);
          }}
          processRowUpdate={(newRow, oldRow) => {
           
            let assigmentName;
            let newVal;

            Object.keys(oldRow.assignmentGrade).forEach((keyName) => {
              const oldValue = oldRow.assignmentGrade[keyName];
              const newValue = newRow.assignmentGrade[keyName];
              if (oldValue != newValue) {
                newVal = newValue;
                assigmentName = keyName;
              }
            });

            if (!assigmentName) {
              return oldRow;
            }

            const assigmentId = assigments.find((a) => a.name == assigmentName)?.id;
            if (!assigmentId) {
              return oldRow;
            }

            const payLoad = { assigmentId: assigmentId, studentId: newRow.studentId, grade: newVal };
            sendGradeToBackend(payLoad);

            return newRow;
          }}
        />
      </Box>
      {showTeacherPart && (
        <Autocomplete
          fullWidth
          sx={{ m: 1 }}
          limitTags={2}
          id="single-limit-tag" 
          options={templates}
          value={filledTemplate}
          getOptionLabel={(option) => option.template} 
          onChange={handleTemplateAutocompleteChange}
          renderInput={(params) => <TextField {...params} label="Dostupné šablóny" placeholder="Favorites" />}
        />
      )}
      {showTeacherPart && (
        <Autocomplete
          fullWidth
          sx={{ m: 1 }}
          multiple
          limitTags={2}
          id="multiple-limit-tags2"
          options={assigments}
          getOptionLabel={(option) => option.name}
          onChange={handleAutoCompleteAssigeements}
          renderInput={(params) => <TextField {...params} label="Zadania/Testy" placeholder="Favorites" />}
        />
      )}
      {showTeacherPart && (
        <Button onClick={sendMail} variant="contained" size="medium" type="submit" style={{ marginTop: 0.5 + 'em', marginLeft: 0.8 + 'em', textTransform: 'none' }}>
          Poslať emaily
        </Button>
      )}
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            Emaily boli úspešne odoslané.
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
