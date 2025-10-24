import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import EditBureauTermsComponent from '../components/EditBureauTerms';

const EditBureauTerms = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <EditBureauTermsComponent />
        </main>
      </div>
    </div>
  );
};

export default EditBureauTerms; 