// assets

import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';

// constant
const icons = {
 
  LibraryBooksOutlinedIcon,
  StickyNote2OutlinedIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const studentUtilities = {
  id: 'utilities',
  title: '',
  type: 'group',
  children: [
    

    {
      id: 'util-studentCourses',
      title: 'Moje kurzy',
      type: 'item',
      url: '/utils/util-studentCourses',
      icon: icons.LibraryBooksOutlinedIcon,
      
      breadcrumbs: false
    },
    {
      id: 'util-mojeUlohy',
      title: 'Moje úlohy',
      type: 'item',
      url: '/utils/util-mojeUlohy',
      icon: icons.StickyNote2OutlinedIcon,
      
      breadcrumbs: false
    }
  ]
};

export default studentUtilities;
