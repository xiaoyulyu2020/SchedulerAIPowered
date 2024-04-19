import React, { useState, useEffect, useRef } from 'react';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Toast } from 'primereact/toast';
import { Chart } from 'primereact/chart';
import { Demo } from '@/types';

const AgeDistribution: React.FC = () => {
    const [ageDistribution, setAgeDistribution] = useState<Demo.AgeRange[]>([]);
    const toastCenter = useRef<Toast>(null);

    useEffect(() => {
        EmployeeService.getAgeRange()
            .then(data => {setAgeDistribution(data)});}, []);
    
    const chartData = {
        labels: Object.keys(ageDistribution),
        datasets: [
            {
                label: 'Age Distribution',
                data: Object.values(ageDistribution),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h5>Age Distribution</h5>
            <Chart type="bar" data={chartData} />
            <Toast ref={toastCenter} position="top-center" />
        </div>
    );
};

export default AgeDistribution;
