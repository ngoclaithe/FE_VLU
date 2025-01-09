import React from 'react';

const SemesterList = ({ semesters, onSelectSemester }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'approve':
        return 'Đã phê duyệt';
      case 'approve_not_teacher': 
        return 'Đã phê duyệt';
      case 'pending':
        return 'Đang chờ';
      default:
        return status;
    }
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách học kỳ</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Học kỳ</th>
            <th className="py-2 px-4 border-b">Năm học</th>
            <th className="py-2 px-4 border-b">Ngày bắt đầu</th>
            <th className="py-2 px-4 border-b">Ngày kết thúc</th>
            <th className="py-2 px-4 border-b">Trạng thái</th>
            <th className="py-2 px-4 border-b">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester) => (
            <tr key={semester.id}>
              <td className="py-2 px-4 border-b text-center">{semester.id_semester}</td>
              <td className="py-2 px-4 border-b text-center">{semester.school_year}</td>
              <td className="py-2 px-4 border-b text-center">{semester.start_day}</td>
              <td className="py-2 px-4 border-b text-center">{semester.end_day}</td>
              <td className="py-2 px-4 border-b text-center">{getStatusText(semester.status)}</td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                  onClick={() => onSelectSemester(semester)}
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SemesterList;