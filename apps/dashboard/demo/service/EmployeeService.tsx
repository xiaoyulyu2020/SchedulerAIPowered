import { Demo } from '@/types';

export const EmployeeService = {
    getEmployees() {
        return fetch('http://127.0.0.1:8000/home/employees')
            .then((res) => res.json())
            .then((data) => Array.isArray(data) ? data : data.data)
            .then((employees: Demo.Employee[]) => employees);
    },

    getAgeRange() {
        return fetch('http://127.0.0.1:8000/home/employees/ageRangeHandler')
            .then((res) => res.json())
            .then((age: Demo.AgeRange[]) => {
                return age});
    },

    getSatRange() {
        return fetch('http://127.0.0.1:8000/home/employees/getSatRangeHandler')
            .then((res) => res.json())
            .then((sat: Demo.Sat[]) => {
                console.log("final data:", sat)
                return sat});
    },

    getTodayEmployees() {
        return fetch('http://127.0.0.1:8000/home/shifts/today')
            .then((res) => res.json())
            .then((data) => Array.isArray(data) ? data : data.data)
            .then((employees: Demo.Employee[]) => employees);
    },

    countEmployees(){
        return fetch('http://127.0.0.1:8000/home/employees/count')
            .then((res) => res.text())
            .then((count: string) => parseInt(count));
    },

    averageSalary(){
        return fetch('http://127.0.0.1:8000/home/employees/getAverageSalaryHandler')
            .then((res) => res.text())
            .then((count: string) => parseInt(count));
    },

    getEmployeeDetails(id: number): Promise<Demo.Employee | null> {
        return fetch(`http://127.0.0.1:8000/home/employees/${id}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            console.log(data); // Log the data for debugging
            return data as Demo.Employee; // Return the modified data
        })
        .catch((error) => {
            console.error('Error fetching employee details:', error);
            return null;
        });
    },

    deleteById(id: number): Promise<void> {
        const url = `http://127.0.0.1:8000/home/employees/delete/${id}`;
        return fetch(url, {
            method: 'DELETE',
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch((error) => {
            console.error('Error deleting employee:', error);
            throw error;
        });
    },

    getShift() {
        return fetch('http://127.0.0.1:8000/home/shifts')
        .then((res) => res.json())
        .then((data) => Array.isArray(data) ? data : data.data)
    },

    getEmployeeShifts: async (): Promise<Demo.NewShiftData> => {
        try {
            const response = await fetch('http://127.0.0.1:8000/home/shifts/employeeShift');
            if (!response.ok) throw new Error('Failed to fetch shifts');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    getPerformence() {
        return fetch('http://127.0.0.1:8000/home/employees/avePer')
        .then((res) => res.text())
        .then((count: string) => parseInt(count));
    },
    getYears() {
        return fetch('http://127.0.0.1:8000/home/employees/aveYear')
        .then((res) => res.text())
        .then((count: string) => parseInt(count));
    },

    filterEmployeesByDepartment(data: Demo.FilterData) {
        console.log
        const url = 'http://127.0.0.1:8000/home/DT/getFilterDepartment';
        const options = {
            method: 'POST',
            body: JSON.stringify(data)
        };

        return fetch(url, options)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.text();
            })
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error('Error filtering employees by department:', error);
                throw error;
            });
    },

    createEmployee: async (employee: Demo.Employee) => {
        const response = await fetch('http://127.0.0.1:8000/home/employees/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    updateEmployee(employee: Demo.Employee): Promise<string> {
        console.log(JSON.stringify(employee));
        const url = `http://127.0.0.1:8000/home/employees/edit/${employee.EmployeeID}`;
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee) // Pass the entire employee object in the body
        })
        .then(res => {
            if (res.ok) {
                console.log(res);
                return res.text().then(text => text);
            } else {
                throw new Error('Invalid inputs');
            }
        })
        .catch((error: any) => {
            console.error('Error updating employee:', error);
            throw error; // Rethrow to be caught by the caller
        });
    },

    deleteShift: async (date: string, employeeID: string): Promise<any> => {
        const url = `http://127.0.0.1:8000/home/shifts/deleteShift`;
        const body = { date, employeeID };
        console.log(body);
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Shift deletion failed');
            return await response.json();
        } catch (error) {
            console.error('Error removing shift:', error);
            throw error; // Re-throw to catch in the component
        }
    },

    addShift: async (date: string, employeeID: string): Promise<any> => {
        const url = `http://127.0.0.1:8000/home/shifts/addEmployeeToShift`;
        const body = { date, employeeID };
        console.log(body);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Shift addition failed');
            return await response.json();
        } catch (error) {
            console.error('Error adding shift:', error);
            throw error; // Re-throw to catch in the component
        }
    },

    getHolidays: async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/home/holiday/all');
            if (!response.ok) {
                throw new Error('Failed to fetch holidays');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching holidays:', error);
            throw error;
        }
    },

    getEmployeeHoliday: async (holidayId: number): Promise<any> => {
        const url = `http://127.0.0.1:8000/home/holiday/getHoliday/${holidayId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch holiday details');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching holiday details:', error);
            throw error; // Re-throw to be handled in the component
        }
    },

    deleteHoliday: async (holidayId: number): Promise<any> => {
        const url = `http://127.0.0.1:8000/home/holiday/delete/${holidayId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Holiday deletion failed');
            }
            return await response.json(); // Assuming the backend sends a confirmation response
        } catch (error) {
            console.error('Error deleting holiday:', error);
            throw error; // Re-throw to be handled in the component
        }
    },

    createHoliday: async (holiday: Demo.Holiday) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/home/holiday/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(holiday),
            });
            if (!response.ok) {
                throw new Error('Failed to create holiday');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating holiday:', error);
            throw error;
        }
    },

    editHoliday: async (holidayId: number, holidayData: Demo.Holiday): Promise<any> => {
        const url = `http://127.0.0.1:8000/home/holiday/edit/${holidayId}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(holidayData),
            });
            if (!response.ok) {
                throw new Error('Holiday update failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating holiday:', error);
            throw error; // Re-throw to be handled in the component
        }
    },

};
