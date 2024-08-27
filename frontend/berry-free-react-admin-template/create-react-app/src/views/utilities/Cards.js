import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DOMPurify from 'dompurify';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import PersonIcon from '@mui/icons-material/Person';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LazyImage = ({ src }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let observer;
    let didCancel = false;
  
    if (imageRef.current && !imageSrc) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
              setImageSrc(src);
              if (observer && observer.unobserve) {
                observer.unobserve(entry.target);
              }
            }
          });
        },
        { threshold: 0.01 }
      );
      observer.observe(imageRef.current);
    }
  
    return () => {
      didCancel = true;
      if (observer && observer.disconnect) {
        observer.disconnect(); 
      }
    };
  }, [src, imageSrc]);
  
  return <img ref={imageRef} alt="" src={imageSrc} style={{ maxWidth: '100%', height: 'auto' }} />;
};

export default function Cards(props) {
  const roles = localStorage.getItem('roles');
  const [showDeleteIcon, setShowDeleteIcon] = useState(true);
  const { content, date, teacherFirstName, teacherSecondName, imageSrc, imageId, postId, postHandler } = props;
  const formattedDateTime = moment(date).format('MMMM DD, YYYY hh:mm A');
  const [open, setOpen] = React.useState(false);
  const cleanContent = DOMPurify.sanitize(content);
  const theme = useTheme();
  const anchorRef = useRef(null);

  const removePostById = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('/api/post/remove/' + postId, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        handleClose();
        postHandler();
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const responseData = await response.json();
        handleClose();
        postHandler();
      }
    } catch (error) {
      console.error('Error in fetch:', error);
      handleClose();
      postHandler();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    if (roles.length > 0) {
      if (roles.includes('STUDENT')) {
        setShowDeleteIcon(false);
      } else if (roles.includes('TEACHER')) {
        setShowDeleteIcon(true);
      }
    }
  }, []);

  return (
    <>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
    <Card sx={{ flex: 1, maxWidth: 700, minWidth: 300 }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{
                ...theme.typography.mediumAvatar,
                margin: '8px 0 8px 8px !important',
                cursor: 'pointer'
              }}
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              color="inherit"
            >
              <PersonIcon></PersonIcon>
            </Avatar>
          }
          action={
            <IconButton onClick={handleClickOpen} aria-label="settings">
              {showDeleteIcon && <DeleteIcon />}
            </IconButton>
          }
          title={`${teacherFirstName} ${teacherSecondName}`}
          subheader={formattedDateTime}
        />

        {imageSrc && <LazyImage src={imageSrc} />}
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
          </Typography>
        </CardContent>
      </Card>
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
          <Button onClick={removePostById}>Áno</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
