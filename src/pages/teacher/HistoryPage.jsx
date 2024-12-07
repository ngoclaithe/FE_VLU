import React from 'react';
import { Layout } from '../../components/layout/Layout';
import HistoryPageSection from '../../components/history/HistoryPageSection';

const HistoryPage = () => {
  return (
    <Layout>
      <div>
        <HistoryPageSection/>
      </div>
    </Layout>
  );
};

export default HistoryPage;