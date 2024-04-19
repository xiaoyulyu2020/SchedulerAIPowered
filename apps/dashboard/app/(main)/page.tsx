/* eslint-disable @next/next/no-img-element */
'use client';

import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import EmployeeTreeTable  from '../../demo/components/EmployeeTreeTable';
import AgeDistributionChart  from '../../demo/components/Chart';
import SatisfactionDistribution  from '../../demo/components/Pie';
import FilterForm  from '../../demo/components/threshold';
import RemoveShift  from '../../demo/components/RemoveShift';
import AddShift  from '../../demo/components/AddShift';
import EndHolidayMessage from "../../demo/components/EndHoliday"
import { Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import { TreeNode } from 'primereact/treenode';

const lineData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [employee, setEmployee] = useState<Demo.Employee[]>([]);
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [totalEmployeesCount, setTotalEmployeesCount] = useState(0);
    const [averageSalary, setAverageSalary] = useState(0);
    const [averagePerformence, setAveragePerformence] = useState(0);
    const [averageYears, setAverageYears] = useState(0);
    const [employeeDetails, setEmployeeDetails] = useState<Demo.Employee | null>(null);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);
    const [nodes, setNodes] = useState<TreeNode[]>([]);

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };


    useEffect(() => {
        EmployeeService.getEmployees().then((data) => setEmployee(data));
    }, []);

    useEffect(() => {
        EmployeeService.countEmployees().then((count) => setTotalEmployeesCount(count));
    }, []);

    useEffect(() => {
        EmployeeService.averageSalary().then((data) => setAverageSalary(data));
    }, []);
    useEffect(() => {
        EmployeeService.getPerformence().then((data) => setAveragePerformence(data));
    }, []);
    useEffect(() => {
        EmployeeService.getYears().then((data) => setAverageYears(data));
    }, []);


    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    return (
        <div className="grid">
            <div><EndHolidayMessage /></div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Employees&nbsp;&nbsp;</span>
                            <div className="text-900 font-medium text-xl">{totalEmployeesCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-blue-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Average Salary&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <div className="text-900 font-medium text-xl">{averageSalary}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-euro text-orange-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Average Performence&nbsp;</span>
                            <div className="text-900 font-medium text-xl">{averagePerformence}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-thumbs-up text-cyan-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Average Work Years&nbsp;</span>
                            <div className="text-900 font-medium text-xl">{averageYears} </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-calendar text-purple-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 xl:col-7">
                <div className="card" style={{ height: '100%' }}>
                    <EmployeeTreeTable />
                </div>
            </div>

            <div className="col-12 xl:col-5">
                <div className="card" style={{ height: '100%' }}>
                    <h5>GENERATE SCHEDULE</h5>
                    <div className="flex align-items-center justify-content-between mb-4">
                        <FilterForm/>
                    </div>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>REMOVE SHIFTS</h5>
                    <div className="flex align-items-center justify-content-between mb-4">
                        <RemoveShift/>
                    </div>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>ADD SHIFTS</h5>
                    <div className="flex align-items-center justify-content-between mb-4">
                        <AddShift/>
                    </div>
                </div>
            </div>
            <div className="col-12 xl:col-8">
                <div className="card" >
                    <AgeDistributionChart/>
                </div>
            </div>
            <div className="col-12 xl:col-4">
                <div className="card"  style={{ height: '100%' }}>
                    <SatisfactionDistribution />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
