import React from 'react';
import { Layout } from '../../components/layout/Layout';
import ShiftList from '../../components/shiftlist/ShiftList';

const ShiftPage = () => {
  return (
    <Layout>
      <div>
        <ShiftList/>
      </div>
    </Layout>
  );
};

export default ShiftPage;