import React, { useState, useEffect } from 'react';
import { Demo } from '@/types';
import { Scheduler } from "@bitnoi.se/react-scheduler";
import "@bitnoi.se/react-scheduler/dist/style.css";
import { EmployeeService } from '../../demo/service/EmployeeService';

export default function NursingCalendar() {
    const [schedulerData, setSchedulerData] = useState<Demo.SchedulerResource[]>([]);

    const shiftStartEndTimes = {
        '0': { start: '08:00', end: '20:00' },
        '1': { start: '20:00', end: '08:00' }
    };

    const fetchSchedulerData = async () => {
        try {
            const shiftData: Demo.NewShiftData = await EmployeeService.getEmployeeShifts();
            console.log(shiftData);

            const today = new Date();
            // Calculate the difference to Monday (0 is Sunday, so we add 1)
            const dayOffset = today.getDay() === 0 ? 6 : today.getDay() - 1;
            const thisMonday = new Date(new Date(today).setDate(today.getDate() - dayOffset));
            thisMonday.setHours(0, 0, 0, 0); // Set to the start of the day

            const fetchPromises = Object.entries(shiftData).map(async ([employeeId, shifts]) => {
                if (shifts.length === 0) return null; // Skip employees with no shifts

                const employeeDetails = await EmployeeService.getEmployeeDetails(parseInt(employeeId));
                if (employeeDetails?.Department !== 'Care') return null; // Filter by department

                // Filter shifts to include only those on or after this Monday
                const filteredShifts = shifts.filter(shift => new Date(shift.date) >= thisMonday);

                const events = filteredShifts.map(shift => {
                    const times = shiftStartEndTimes[shift.shift.toString() as '0' | '1'];
                    if (!times) return null;
                    return {
                        id: `${employeeId}-${shift.date}-${shift.shift}`,
                        startDate: new Date(`${shift.date}T${times.start}:00.000Z`),
                        endDate: new Date(`${shift.date}T${times.end}:00.000Z`),
                        title: shift.shift === 0 ? '08:00 20:00' : '20:00 08:00',
                        bgColor: shift.shift === 0 ? 'rgb(145, 191, 238)' : 'rgb(28, 71, 115)',
                        occupancy: 0,
                    };
                }).filter(event => event !== null);
                return {
                    id: employeeId,
                    label: {
                        title: `Employee ${employeeId}`,
                        subtitle: employeeDetails.Department,
                    },
                    data: events,
                };
            });

            const results = await Promise.all(fetchPromises);
            setSchedulerData(results.filter(result => result !== null) as Demo.SchedulerResource[]);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchSchedulerData();
    }, []);

    return (
        <section>
            <Scheduler
                data={schedulerData}
                onRangeChange={(newRange) => console.log(newRange)}
                onTileClick={(clickedResource) => console.log(clickedResource)}
                onItemClick={(item) => console.log(item)}
                config={{
                    zoom: 1,
                    filterButtonState: -1,
                    maxRecordsPerPage: 10
                }}
            />
        </section>
    );
}
