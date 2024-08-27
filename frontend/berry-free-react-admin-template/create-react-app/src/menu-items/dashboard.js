// assets
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
// constant
const icons = { DashboardOutlinedIcon, CalendarMonthOutlinedIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Kalendár',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.CalendarMonthOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'default2',
      title: 'Nástenka',
      type: 'item',
      url: '/dashboard/default-prispevky',
      icon: icons.DashboardOutlinedIcon,
      breadcrumbs: false
    }

  ]
};

export default dashboard;
