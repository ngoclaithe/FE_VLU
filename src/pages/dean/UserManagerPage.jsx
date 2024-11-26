import React from 'react';
import { Layout } from '../../components/layout/Layout';
import UserManagerSection from '../../components/usermanager/UserManagerSection';

const UserManagerPage = () => {
  return (
    <Layout>
      <div>
        <UserManagerSection/>
      </div>
    </Layout>
  );
};

export default UserManagerPage;