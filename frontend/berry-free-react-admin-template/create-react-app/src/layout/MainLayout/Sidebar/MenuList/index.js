
import React, { useState } from 'react';
import { useEffect } from 'react';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const roles = localStorage.getItem('roles');
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <></>
        );
    }
  });

  const navItemsStudent = menuItem.studentItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <></>
         
        );
    }
  });

  
  useEffect(() => {
   
    if (roles.length > 0) {
      if (roles.includes('STUDENT')) {
        setShowStudentMenu(true);
      } else if (roles.includes('TEACHER')) {
        setShowStudentMenu(false);
      }
    }
  
  }, []);

  return <>
    {showStudentMenu ? navItemsStudent : navItems}
  </>;
};

export default MenuList;
