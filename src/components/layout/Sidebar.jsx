import { Home, BarChart, FileText, Users } from 'lucide-react';

export const Sidebar = ({ isOpen, role }) => {

  const deanMenuItems = [
    { icon: Home, label: 'Trang chủ', path: '/dashboard' },
    { icon: FileText, label: 'Quản lý lịch trực', path: '/schedule' },
    { icon: FileText, label: 'Danh sách yêu cầu', path: '/requests' },
    { icon: BarChart, label: 'Thống kê', path: '/statistics' },
    // { icon: FileText, label: 'Lịch sử', path: '/history' },
    { icon: Users, label: 'Người dùng', path: '/users' },
  ];


  const teacherMenuItems = [
    { icon: Home, label: 'Trang chủ', path: '/dashboard-teacher' },
    { icon: FileText, label: 'Lịch trực', path: '/schedule-teacher' },
    { icon: FileText, label: 'Checkin/Checkout', path: '/attendance-teacher' },
    { icon: FileText, label: 'Thông tin cá nhân', path: '/teacher-info' },
  ];

  const menuItems = role === 'dean' ? deanMenuItems : teacherMenuItems;

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out z-40 pt-16
        ${isOpen ? 'w-64' : 'w-0 lg:w-64'}`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors
                hover:bg-gray-800 text-gray-300 hover:text-white"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
