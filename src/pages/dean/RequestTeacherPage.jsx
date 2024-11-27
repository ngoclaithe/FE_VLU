import React from 'react';
import { Layout } from '../../components/layout/Layout';
import RequestTeacherSection from '../../components/requestteachertection/RequestTeacherSection';
import UploadExcelTeacherSection from '../../components/requestteachertection/UploadExcelTeacherSection';
const RequestTeacherPage = () => {
  return (
    <Layout>
      <div>
        <RequestTeacherSection/>
      </div>
      <div>
        <UploadExcelTeacherSection/>
      </div>
    </Layout>
  );
};

export default RequestTeacherPage;