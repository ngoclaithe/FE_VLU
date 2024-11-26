import React from 'react';
import { Layout } from '../../components/layout/Layout';
import ShiftListTeacher from '../../components/shiftlist/ShiftListTeacher';

const ShiftPageTeacher = () => {
  return (
    <Layout>
      <div>
        <ShiftListTeacher/>
      </div>
    </Layout>
  );
};

export default ShiftPageTeacher;