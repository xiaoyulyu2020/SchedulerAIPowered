import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Demo } from '@/types';

const HolidayForm: React.FC<Demo.HolidayFormProps> = ({ holiday, isVisible, onSave, onHide }) => {
    const [employees, setEmployees] = useState<Demo.Employee[]>([]);
    const [holidayDetails, setHolidayDetails] = useState<Demo.Holiday | { EmployeeID: number; StartDate: string; EndDate: string; }>(
        holiday || { EmployeeID: 0, StartDate: '', EndDate: '' }
    );
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (!holiday) {
            EmployeeService.getEmployees().then(setEmployees).catch(console.error);
        }
    }, [holiday]);

    const handleInputChange = (name: keyof typeof holidayDetails, value: any) => {
        setHolidayDetails(prev => ({
            ...prev,
            [name]: name === 'EmployeeID' ? parseInt(value, 10) : value,
        }));
    };

    const saveHoliday = async () => {
        try {
            // Check if we're editing (holiday has an id) or creating a new holiday
            if ('id' in holidayDetails) {
                // Editing existing holiday
                await EmployeeService.editHoliday(holidayDetails.id, holidayDetails);
            } else {
                // Creating new holiday
                await EmployeeService.createHoliday(holidayDetails as Demo.Holiday);
            }

            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Holiday ${holiday ? 'updated' : 'created'} successfully.` });
            setTimeout(() => {
                onSave();
                onHide();
            }, 2000);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save holiday. Please try again.' });
        }
    };

    const handleDateChange = (name: keyof typeof holidayDetails, value: string | Date | Date[] | null | undefined) => {
        if (value === null || value === undefined) {
            // Handle null or undefined value
            setHolidayDetails(prev => ({ ...prev, [name]: '' }));
            return;
        }

        let dateValue: Date;

        if (typeof value === "string") {
            // If the value is a string, convert it to a Date object
            dateValue = new Date(value);
        } else if (Array.isArray(value)) {
            // If the value is an array, use the first item and ensure it's a Date object
            dateValue = value[0] instanceof Date ? value[0] : new Date(value[0]);
        } else {
            // Otherwise, the value is a Date object
            dateValue = value;
        }

        // Adjust for timezone
        const offset = dateValue.getTimezoneOffset();
        const adjustedDate = new Date(dateValue.getTime() - offset * 60000);
        const isoDate = adjustedDate.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD' format

        setHolidayDetails(prev => ({ ...prev, [name]: isoDate }));
    };

    const dialogFooter = (
        <React.Fragment>
            <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                <Button label="Save" icon="pi pi-check" onClick={saveHoliday} autoFocus style={{ marginRight: '1rem' }} />
                <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
            </div>
        </React.Fragment>
    );

    return (
        <>
            <Dialog header="Holiday Details" visible={isVisible} style={{ width: '50vw' }} footer={dialogFooter} onHide={onHide}>
                <div className="p-fluid">
                    <div className="p-field">
                        <React.Fragment>
                            <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                                <label htmlFor="EmployeeID">Employee ID</label>
                            </div>
                            {holiday ? (
                                <InputText id="EmployeeID" value={holidayDetails.EmployeeID.toString()} disabled />
                            ) : (
                                <Dropdown
                                    id="EmployeeID"
                                    value={holidayDetails.EmployeeID}
                                    options={employees.map(e => ({ label: e.EmployeeID?.toString(), value: e.EmployeeID }))}
                                    onChange={(e) => handleInputChange('EmployeeID', e.value)}
                                    placeholder="Select an Employee"
                                    filter
                                    filterBy="label"
                                    filterPlaceholder="Search Employee"
                                    showClear
                                />
                            )}
                        </React.Fragment>
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="StartDate">Start Date</label>
                        </div>
                        <Calendar
                            id="StartDate"
                            value={holidayDetails.StartDate ? new Date(holidayDetails.StartDate) : null}
                            onSelect={(e) => handleDateChange('StartDate', e.value)}
                            showIcon
                            dateFormat="yy-mm-dd"
                        />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="EndDate">End Date</label>
                        </div>
                        <Calendar
                            id="EndDate"
                            value={holidayDetails.EndDate ? new Date(holidayDetails.EndDate) : null}
                            onSelect={(e) => handleDateChange('EndDate', e.value)}
                            showIcon
                            dateFormat="yy-mm-dd"
                        />
                    </div>
                </div>
            </Dialog>
            <Toast ref={toast} />
        </>
    );
};

export default HolidayForm;
