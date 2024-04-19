import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Demo } from '@/types';
import { Toast } from 'primereact/toast';
import { useFilters } from '../../layout/context/filtercontext';

const EmployeeTreeTable: React.FC = () => {
    const [employees, setEmployees] = useState<Demo.Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Demo.Employee | null>(null);
    const toastCenter = useRef<Toast>(null);
    const { filterDepartment, searchEmployeeId, filterShift } = useFilters();

    useEffect(() => {
        EmployeeService.getEmployees()
          .then(data => {
            // Filter data based on context
            const filteredData = data.filter(emp =>
                (filterDepartment ? emp.Department === filterDepartment : true) &&
                (searchEmployeeId ? emp.EmployeeID?.toString().includes(searchEmployeeId) : true) &&
                (filterShift ? emp.Shift.toString() === filterShift.toString() : true)
            );
            setEmployees(filteredData);
          });
    }, [filterDepartment, searchEmployeeId, filterShift]);

    const showEmployeeDetails = (employeeId: number) => {
        EmployeeService.getEmployeeDetails(employeeId)
            .then((employee) => {
                setSelectedEmployee(employee);
                if (employee && toastCenter.current) {
                    toastCenter.current.show({
                        severity: 'info',
                        summary: 'Employee Details',
                        detail:
                        <div>
                        <ul>
                            <li>
                                Employee ID: {employee.EmployeeID}
                            </li>
                            <li>
                                Department: {employee.Department}
                            </li>
                            <li>
                                Age: {employee.Age}
                            </li>
                            <li>
                                DistanceFromHome: {employee.DistanceFromHome}
                            </li>
                            <li>
                                Gender: {employee.Gender}
                            </li>
                            <li>
                                JobSatisfaction: {employee.JobSatisfaction}
                            </li>
                            <li>
                                MonthlyIncom: {employee.MonthlyIncome}
                            </li>
                            <li>
                                OverTime: {employee.OverTime}
                            </li>
                            <li>
                                Shift: {employee.Shift}
                            </li>
                            <li>
                                Standard Hours: {employee.StandardHours}
                            </li>
                            <li>
                                Hours: {employee.Hours}
                            </li>
                        </ul>
                    </div>,
                        life: 5000
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching employee details:', error);
                if (toastCenter.current) {
                    toastCenter.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to fetch employee details. Please try again later.',
                        life: 5000
                    });
                }
            });
    };

    const showMessage = (employeeId: number) => {
        showEmployeeDetails(employeeId);
    };
    const deleteEmployee = (employeeId: number) => {
        const id = parseInt(employeeId.toString())
        EmployeeService.deleteById(id)
            .then(() => {
                // Log success message
                console.log('Employee deleted successfully');
                EmployeeService.getEmployees().then(data => setEmployees(data));
            })
            .catch((error) => {
                console.error('Error deleting employee:', error);
                if (toastCenter.current) {
                    toastCenter.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete employee. Please try again later.',
                        life: 5000
                    });
                }
            });
    };

    return (
        <>
        <h5>WORKING TODAY</h5>
            <DataTable value={employees} rows={5} paginator responsiveLayout="scroll">
                <Column field="EmployeeID" header="Employee" sortable style={{ width: '35%' }} />
                <Column field="Department" header="Department" sortable style={{ width: '35%' }} />
                <Column field="Shift" header="Shift" sortable style={{ width: '35%' }} body={(rowData) => rowData.Shift === 0 ? 'Day Shift' : 'Night Shift'}/>
                <Column
                    header="View"
                    style={{ width: '15%' }}
                    body={(employee) => (
                        <Button icon="pi pi-eye" rounded text raised severity="info" aria-label="View" onClick={() => showMessage(employee.EmployeeID)} />
                    )}
                />
            </DataTable>
            <Toast ref={toastCenter} position="top-center" />
        </>
    );
};
export default EmployeeTreeTable;
