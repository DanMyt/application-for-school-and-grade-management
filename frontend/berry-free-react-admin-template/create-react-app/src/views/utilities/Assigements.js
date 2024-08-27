import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { GridActionsCellItem } from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useLocation } from 'react-router-dom';
import { minWidth } from '@mui/system';

export default function Assigements() {
  const [rows, setRows] = useState([]);
  const [rowsOfDone, setRowsOfDone] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  const redirectToUploadAssigment = (assigementId, name, description, uploadedFileId, deadline) => {
    navigate('/utils/util-uploadAssigment', { state: { assigementId, name, description, uploadedFileId, id, deadline } });
  };

  const buttonBack = () => {
    navigate('/utils/util-mojeUlohy');
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Názov zadania/úlohy',
      flex: 1,
      minWidth: 200,
      editable: false
    },
    {
      field: 'detail',
      type: 'actions',
      headerName: 'Detail',
      flex: 1,
      minWidth: 80,
      cellClassName: 'detail',
      getActions: (params) => {
        return [
          <GridActionsCellItem
            key={`assignment-${params.id}`}
            icon={<FormatListBulletedIcon />}
            label="Upload"
            onClick={() =>
              redirectToUploadAssigment(params.row.assigementId, params.row.name, params.row.description, params.row.uploadedFileId, params.row.deadline)
            }
            color="inherit"
          />
        ];
      }
    }
  ];

  const rowsHandler = () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/getAssigementsFiles/' + id, {
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
     

        const submitted = data.filter((item) => item.uploadedFileId !== null);
        const unsubmitted = data.filter((item) => item.uploadedFileId === null);
        setRowsOfDone(submitted);
        setRows(unsubmitted);
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={buttonBack} startIcon={<ArrowBackIcon />}>
          Späť
        </Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
      <Box
          sx={{
            height: 500,
            width: { xs: '100%', sm: '50%', md: 'calc(50% - 16px)'  },
            mb: { xs: 7, sm: 0 },
            mr: { md: 1 }
            
          }}
        >
          <h3>Neodovzdané</h3>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7
                }
              }
            }}
            pageSizeOptions={[7]}
            disableRowSelectionOnClick
            onRowSelectionModelChange={(ids) => {
              console.log(ids);
            }}
          />
        </Box>
        <Box
          sx={{
            height: 500,
            width: { xs: '100%', sm: '50%' } 
          }}
        >
          <h3>Odovzdané</h3>
          <DataGrid
            rows={rowsOfDone}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7
                }
              }
            }}
            pageSizeOptions={[7]}
            disableRowSelectionOnClick
            onRowSelectionModelChange={(ids) => {
              console.log(ids);
            }}
          />
        </Box>
      </div>
    </>
  );
}
