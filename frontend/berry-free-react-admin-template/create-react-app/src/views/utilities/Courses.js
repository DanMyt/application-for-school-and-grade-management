import React, { useState, useCallback, useMemo  } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import GradingIcon from '@mui/icons-material/Grading';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';




const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Courses() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const rowsHandler = useCallback(
    () => {
      const token = localStorage.getItem('jwtToken');
      fetch('/api/courses', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => setRows(data))
        .catch((err) => console.log(err));
    },
    [] 
  );



  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendRequestToPasswordReset = (event) => {
   
   

    const token = localStorage.getItem('jwtToken');
    
    fetch('/auth/courses', {
      method: 'GET',
      headers: {
       
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
  
        
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const buttonHandler = () => {
    navigate('/utils/util-newcourse');
  };


  const redirectToGradingSystem = useCallback(
    (id) => {
      navigate('/utils/util-grading', { state: { id } });
    },
    [navigate]
  );

  const handleEditClick = useCallback(
    (id) => () => {
      navigate('/utils/util-newcourse', { state: { id } });
     
    },
    [navigate]
  );


  const handleDeleteClick = useCallback(
    (id) => () => {
      const token = localStorage.getItem('jwtToken');
      fetch('/api/removeCourse/' + id, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          rowsHandler();
          handleClose();
        })
        .catch((err) => {
          console.log(err);
          handleClose();
        });
    },
    [rowsHandler]
  );


  const columns = useMemo(
    () => [
      {
        field: 'courseName',
        headerName: 'Názov kurzu',
        flex: 1,
        minWidth: 200,
        editable: false,
      },
      {
        field: 'subject',
        headerName: 'Predmet',
        flex: 1,
        minWidth: 200,
        editable: false,
      },
      {
        field: 'grading',
        type: 'actions',
        headerName: 'Známkovanie',
        flex: 1,
        minWidth: 200,
        cellClassName: 'grading',
        getActions: ({ id }) => [
          <GridActionsCellItem
            key={`grade-${id}`}
            icon={<GradingIcon />}
            label="Delete"
            onClick={() => redirectToGradingSystem(id)}
            color="inherit"
          />,
        ],
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Akcie',
        width: 200,
        cellClassName: 'actions',
        getActions: ({ id }) => [
          <GridActionsCellItem
            key={`edit-${id}`}
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`delete-${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleClickOpen(id)}
            color="inherit"
          />,
        ],
      },
    ],
    [redirectToGradingSystem, handleEditClick, handleClickOpen] 
  );

  
  useEffect(() => {
    rowsHandler();
  }, []);

  return (
    <>
      <Button variant="outlined" size="medium" onClick={buttonHandler} style={{ marginBottom: 2 + 'em', textTransform: 'none' }}>
        Nový kurz
      </Button>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            
            pagination: {
              paginationModel: {
                pageSize: 8
              }
            }
          }}
          pageSizeOptions={[8]}
          disableRowSelectionOnClick
          onRowSelectionModelChange={(ids) => {
            console.log(ids);
          }}
        />
      </Box>
      {open &&  <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Naozaj si prajete odstrániť kurz?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Po odstráneni kurzu už nebude možné tieto zmeny vrátit späť.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nie</Button>
          <Button onClick={handleDeleteClick(deleteId)}>Áno</Button>
        </DialogActions>
      </Dialog>}
    </>
  );
}
