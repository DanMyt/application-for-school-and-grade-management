import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import GradingIcon from '@mui/icons-material/Grading';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { minWidth } from '@mui/system';

export default function CoursesAssigements() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
 
  const redirectToGradingSystem = (id) => {
 
    navigate('/utils/util-submittedDetail', { state: { id } });
  };


  const columns = [
   
    {
      field: 'courseName',
      headerName: 'Názov kurzu',
      flex: 1,
      minWidth: 200,
      editable: false
    },
    {
      field: 'subject',
      headerName: 'Predmet',
      flex: 1,
      minWidth: 200,
      editable: false
    },
    {
      field: 'ulohy',
      type: 'actions',
      headerName: 'Úlohy',
      flex: 1,
      minWidth: 200,
      cellClassName: 'ulohy',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={`ulohy-${id}`}
            icon={<GradingIcon />}
            label="Delete"
            onClick={() => redirectToGradingSystem(id)}
            color="inherit"
          />
        ];
      }
    }
  ];

  const rowsHandler = () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/courses', {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    rowsHandler();
  }, []);

  return (
    <>
      
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
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
            console.log(ids);
          }}
        />
      </Box>
    </>
  );
}
