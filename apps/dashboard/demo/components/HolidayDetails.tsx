import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Toast } from 'primereact/toast';
import { Demo } from '@/types';
import HolidayForm from './HolidayForm';
import { useFilters } from '../../layout/context/filtercontext';

const HolidayDetails: React.FC = () => {
    const [holidays, setHolidays] = useState<Demo.Holiday[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentHoliday, setCurrentHoliday] = useState<Demo.Holiday | undefined>(undefined);
    const toast = useRef<Toast>(null);
    const { filterDepartment, searchEmployeeId, filterShift } = useFilters();

    useEffect(() => {
        EmployeeService.getHolidays().then(setHolidays).catch(error => handleError(error, 'Failed to fetch holidays. Please try again later.'));
    }, []);

    useEffect(() => {
        // fetch and filter employees
        EmployeeService.getEmployees().then(employees => {
            const filteredEmployees = employees.filter(emp =>
                (filterDepartment ? emp.Department === filterDepartment : true) &&
                (searchEmployeeId ? emp.EmployeeID?.toString().includes(searchEmployeeId) : true) &&
                (filterShift ? emp.Shift.toString() === filterShift.toString() : true)
            );

            // fetch holidays by passing employee IDs
            const employeeIds = filteredEmployees.map(emp => emp.EmployeeID);
            fetchHolidaysForEmployees(employeeIds);
        }).catch(error => console.error("Failed to fetch employees:", error));
    }, [filterDepartment, searchEmployeeId, filterShift]);

    const fetchHolidaysForEmployees = (employeeIds: (number | undefined)[]) => {
        // Filter out undefined values and ensure all IDs are numbers
        const validEmployeeIds: number[] = employeeIds.filter((id): id is number => id !== undefined);

        EmployeeService.getHolidays()
            .then(allHolidays => {
                // Filter holidays based on employee IDs
                const filteredHolidays = allHolidays.filter((holiday: Demo.Holiday) =>
                    validEmployeeIds.includes(holiday.EmployeeID)  // Assuming 'holiday.employeeId' is of type number
                );
                setHolidays(filteredHolidays);
            })
            .catch(error => {
                console.error("Failed to fetch holidays:", error);
                handleError(error, 'Failed to fetch holidays. Please try again later.');
            });
    };

    const showForm = async (holidayId?: number) => {
        if (holidayId) {
            try {
                const holidayDetails = await EmployeeService.getEmployeeHoliday(holidayId);
                setCurrentHoliday(holidayDetails);
            } catch (error) {
                handleError(error, 'Failed to fetch holiday details. Please try again later.');
            }
        } else {
            // If no holidayId is provided, we are creating a new holiday
            setCurrentHoliday(undefined);
        }
        setIsFormVisible(true);
    };

    const deleteHoliday = async (holidayId: number) => {
        try {
            await EmployeeService.deleteHoliday(holidayId);
            setHolidays(holidays.filter(holiday => holiday.id !== holidayId));
            toast.current?.show({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Holiday deleted successfully',
                life: 3000,
            });
        } catch (error) {
            handleError(error, 'Failed to delete holiday. Please try again later.');
        }
    };

    const handleError = (error: any, detail: string) => {
        console.error(error);
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail,
            life: 5000,
        });
    };

    const updateHolidays = () => {
        setIsFormVisible(false);
        EmployeeService.getHolidays().then(setHolidays).catch(error => handleError(error, 'Failed to update holidays. Please try again later.'));
    };

    return (
        <>
            <div className="p-d-flex p-ai-center p-jc-between" style={{ display:"flex", justifyContent: "space-between" }} >
                <h5>HOLIDAY DETAILS</h5>
                <Button
                    label="Add New"
                    icon="pi pi-plus"
                    onClick={() => showForm()} // Passing no id creates a new holiday
                />
            </div>
            <DataTable value={holidays} paginator rows={10} responsiveLayout="scroll">
                <Column field="EmployeeID" header="Employee" sortable></Column>
                <Column field="StartDate" header="Start Date" sortable></Column>
                <Column field="EndDate" header="End Date" sortable></Column>
                <Column
                    header="Edit"
                    body={(holiday: Demo.Holiday) => (
                        <Button icon="pi pi-pencil" rounded text raised severity="warning" aria-label="Edit" onClick={() => showForm(holiday.id)} />
                    )}
                />
                <Column
                    header="Delete"
                    body={(holiday: Demo.Holiday) => (
                        <Button icon="pi pi-times" rounded text raised severity="danger" aria-label="Delete" onClick={() => deleteHoliday(holiday.id)} />
                    )}
                />
            </DataTable>
            {isFormVisible && (
                <HolidayForm
                    holiday={currentHoliday}
                    isVisible={isFormVisible}
                    onHide={() => setIsFormVisible(false)}
                    onSave={updateHolidays}
                />
            )}
            <Toast ref={toast} position="top-center" />
        </>
    );
};

export default HolidayDetails;
