import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Demo } from '@/types';
import { Toast } from 'primereact/toast';
import EmployeeForm from './EmployeeForm';
import { useFilters } from '../../layout/context/filtercontext';

const EmployeeDataTable: React.FC = () => {
    const [employees, setEmployees] = useState<Demo.Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Demo.Employee | null>(null);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
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
                // Show toast message
                if (employee && toastCenter.current) {
                    toastCenter.current.show({
                        severity: 'info',
                        summary: 'Employee Profile',
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

    const showForm = (employeeId?: number) => {
        if (employeeId !== undefined) {
            const employee = employees.find(e => e.EmployeeID === employeeId);
            setSelectedEmployee(employee || null);
        } else {
            // For creating a new employee, pass null
            setSelectedEmployee(null);
        }
        setIsFormVisible(true);
    };

    const onUpdate = () => {
        EmployeeService.getEmployees().then(setEmployees);
        hideForm();
    };

    const hideForm = () => {
        setIsFormVisible(false);
        setSelectedEmployee(null);
    };

    const deleteEmployee = (employeeId: number) => {
        const id = parseInt(employeeId.toString())
        EmployeeService.deleteById(id)
            .then(() => {
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
            }
        );
    };

    return (
        <>
            <div className="p-d-flex p-ai-center p-jc-between" style={{ display:"flex", justifyContent: "space-between" }} >
                <h5>ALL EMPLOYEES</h5>
                <Button
                    label="Add New"
                    icon="pi pi-plus"
                    onClick={() => showForm()} // Passing no id creates a new employee
                />
            </div>
            <DataTable value={employees} rows={15} paginator responsiveLayout="scroll">
                <Column field="EmployeeID" header="Employee" sortable style={{ width: '20%' }} />
                <Column field="Department" header="Department" sortable style={{ width: '20%' }} />
                <Column field="Shift" header="Shift" sortable style={{ width: '30%' }} body={(rowData) => rowData.Shift === 0 ? 'Day Shift' : 'Night Shift'}/>
                <Column
                    header="View"
                    style={{ width: '10%' }}
                    body={(employee) => (
                        <Button icon="pi pi-eye" rounded text raised severity="info" aria-label="View" onClick={() => showMessage(employee.EmployeeID)} />
                    )}
                />
                <Column
                    header="Edit"
                    style={{ width: '10%' }}
                    body={(employee: Demo.Employee) => (
                        <Button icon="pi pi-pencil" rounded text raised severity="warning" aria-label="Edit" onClick={() => showForm(employee.EmployeeID)} />
                    )}
                />
                <Column
                    header="Delete"
                    style={{ width: '10%' }}
                    body={(employee) => (
                        <Button icon="pi pi-times" rounded text raised severity="danger" aria-label="Cancel" onClick={() => deleteEmployee(employee.EmployeeID)} />
                    )}
                />
            </DataTable>
            {isFormVisible && (
                <EmployeeForm
                    isVisible={isFormVisible}
                    employee={selectedEmployee} // Can be null or an existing employee
                    onUpdate={onUpdate}
                    onHide={hideForm}
                />
            )}
            <Toast ref={toastCenter} position="top-center" />
        </>
    );
};

export default EmployeeDataTable;
