import React from 'react';
import { Layout } from '../../components/layout/Layout';
import RequestTeacherSection from '../../components/requestteachertection/RequestTeacherSection';

const RequestTeacherPage = () => {
  return (
    <Layout>
      <div>
        <RequestTeacherSection/>
      </div>
    </Layout>
  );
};

export default RequestTeacherPage;