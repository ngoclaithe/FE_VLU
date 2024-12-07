import { Home, BarChart, FileText, Users, CheckSquare, User, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Sidebar = ({ isOpen, role }) => {
  const deanMenuItems = [
    { icon: Home, label: 'Trang chủ', path: '/dashboard' },
    { icon: FileText, label: 'Quản lý lịch trực', path: '/schedule' },
    { icon: CheckSquare, label: 'Danh sách yêu cầu', path: '/requests' },
    { icon: BarChart, label: 'Thống kê', path: '/statistics' },
    { icon: Users, label: 'Người dùng', path: '/users' },
  ];

  const secretaryMenuItems = [
    { icon: Home, label: 'Trang chủ', path: '/dashboard' },
    { icon: FileText, label: 'Quản lý lịch trực', path: '/schedule' },
    { icon: CheckSquare, label: 'Danh sách yêu cầu', path: '/requests' },
  ];

  const teacherMenuItems = [
    { icon: Home, label: 'Trang chủ', path: '/dashboard' },
    { icon: Clipboard, label: 'Lịch trực', path: '/schedule-teacher' },
    { icon: CheckSquare, label: 'Checkin/Checkout', path: '/attendance-teacher' },
    { icon: FileText, label: 'Kiểm tra điểm danh', path: '/teacher-history' },
    { icon: User, label: 'Thông tin cá nhân', path: '/teacher-info' },
  ];

  const menuItems =
    role === 'dean'
      ? deanMenuItems
      : role === 'secretary'
      ? secretaryMenuItems
      : teacherMenuItems;

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out z-40 pt-16
        ${isOpen ? 'w-64' : 'w-0 lg:w-64'}`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path} 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors
                hover:bg-gray-800 text-gray-300 hover:text-white"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
