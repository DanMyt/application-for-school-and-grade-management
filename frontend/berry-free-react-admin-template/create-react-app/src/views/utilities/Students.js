import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';
import { GridActionsCellItem } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { GridRowModes, GridToolbarContainer, GridRowEditStopReasons } from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';



function EditToolbar(props) {
  const { setRows, setRowModesModel, rows } = props;

  const handleClick = () => {
    let minId = 0;
    rows?.forEach((row) => {
      if (row.id < minId) {
        minId = row.id;
      }
    });
    minId--;

    setRows((oldRows) => [...oldRows, { id: minId, firstName: '', lastName: '', mail: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [minId]: { mode: GridRowModes.Edit, fieldToFocus: 'firstName' }
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nový študent
      </Button>
    </GridToolbarContainer>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Students() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [students, setStudents] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    const token = localStorage.getItem('jwtToken');
    fetch('/api/removeStudent/' + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        } else {
          rowsHandler();
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
        handleClose();
      });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleSudentFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected for teachers.');
      return;
    }
    console.log('Selected file for teachers:', file.name);

    const fileReader = new FileReader();
    fileReader.onerror = (error) => {
      console.error('Error reading teacher file:', error);
    };

    fileReader.onload = (e) => {
      console.log('File loaded, processing teacher data.');
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonArr = XLSX.utils.sheet_to_json(worksheet);

      setStudents(jsonArr);
    
      handleSendData(jsonArr);
    };

    fileReader.readAsBinaryString(file);
    event.target.value = ''; 
  };

  const handleSendData = (jsonArr) => {
    jsonArr.forEach((dataItem) => {
     
      sendDataFromExcelToBackend(dataItem);
    });
  };

  const sendDataFromExcelToBackend = async (studentData) => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('/api/save-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          id: -1,
          mail: studentData.mail,
          firstName: studentData.firstName,
          lastName: studentData.lastName
        })
      });
      if (!response.ok) {
        console.log('Sth went wrong');
      } else {
        rowsHandler();
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('error');
    }
  };

  const saveStudent = async (studentData) => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('/api/save-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          id: studentData.id,
          mail: studentData.mail,
          firstName: studentData.firstName,
          lastName: studentData.lastName
        })
      });
      if (!response.ok) {
        console.log('Sth went wrong');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('error');
    }
  };

  const sendLoginToStudents = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('/api/students/sendLoginPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          studentsIds: selectedRowIds
        })
      });
      if (!response.ok) {
        console.log('Sth went wrong');
      } else {
        setOpenSnackbar(true);
      }
      const data = await response.json();
    } catch (error) {
      console.log('error');
    }
  };

  const rowsHandler = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('/api/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
      if (!response.ok) {
        console.log('Sth went wrong');
      }

      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.log('error');
    }
  };

  const columns = [
    {
      field: 'firstName',
      headerName: 'Meno',
      flex: 1,
      minWidth: 200,
      editable: true
    },
    {
      field: 'lastName',
      headerName: 'Priezvisko',
      flex: 1,
      minWidth: 200,
      editable: true
    },
    {
      field: 'mail',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      editable: true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcie',
      flex: 1,
      minWidth: 200,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save-${id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel-${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ];
        }

        return [
          <GridActionsCellItem key={`edit-${id}`} icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} color="inherit" />,
          <GridActionsCellItem
            key={`delete-${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleClickOpen(id)}
            color="inherit"
          />
        ];
      }
    }
  ];

  useEffect(() => {
    rowsHandler();
  }, []);

  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
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
          }}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={async (newRow) => {
            const updatedRow = { ...newRow, isNew: false };
            const savedRow = await saveStudent(updatedRow);
            if (savedRow && savedRow.id) {
              setRows(rows.map((row) => (row.id === newRow.id ? { ...row, ...savedRow } : row)));
            }
            return savedRow;
          }}
          slots={{
            toolbar: EditToolbar
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel, rows }
          }}
          onRowEditStop={handleRowEditStop}
        />
      </Box>
      <div style={{ justifyContent: 'space-between', display: 'flex' }}>
        <Button variant="outlined" size="medium" onClick={sendLoginToStudents} style={{ marginTop: 2 + 'em', textTransform: 'none' }}>
          Odoslať študentom prihlasovacie údaje
        </Button>
        <div>
        <Button
          variant="outlined"
          size="medium"
          onClick={() => {
            console.log('Button clicked');
            document.getElementById('studentFileUpload')?.click();
          }}
          style={{ marginTop: '2em', textTransform: 'none' }}
        >
          Načítaj študentov
        </Button>
        <Tooltip  style={{marginTop: "1em"}} variant="outlined" title="Je potrebné nahrat xls súbor s 3 stlpcami: mail firstName lastName">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
        </div>
        <input
          type="file"
          name="files"
          id="studentFileUpload"
          accept=".xls,.xlsx"
          style={{ display: 'none' }}
          onChange={handleSudentFileUpload}
        />
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Naozaj si prajete pokračovať?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Po odstráneni už nebude možné tieto zmeny vrátit späť.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nie</Button>
          <Button onClick={handleDeleteClick(deleteId)}>Áno</Button>
        </DialogActions>
      </Dialog>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            Prihlasovacie údaje boli úspešne odoslané.
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
