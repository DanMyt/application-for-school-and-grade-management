import React, { useState, useEffect, useRef } from 'react';
import { Editor } from 'primereact/editor';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function MyEditor() {
  const [text, setText] = useState('');
  const [imageData, setImageData] = useState(null); 
  const quillRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [filledCourses, setFilledCourses] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCourseAutocompleteChange = (event, newValue) => {
    setFilledCourses(newValue);
  };

  const submitHandler = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: text, courses: filledCourses })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const responseData = await response.json();
        if (imageData) {
          sendImageToBackend(responseData.id);
        }
        setOpenSnackbar(true);
        
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const sendImageToBackend = async (id) => {
    const token = localStorage.getItem('jwtToken');
   
    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imageData,
          postId: id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const responseData = await response.json();
      
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const getCourses = () => {
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
        setCourses(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCourses();
  }, []);

  const handleTextChange = (e) => {
    const html = e.htmlValue;
    const doc = new DOMParser().parseFromString(html, 'text/html');
  
   
    doc.querySelectorAll('img').forEach(img => {
      if (img.src && img.src.startsWith('data:image')) {
        img.parentNode.replaceChild(document.createTextNode("[image placeholder]"), img);
      }
    });
    setText(doc.body.innerHTML);
  };

 
  

  const renderHeader = () => {
    const handleImage = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.onchange = async () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target.result.split(',')[1]; 
          setImageData(base64Image);
          const img = document.createElement('img');
          img.src = e.target.result;
          const range = quillRef.current.getQuill().getSelection(true);
          quillRef.current.getQuill().insertEmbed(range.index, 'image', img.src);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };

    const handleColor = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'color');
      input.onchange = (e) => {
        const color = e.target.value;
        const range = quillRef.current.getQuill().getSelection();
        if (range) {
          quillRef.current.getQuill().format('color', color);
        }
      };
      input.click();
    };

    return (
      <span className="ql-formats">
        <select className="ql-font">
          <option value="sans-serif">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
        <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
        <button className="ql-image" onClick={handleImage} aria-label="Insert Image">Img</button>
        <button className="ql-color" onClick={handleColor} aria-label="Text Color">Color</button>
      </span>
    );
  };

  return (
    <div>
      <div className="card">
        <h5>Editor na vytváranie príspevkov</h5>
        <Editor ref={quillRef} style={{ height: '320px' }} value={text} onTextChange={handleTextChange} headerTemplate={renderHeader()} />
      </div>
      <Autocomplete
            fullWidth
            style={{marginTop: '1em'}}
            multiple
            limitTags={2}
            id="multiple-limit-tags2"
            options={courses}
            value={filledCourses}
            getOptionLabel={(option) => option.courseName}
            onChange={handleCourseAutocompleteChange}
            renderInput={(params) => <TextField {...params} label="Komu je príspevok určený?" placeholder="Favorites" />}
          />
      <Button variant="contained" color="primary" size="medium" style={{ marginTop: 2 + 'em' }} onClick={submitHandler} disableElevation>
        Publikovať
      </Button>
      {openSnackbar && (
        <Snackbar 
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            Príspevok bol úspešne pridaný.
          </Alert>
        </Snackbar>
      )}
      
     
    </div>
  );
}
