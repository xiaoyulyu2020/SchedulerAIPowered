import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Demo } from '@/types';

const FilterForm: React.FC = () => {
    const [shifts, setShifts] = useState<Demo.Shift[]>([]);
    const [formData, setFormData] = useState({
        thresholdDistance: 100,
        thresholdRating: 5,
        dateRange: [new Date(), new Date()]
    });
    const [progress, setProgress] = useState(0);
    const [isInProgress, setIsInProgress] = useState(false);
    const toast = useRef<Toast>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: parseInt(value)
        }));
    };

    const handleDateChange = (e: any) => {
        setFormData(prevState => ({
            ...prevState,
            dateRange: e.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsInProgress(true); // Start of process
        const [start, end] = formData.dateRange;
        if (!start || !end) {
            toast.current?.show({ severity: 'error', summary: 'Missing Information', detail: 'Please select a date range.', life: 3000 });
            setIsInProgress(false); // End of process due to error
            return;
        }

        const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
        let processedDays = 0;

        for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
            const timezoneOffset = dt.getTimezoneOffset() * 60000;
            const localISOTime = new Date(dt.getTime() - timezoneOffset).toISOString().split('T')[0];
            const dailyFormData = { ...formData, date: localISOTime };

            try {
                await EmployeeService.filterEmployeesByDepartment(dailyFormData);
                processedDays++;
                setProgress(Math.round((processedDays / totalDays) * 100));
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to process data for ${localISOTime}.`, life: 3000 });
                console.error(`Error processing data for ${localISOTime}:`, error);
                setIsInProgress(false); // End of process due to error
                return;
            }
        }

        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'All dates processed successfully.', life: 3000 });
        setIsInProgress(false); // End of process
    };

    useEffect(() => {
        EmployeeService.getShift().then(setShifts);
    }, []);

    const dateTemplate = (dateMeta: Demo.DateMeta) => {
        // Map shifts to their dates
        const shiftDates = shifts.map(shift => shift.date);

        // Generate a date string using toLocaleDateString with 'en-CA' locale to ensure YYYY-MM-DD format
        const date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
        const dateStr = date.toLocaleDateString('en-CA');

        // Check if the generated date string is included in the shifts dates
        const hasShift = shiftDates.includes(dateStr);

        if (hasShift) {
            return (
                <div style={{
                    backgroundColor: '#1dcbb3',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    width: '2em',
                    height: '2em',
                    lineHeight: '2em',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {dateMeta.day}
                </div>
            );
        }
        return dateMeta.day;
    };

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={handleSubmit}>
                <div className="p-fluid">
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="thresholdDistance">Threshold Distance:</label>
                        </div>
                        <InputText
                            id="thresholdDistance"
                            name="thresholdDistance"
                            type="number"
                            value={formData.thresholdDistance.toString()}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="thresholdRating">Threshold Rating:</label>
                        </div>
                        <InputText
                            id="thresholdRating"
                            name="thresholdRating"
                            type="number"
                            value={formData.thresholdRating.toString()}
                            onChange={handleChange}
                            max="5"
                        />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="date">Date Range:</label>
                        </div>
                        <Calendar
                            id="date"
                            value={formData.dateRange}
                            onChange={handleDateChange}
                            selectionMode="range"
                            readOnlyInput
                            dateFormat="yy-mm-dd"
                            showIcon
                            showButtonBar
                            dateTemplate={dateTemplate}
                        />
                    </div>
                </div>
                <div style={{ paddingTop: '1rem' }}>
                    {isInProgress && (
                        <div>
                            <ProgressBar value={progress} showValue style={{ marginBottom: '0.5rem' }} />
                            <div style={{ textAlign: 'center' }}>{`Processing`}</div>
                        </div>
                    )}
                </div>
                <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <Button type="submit" label="Submit" style={{ width: '100%'}} />
                </div>
            </form>
            <Toast ref={toast} />
        </div>
    );
};

export default FilterForm;
