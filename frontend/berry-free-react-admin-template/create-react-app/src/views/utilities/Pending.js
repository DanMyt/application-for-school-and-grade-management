import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import { minWidth, width } from '@mui/system';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Pending() {
  const [rows, setRows] = useState([]);
  const [rowsOfDone, setRowsOfDone] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openSecond, setOpenSecond] = React.useState(false);
  const [deleteMail, setDeleteMail] = useState('');

  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    mail: '',
    approvedBy: ''
  });

  const columns = [
    {
      field: 'firstName',
      headerName: 'Meno',
      flex: 1,
      minWidth: 100,
      editable: false
    },
    {
      field: 'lastName',
      headerName: 'Priezvisko',
      flex: 1,
      minWidth: 130,
      editable: false
    },
    {
      field: 'mail',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcie',
      flex: 1,
      minWidth: 80,
      cellClassName: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<HowToRegOutlinedIcon />}
          label="Edit"
          onClick={() => handleClickOpenSecond(params.row.firstName, params.row.lastName, params.row.mail, params.row.approvedBy)}
          color="inherit"
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleClickOpen(params.row.mail)}
          color="inherit"
        />
      ]
    }
  ];

  const columnsApproved = [
    {
      field: 'firstName',
      headerName: 'Meno',
      flex: 1,
      minWidth: 100,
      editable: false
    },
    {
      field: 'lastName',
      headerName: 'Priezvisko',
      flex: 1,
      minWidth: 130,
      editable: false
    },
    {
      field: 'mail',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      editable: false
    },
    {
      field: 'approvedBy',
      headerName: 'Schválil',
      flex: 1,
      minWidth: 180,
      editable: false
    }
  ];

  const handleClose = () => {
    setOpen(false);
    setDeleteMail('');
  };

  const handleClickOpen = (mail) => {
    setDeleteMail(mail);
    setOpen(true);
  };

  const handleClickOpenSecond = (firstName, lastName, mail, approvedBy) => {
    setUserInfo({
      firstName,
      lastName,
      mail,
      approvedBy
    });
    setOpenSecond(true);
  };

  const handleCloseSecond = () => {
    setOpenSecond(false);
  };

  const notApproved = (mail) => {
    const token = localStorage.getItem('jwtToken');
    const body = JSON.stringify({
      mail: mail
    });
    fetch('/api/pending/notApproved', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }

        return res.json();
      })
      .then((data) => {
      
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteRequest = (mail) => {
    const token = localStorage.getItem('jwtToken');
    const body = JSON.stringify({
      mail: mail
    });
    fetch('/api/pending/delete', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        rowsHandler();
        handleClose();
        return res.json();
      })
      .then((data) => {
        rowsHandler();
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const approve = (firstName, lastName, mail, approvedBy) => {
    const token = localStorage.getItem('jwtToken');
    const body = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      mail: mail,
      approvedBy: approvedBy
    });
    fetch('/api/pending/approve', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }

        return res.json();
      })
      .then((data) => {
       
        rowsHandler();
        handleCloseSecond();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const rowsHandler = () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/pending/getAll', {
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
      
        const submitted = data.filter((item) => item.approvedBy !== null);
        const unsubmitted = data.filter((item) => item.approvedBy === null);
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
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        <Box
          sx={{
            height: 500,
            width: { xs: '100%', sm: '50%', md: 'calc(50% - 16px)'  }, 
            
            mb: { xs: 7, sm: 0 }, 
            mr: { md: 1 }
            
          }}
        >
          <h3>Neschválené</h3>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                pageSize: 7
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
          <h3>Schválené</h3>
          <DataGrid
            rows={rowsOfDone}
            columns={columnsApproved}
            initialState={{
              pagination: {
                pageSize: 7
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

      {open && (
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Naozaj si prajete odstrániť túto žiadosť?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Po odstráneni žiadosti už nebude možné tieto zmeny vrátit späť.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Nie</Button>
            <Button onClick={() => deleteRequest(deleteMail)}>Áno</Button>
          </DialogActions>
        </Dialog>
      )}

      {openSecond && (
        <Dialog
          open={openSecond}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Naozaj si prajete povoliť tomuto používateľovi prístup do systému?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSecond}>Nie</Button>
            <Button onClick={() => approve(userInfo.firstName, userInfo.lastName, userInfo.mail, userInfo.approvedBy)}>Áno</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
