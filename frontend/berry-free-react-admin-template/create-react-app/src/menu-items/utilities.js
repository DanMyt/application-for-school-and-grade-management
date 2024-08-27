// assets
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';

// constant
const icons = {
  LibraryBooksOutlinedIcon,
  StickyNote2OutlinedIcon,
  TextsmsOutlinedIcon,
  GroupOutlinedIcon,
  HowToRegOutlinedIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: '',
  type: 'group',
  children: [
    
    {
      id: 'util-courses',
      title: 'Kurzy',
      type: 'item',
      url: '/utils/util-courses',
      icon: icons.LibraryBooksOutlinedIcon,
      
      breadcrumbs: false
    },
    {
      id: 'util-coursesAssigements',
      title: 'Úlohy',
      type: 'item',
      url: '/utils/util-coursesAssigements',
      icon: icons.StickyNote2OutlinedIcon,
      
      breadcrumbs: false
    },
    
    {
      id: 'util-myEditor',
      title: 'Pridávanie príspevkov',
      type: 'item',
      url: '/utils/util-my-editor',
      icon: icons.StickyNote2OutlinedIcon,
      
      breadcrumbs: false
    },

    {
      id: 'util-students',
      title: 'Študenti',
      type: 'item',
      url: '/utils/util-students',
      icon: icons.GroupOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'util-emailTemplates',
      title: 'Emailové šablóny',
      type: 'item',
      url: '/utils/util-emailTemplates',
      icon: icons.TextsmsOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'util-pending',
      title: 'Žiadosti o registráciu',
      type: 'item',
      url: '/utils/util-pending',
      icon: icons.HowToRegOutlinedIcon,
      
      breadcrumbs: false
    }
  ]
};

export default utilities;
