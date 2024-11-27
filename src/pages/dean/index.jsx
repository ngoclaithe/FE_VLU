import { Layout } from '../../components/layout/Layout';

const Dashboard = () => {
  const email = sessionStorage.getItem('email');  

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-auto mt-10">
          <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
            CHÀO MỪNG QUÝ THẦY CÔ ĐÃ ĐĂNG NHẬP VÀO HỆ THỐNG QUẢN LÝ LỊCH TRỰC
          </h1>
          <p className="text-lg text-center text-gray-700">
            Địa chỉ email: <span className="font-medium text-blue-500">{email}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
