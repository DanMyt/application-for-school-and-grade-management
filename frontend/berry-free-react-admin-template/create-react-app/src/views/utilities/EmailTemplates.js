import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import CustomizedMenus from './CustomizedMenus';
import { minWidth } from '@mui/system';

function NewTemplate(props) {
  const [template, setTemplate] = useState('');
  const { id, setRows, rows } = props;

  const submitHandler = useCallback(async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/api/templates/createTemplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          template: template
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const updatedTemplate = await response.json();
      setRows([...rows, updatedTemplate]);
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  }, [rows, setRows, template]);

  const handleSelectOption = useCallback((selectedOption) => {
    setTemplate((prevTemplate) => `${prevTemplate}${selectedOption}`);
  }, []);

  const inputChangeHandler = useCallback((event) => {
    setTemplate(event.target.value);
  }, []);


  const findTemplateById = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`/api/templates/template/content/${id}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Response not OK');
      }
      const data = await response.json();
      setTemplate(data.template);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const updateTemplate = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/api/templates/updateTemplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          id: id,
          template: template
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  }, [id, template]);

  const createOrSubmit = useCallback((event) => {
    if (id != null) {
      updateTemplate();
    } else {
      submitHandler(event);
    }
  }, [id, submitHandler, updateTemplate]);

 


  useEffect(() => {
    if (id != null) {
      findTemplateById();
    }
  }, [id, findTemplateById]);


  return (
    <form onSubmit={createOrSubmit}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ marginLeft: 0.6 + 'em', marginBottom: 0.6 + 'em' }}>
          <CustomizedMenus onSelectOption={handleSelectOption} />
        </div>
        <FormControl fullWidth sx={{ m: 1 }} style={{ marginBottom: 2 + 'em' }}>
          <InputLabel htmlFor="outlined-adornment-courseName"></InputLabel>
          <TextareaAutosize
            id="outlined-adornment-courseName"
            name="inputValue"
            aria-label="empty textarea"
            placeholder="Miesto pre novú šablónu"
            style={{ width: '100%', padding: '18.5px 14px', borderRadius: '4px', border: '1px solid #ced4da', marginTop: '8px' }} // Mimic OutlinedInput style
            value={template}
            onChange={inputChangeHandler}
            minRows={3}
          />
        </FormControl>
        <Button variant="contained" size="medium" style={{ marginBottom: 2 + 'em', marginLeft: 0.6 + 'em' }} type="submit" disableElevation>
          Potvrdiť
        </Button>
      </Box>
    </form>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EmailTemplates() {
  const [rows, setRows] = useState([]);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [templateId, setTemplateId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleClickOpen = useCallback((id) => {
    setDeleteId(id);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const buttonHandler = useCallback(() => {
    setShowNewTemplate((prevShowNewTemplate) => !prevShowNewTemplate);
  }, []);

  const handleShowNewTemplate = useCallback((id) => {
    setTemplateId(id);
    setShowNewTemplate(true);
  }, []);

  const handleEditClick = useCallback(
    (id) => () => {
      handleShowNewTemplate(id);
    },
    [handleShowNewTemplate]
  );

  const handleDeleteClick = useCallback(
    (id) => () => {
      const token = localStorage.getItem('jwtToken');
      fetch('/api/templates/removeCourse/' + id, {
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
    },
    []
  );

  const columns = [
    {
      field: 'template',
      headerName: 'Šablóna',
      flex: 1,
      minWidth: 600,
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcie',
      flex: 1,
      minWidth: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
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

  const rowsHandler = useCallback(() => {
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
        setRows(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    rowsHandler();
  }, []);

  return (
    <>
      <Button variant="outlined" size="medium" onClick={buttonHandler} style={{ marginBottom: 2 + 'em', textTransform: 'none' }}>
        Nová šablóna
      </Button>
      {showNewTemplate && <NewTemplate id={templateId} setRows={setRows} rows={rows} />}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10
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
    </>
  );
}
