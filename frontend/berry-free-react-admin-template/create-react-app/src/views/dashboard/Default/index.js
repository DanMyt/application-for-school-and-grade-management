import React, { useEffect, useState, useRef } from 'react';
import ICAL from 'ical.js';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import interactionPlugin from '@fullcalendar/interaction';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import rrulePlugin from '@fullcalendar/rrule';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import { Fade } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openSecond, setOpenSecond] = React.useState(false);
  const [openThird, setOpenThird] = React.useState(false);
  const [dayEvents, setDayEvents] = useState([]);
  const [valueStart, setValueStart] = React.useState(dayjs());
  const [valueEnd, setValueEnd] = React.useState(null);
  const [valueEndOfRepeating, setValueEndOfRepeating] = React.useState(null);
  const [name, setName] = useState('');
  const [retry, setRetry] = useState('');
  const [tooltipContent, setTooltipContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openTooltip, setOpenTooltip] = useState(false);
  const arrowRef = useRef(null);

  // Function to update state based on input changes
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  function importICalToFullCalendar(icsData, id) {
  
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');
   

    const fullCalendarEvents = vevents.map((event) => {
      const vevent = new ICAL.Event(event);
      let eventObject = {
        id: id,
        title: vevent.summary,
        start: vevent.startDate.toJSDate(),
        end: vevent.endDate.toJSDate()
      };
      if (vevent.isRecurring()) {
        const recurrenceRule = vevent.component.getFirstPropertyValue('rrule');
        if (recurrenceRule) {
          eventObject.rrule = {
            freq: recurrenceRule.freq,
            interval: recurrenceRule.interval,
            dtstart: vevent.startDate.toJSDate()
          };

          if (recurrenceRule.parts.BYDAY) {
            eventObject.rrule.byweekday = recurrenceRule.parts.BYDAY;
          }
          if (recurrenceRule.until) {
            eventObject.rrule.until = recurrenceRule.until.toJSDate();
          }
          if (recurrenceRule.count) {
            eventObject.rrule.count = recurrenceRule.count;
          }
        }
      }
      
      const ical = createICalendarContent(eventObject.title, eventObject.start, eventObject.end, false, eventObject.rrule.until, eventObject.rrule)
   
      sendICal(ical);
      setEvents([]);
      getIcals();
      return eventObject;
    });

    return fullCalendarEvents;
  }

  function importICalToFullCalendar2(icsData, id) {

    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');
  

    const fullCalendarEvents = vevents.map((event) => {
      const vevent = new ICAL.Event(event);
      let eventObject = {
        id: id,
        title: vevent.summary,
        start: vevent.startDate.toJSDate(),
        end: vevent.endDate.toJSDate()
      };
      if (vevent.isRecurring()) {
        const recurrenceRule = vevent.component.getFirstPropertyValue('rrule');
        if (recurrenceRule) {
          eventObject.rrule = {
            freq: recurrenceRule.freq,
            interval: recurrenceRule.interval,
            dtstart: vevent.startDate.toJSDate()
          };

          if (recurrenceRule.parts.BYDAY) {
            eventObject.rrule.byweekday = recurrenceRule.parts.BYDAY;
          }
          if (recurrenceRule.until) {
            eventObject.rrule.until = recurrenceRule.until.toJSDate();
          }
          if (recurrenceRule.count) {
            eventObject.rrule.count = recurrenceRule.count;
          }
        }
      }
   
      //sendICal(eventObject);
      return eventObject;
    });

    return fullCalendarEvents;
  }

  function createICalendarContent(name, start, end, retry, until, rrule) {
    const formatDate = (date) => {
      // Ensure the date is formatted as UTC by adding 'Z' to denote UTC time zone
      return dayjs(date).format('YYYYMMDDTHHmmss') + 'Z';
    };

    // Formatting the RRULE string based on the retry and until parameters
    let recurrenceRule = '';
    if (rrule) {
      recurrenceRule = `RRULE:FREQ=${rrule.freq};INTERVAL=${rrule.interval}`;
      if (until) {
        recurrenceRule += `;UNTIL=${formatDate(until)}`;
      }
    } else {
      if (retry) {
        recurrenceRule = `RRULE:FREQ=DAILY;INTERVAL=${retry}`;
        if (until) {
          recurrenceRule += `;UNTIL=${formatDate(until)}`;
        }
      }
  
    }
    
    
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${name}`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      recurrenceRule, // Add the RRULE to the event
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  const handleClickOpen = (id) => {
    setOpen(true);
  };

  const handleDateClick = (arg) => {
    setValueStart(dayjs(arg.date));
    setOpenThird(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickRemove = (eventID) => {
  
    const token = localStorage.getItem('jwtToken');
    fetch(`/api/ical/` + eventID, {
      // Adjust the URL according to your API
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
        return response.json();
      })
      .then(() => {
        setEvents(events.filter((event) => event.id !== eventID));
      
        setEvents([]);
        handleClose();
        getIcals();
      })
      .catch((error) => { 
        console.error('Error:', error);
        setEvents(events.filter((event) => event.id !== eventID));
      
        handleClose();
        setEvents([]);
        getIcals();
      });
  };

  const handleClickOpenSecond = (id) => {
    handleClose();
    setOpenSecond(true);
  };

  const handleCloseSecond = () => {
    setOpenSecond(false);
  };

  const handleClickOpenThird = (id) => {
    handleClose();
    setOpenThird(true);
  };

  const handleCloseThird = () => {
    setValueStart(null);
    setValueEnd(null);
    setOpenThird(false);
  };

  const handleCreationOfEvent = () => {
    setOpenThird(false);
    const iCal = createICalendarContent(name, valueStart, valueEnd, retry, valueEndOfRepeating);
    sendICal(iCal);
   
  };

  const handleEventImport = (icsData) => {
    const importedEvents = importICalToFullCalendar(icsData);
    setEvents((prevEvents) => [...prevEvents, ...importedEvents]);
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const icsData = e.target.result;
        handleEventImport(icsData);
        //sendICal(icsData);
      };
      reader.readAsText(file);
    }
  }

  function exportFullCalendarToICal(events) {
    const comp = new ICAL.Component(['vcalendar', [], []]);
    events.forEach((event) => {
      const vevent = new ICAL.Component('vevent');
      vevent.addPropertyWithValue('uid', event.id.toString() || 'temp-id'); // Ensure ID is a string
      vevent.addPropertyWithValue('summary', event.title.toString()); // Ensure title is a string
      vevent.addPropertyWithValue('dtstart', ICAL.Time.fromJSDate(new Date(event.start), true)); // Correct
      vevent.addPropertyWithValue('dtend', ICAL.Time.fromJSDate(new Date(event.end), true)); // Correct
  
     
      comp.addSubcomponent(vevent);
    });
    return comp.toString(); 
  }

  const getIcals = () => {
    const token = localStorage.getItem('jwtToken');
    fetch('/api/ical/allIcals', {
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
        data.forEach((row) => {
          if (row.content) {
            const events = importICalToFullCalendar2(row.content, row.id);
            setEvents((prevEvents) => [...prevEvents, ...events]);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEventMouseEnter = (mouseEnterInfo) => {
    setTooltipContent(`${mouseEnterInfo.event.title}: ${mouseEnterInfo.event.start.toLocaleString()}`);
    setAnchorEl(mouseEnterInfo.el);
    setOpenTooltip(true);
  };

  const handleEventMouseLeave = () => {
    setOpenTooltip(false);
  };

  const handleEventClick = (clickInfo) => {
    setDayEvents([
      {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start,
        end: clickInfo.event.end
      }
    ]);
    setOpen(true);
  };

  const sendICal = async (icsData) => {
    const token = localStorage.getItem('jwtToken');
   
    const blob = new Blob([icsData], { type: 'text/calendar' });
    const formData = new FormData();
    formData.append('file', blob, 'events.ics');

    try {
      const response = await fetch('/api/ical/upload', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.text(); 
     
      if (responseData) {
        return JSON.parse(responseData); 
      } else {
        console.log('No JSON data returned');
        setEvents([]);
        getIcals();
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const handleChange = (event) => {
    setRetry(event.target.value);
  };

  const handleDownloadICal = () => {
    const iCalData = exportFullCalendarToICal(events);
    const blob = new Blob([iCalData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'events.ics';
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    getIcals();
  }, []);

  

  return (
    <>
      <Popper
        open={openTooltip}
        anchorEl={anchorEl}
        placement="top"
        style={{ zIndex: '10000' }}
        transition
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8
            }
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8
            }
          },
          {
            name: 'arrow',
            enabled: false,
            options: {
              element: arrowRef
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Tooltip title={tooltipContent} arrow>
              <div style={{ padding: '10px', background: 'lightGray', border: '1px solid black' }}>{tooltipContent}</div>
            </Tooltip>
          </Fade>
        )}
      </Popper>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, rrulePlugin]}
          initialView="dayGridMonth"
          events={events}
          editable={true}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          customButtons={{
            myCustomButton: {
              text: '+',
              click: handleClickOpenThird
            },

            myCustomButton3: {
              text: 'Export iCal',
              click: handleDownloadICal
            }
          }}
          headerToolbar={{
            left: 'myCustomButton myCustomButton3',
            center: 'title',
            right: 'prev,next'
          }}
        />

        <input
          type="button"
          className="upload-buttonIcal"
          id="loadFileXml"
          value="Nahraj iCal"
         
          onClick={() => document.getElementById('uploadiCal')?.click()}
        />
        <input type="file" name="files" onChange={handleFileChange} id="uploadiCal" style={{ display: 'none' }} />

        <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-labelledby="customized-dialog-title">
          <DialogTitle id="customized-dialog-title">{'Podujatie:'}</DialogTitle>
          <DialogContent>
            <List>
              {dayEvents.map((event, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={event.title}
                    secondary={`Start: ${new Date(event.start).toLocaleString()}, End: ${new Date(event.end).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button  variant="contained" color="primary" style={{ fontWeight: 'bold' }} onClick={() => handleClickRemove(dayEvents[0].id)}>Vymazať udalosť</Button>
            <Button style={{ marginRight: '8px', color: '#757575' }} onClick={handleClose}>Zatvoriť</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSecond}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
            
              handleClose();
            }
          }}
        >
          <DialogTitle>Nová udalosť</DialogTitle>
          <DialogContent>
            <DialogContentText>Pre vytvorenie udalosti prosím vyplňte:</DialogContentText>
            <TextField autoFocus required margin="dense" id="name" name="nazov" label="Názov" type="input" fullWidth variant="standard" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSecond}>Zrušiť</Button>
            <Button type="submit" >Vytvoriť</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openThird}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
            
              handleClose();
            }
          }}
        >
          <DialogTitle style={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '10px' }}>Nová udalosť</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ marginBottom: '20px' }}>Pre vytvorenie udalosti prosím vyplňte:</DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="nazov"
              label="Názov"
              type="input"
              fullWidth
              variant="outlined"
              value={name}
              onChange={handleNameChange}
              style={{ marginBottom: '20px' }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Začiatok udalosti"
                value={valueStart}
                onChange={(newValue) => {
                  setValueStart(newValue);
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" style={{ marginBottom: '20px' }} />}
              />
              <DateTimePicker
                label="Koniec udalosti"
                value={valueEnd}
                onChange={(newValue) => {
                  setValueEnd(newValue);
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" style={{ marginBottom: '20px' }} />}
              />
            </LocalizationProvider>
            <TextField
              id="outlined-number"
              label="Opakovať každých __ dní"
              type="number"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={retry}
              onChange={handleChange}
              variant="outlined"
              style={{ marginBottom: '20px', width: '100%', marginTop: '20px' }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Koniec opakovania"
                value={valueEndOfRepeating}
                onChange={(newValue) => {
                  setValueEndOfRepeating(newValue);
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" style={{ marginBottom: '20px' }} />}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions style={{ padding: '20px' }}>
            <Button onClick={handleCloseThird} style={{ marginRight: '8px', color: '#757575' }}>
              Zrušiť
            </Button>
            <Button onClick={handleCreationOfEvent} type="submit" variant="contained" color="primary" style={{ fontWeight: 'bold' }}>
              Vytvoriť
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Dashboard;
