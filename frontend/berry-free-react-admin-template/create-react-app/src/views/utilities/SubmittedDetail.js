import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SubmittedDetail() {
  const [rows, setRows] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);
  const location = useLocation();
  const [assigments, setAssigments] = useState([]);
  const { id } = location.state || {};

  const navigate = useNavigate();

  const buttonBack = () => {
    navigate('/utils/util-coursesAssigements');
  };

  const columns = [
    { field: 'firstName', headerName: 'Meno', flex:1,
    minWidth: 150, editable: false },
    {
      field: 'lastName',
      headerName: 'Priezvisko',
      flex:1,
      minWidth: 150,
      editable: false
    }
  ];

  const redirectToAssigmentDetail = (studentId, assigementId, assigementName) => {
    navigate('/utils/util-fileDetail', { state: { studentId, assigementId, assigementName, id } });
  };

  const columnsHandler = () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/getTestsWithFileUpload/' + id, {
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
            width: 200,
            editable: false,
            type: 'number',
            valueGetter: (params) => params.row.assignmentSubmittedOrNot[assignment.name],
            renderCell: (params) => {
              return (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    redirectToAssigmentDetail(params.row.studentId, assignment.id, assignment.name);
                  }}
                >
                  <Typography
                    style={{
                      color:
                        params.value === 'Odovzdané'
                          ? 'green'
                          : params.value === 'Bez odovzdávky'
                          ? 'red'
                          : params.value === 'Odovzdané neskoro'
                          ? 'orange'
                          : 'inherit'
                    }}


                  >
                    {params.value}
                  </Typography>
                </Button>
              );
            }
          });
        });
        setGridColumns(newCols);
        let url = '/api/getSubmittedOrNot/';

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
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={buttonBack} startIcon={<ArrowBackIcon />}>
          Späť
        </Button>
      </div>
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
          disableRowSelectionOnClick
          onRowSelectionModelChange={(ids) => {
            setSelectedRowIds(ids);
            const selectedStudentIds = ids.map((id) => {
              const row = rows.find((row) => row.id === id);
              return row.studentId;
            });
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
            return newRow;
          }}
        />
      </Box>
    </>
  );
}
