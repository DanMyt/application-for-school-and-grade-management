import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
 
}));

export default function CustomizedMenus({onSelectOption}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuItemClick = (label) => {
    onSelectOption(label);
    handleClose(); 
  };

 
  const menuOptions = [
    { id: 'student1', label: '{{student.firstName}}'},
    { id: 'student2', label: '{{student.secondName}}'},
    { id: 'grade', label: '{{grade.grade}}'},
    { id: 'assigement', label: '{{assignment.name}}'}
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        style={{ textTransform: 'none'}}
      >
        Dostupné značky
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuOptions.map((option) => (
          <MenuItem key={option.id} onClick={() => handleMenuItemClick(option.label)} disableRipple>
          {option.label}
          </MenuItem>
        ))}

      </StyledMenu>
    </div>
  );
}
