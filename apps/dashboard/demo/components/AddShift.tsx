import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Demo } from '@/types';

const AddShift: React.FC = () => {
    const [employeeShiftData, setEmployeeShiftData] = useState<Demo.EmployeeShifts>({});
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchShifts = async () => {
            const data = await EmployeeService.getEmployeeShifts();
            setEmployeeShiftData(data);
        };
        fetchShifts();
    }, []);

    const employeeOptions = Object.entries(employeeShiftData).map(([id]) => ({
        label: `Employee ${id}`,
        value: id,
    }));

    const dateTemplate = (dateMeta: Demo.DateMeta) => {
        const shiftsForSelectedEmployee = selectedEmployeeId ? employeeShiftData[selectedEmployeeId] : [];

        // Create a Date object for comparison that's correctly offset for the local time zone
        const comparisonDate = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
        const localDateStr = comparisonDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format

        const shiftForDate = shiftsForSelectedEmployee.find(shift => shift.date === localDateStr);
        const color = shiftForDate ? (shiftForDate.shift === 0 ? '#91bfee' : '#1c4773') : null;

        if (color) {
            return (
                <div style={{backgroundColor: color, color: '#ffffff', fontWeight: 'bold', borderRadius: '50%', width: '2em', height: '2em', lineHeight: '2em', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {dateMeta.day}
                </div>
            );
        }
        return dateMeta.day;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployeeId || selectedDates.length === 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please select both employee and dates.' });
            return;
        }

        for (const date of selectedDates) {
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString().split('T')[0];

            try {
                await EmployeeService.addShift(localISOTime, selectedEmployeeId);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add shift for ${localISOTime}.` });
                console.error('Error adding shift:', error);
                return;
            }
        }

        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Shift(s) added successfully.' });
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-field">
                    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                        <label htmlFor="employeeId">Employee</label>
                    </div>
                    <Dropdown id="employeeId" value={selectedEmployeeId} options={employeeOptions} onChange={(e) => setSelectedEmployeeId(e.value)} placeholder="Select an Employee" filter filterBy="label" showClear filterPlaceholder="Search Employee" />
                </div>
                <div className="p-field">
                    <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                        <label htmlFor="date">Date</label>
                    </div>
                    <Calendar
                        id="date"
                        value={selectedDates}
                        onChange={(e) => setSelectedDates(e.value || [])} // Provide a fallback empty array
                        dateFormat="yy-mm-dd"
                        readOnlyInput
                        showIcon
                        showButtonBar
                        dateTemplate={dateTemplate}
                        selectionMode="multiple"
                    />
                </div>
                <div style={{ paddingTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                    <Button type="submit" label="Add Shift"/>
                </div>
            </form>
            <Toast ref={toast} />
        </div>
    );
};

export default AddShift;
