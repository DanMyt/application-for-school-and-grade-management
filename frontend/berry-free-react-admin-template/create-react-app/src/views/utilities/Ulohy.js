import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import NewAssigment from './NewAssigment';
import { useLocation } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function Ulohy() {
  const [rows, setRows] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showTeacherPart, setShowTeacherPart] = useState(true);
  const [filledTemplate, setFilledTemplate] = useState(null);
  const [autoCompleteAssigements, setAutoCompleteAssigements] = useState([]);
  const location = useLocation();
  const [assigments, setAssigments] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const { id } = location.state || {};

  const buttonHandler = () => {
    setShowNewAssignment(!showNewAssignment);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'Meno', width: 150 },
    {
      field: 'lastName',
      headerName: 'Priezvisko',
      width: 150,
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
      const assigmentsIds = autoCompleteAssigements.map(assignment => assignment.id);
      const response = await fetch('/api/templates/sendInfoForEmail', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: filledTemplate.id,
          assigementsIds: assigmentsIds,
          studentsIds: selectedStudentIds,
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


  const handleTemplateAutocompleteChange = (event, newValue) => {
    setFilledTemplate(newValue);
  };

  const handleAutoCompleteAssigeements = (event, newValue) => {
    setAutoCompleteAssigements(newValue);
  }

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
        data.forEach((assignment) => {
          newCols.push({
            field: 'assignmentGrade.' + assignment.name,
            headerName: assignment.name.charAt(0).toUpperCase() + assignment.name.slice(1),
            width: 150,
            editable: true,
            type: 'number',
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
          url = '/api/gradings/course/student/'
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

  useEffect(() => {
    columnsHandler();
    rowsHandler();
    if (localStorage.getItem('roles') == 'STUDENT') {
      setShowTeacherPart(false);
    }
  }, []);

  return (
    <>
      <Button variant="outlined" size="medium" onClick={buttonHandler} style={{ marginBottom: 2 + 'em' }}>
        Nový test/Zadanie
      </Button>
      {showNewAssignment && <NewAssigment id={id} />}
      <Box sx={{ height: 400, width: '100%' }}>
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
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(ids) => {
            setSelectedRowIds(ids);
            const selectedStudentIds = ids.map(id => {
              const row = rows.find(row => row.id === id);
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
      {showTeacherPart && <Autocomplete
        fullWidth
        sx={{ m: 1 }}
        limitTags={2}
        id="single-limit-tag" 
        options={templates}
        value={filledTemplate}
        getOptionLabel={(option) => option.template} 
        onChange={handleTemplateAutocompleteChange}
        renderInput={(params) => <TextField {...params} label="Dostupné šablóny" placeholder="Favorites" />}
      />}
       {showTeacherPart && <Autocomplete
            fullWidth
            sx={{ m: 1 }}
            multiple
            limitTags={2}
            id="multiple-limit-tags2"
            options={assigments}
            getOptionLabel={(option) => option.name}
            onChange={handleAutoCompleteAssigeements}
            renderInput={(params) => <TextField {...params} label="Zadania/Testy" placeholder="Favorites" />}
          /> }
      { showTeacherPart && <Button onClick={sendMail} variant="outlined" size="medium" type="submit" style={{ marginTop: 2 + 'em' }}>
        Poslať emaily
      </Button> }
    </>
  );
}
