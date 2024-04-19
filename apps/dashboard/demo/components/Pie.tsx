import React, { useState, useEffect, useRef } from 'react';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Toast } from 'primereact/toast';
import { Chart } from 'primereact/chart';
import { Demo } from '@/types';

const SatisfactionDistribution: React.FC = () => {
    const [satisfactionDistribution, setSatisfactionDistribution] = useState<Demo.Sat[]>([]);
    const toastCenter = useRef<Toast>(null);

    useEffect(() => {
        EmployeeService.getSatRange()
            .then(data => setSatisfactionDistribution(data));}, []);
    
    const chartData = {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
            {
                data: Object.values(satisfactionDistribution),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }
        ]
    };

    return (
        <div>
            <h5>Satisfaction Distribution</h5>
            <Chart type="pie" data={chartData} />
            <Toast ref={toastCenter} position="top-center" />
        </div>
    );
};

export default SatisfactionDistribution;
