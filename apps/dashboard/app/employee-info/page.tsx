'use client';
import React from 'react';
import EmployeeDataTable from '../../demo/components/EmployeeDetails';

const EmployeeInfoPage: React.FC = () => {
  return (
    <div className="grid">
        <div className="col-12"><EmployeeDataTable /></div>
    </div>
  );
};

export default EmployeeInfoPage;
