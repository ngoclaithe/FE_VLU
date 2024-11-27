import { Layout } from '../../components/layout/Layout';
const Dashboard = () => {
  const role = sessionStorage.getItem('role');

  return (
    <Layout>
      <div>
        {role === 'dean' && (
          <h1 className="text-2xl font-bold">Dashboard Chủ Nhiệm Khoa</h1>
        )}
        {role === 'teacher' && (
          <h1 className="text-2xl font-bold">Dashboard Giảng Viên</h1>
        )}
        {role === 'secretary' && (
          <h1 className="text-2xl font-bold">Dashboard Thư Ký</h1>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;