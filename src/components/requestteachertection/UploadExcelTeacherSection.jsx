import React, { useState } from "react";
import { updateExcel } from "../../services/apiSchedule";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadExcelTeacherSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const userRole = sessionStorage.getItem('role');
  if (userRole !== 'secretary') {
    return null;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadExcel = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file Excel");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await updateExcel(formData);
      
      if (response) {
        toast.success("Upload file Excel thành công!");
        setSelectedFile(null);
        if (document.getElementById('excelFileInput')) {
          document.getElementById('excelFileInput').value = '';
        }
      }
    } catch (error) {
      toast.error("Lỗi khi upload file: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upload File Excel</h2>
      <div className="flex items-center space-x-4 mb-6">
        <input 
          id="excelFileInput"
          type="file" 
          accept=".xlsx, .xls"
          onChange={handleFileChange} 
          className="border rounded px-2 py-1"
        />
        <button 
          onClick={handleUploadExcel}
          disabled={loading || !selectedFile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading ? "Đang tải lên..." : "Upload"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UploadExcelTeacherSection;