import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { EmployeeService } from '../../demo/service/EmployeeService';
import { Demo } from '@/types';
import { Dropdown } from 'primereact/dropdown';


const EmployeeForm: React.FC<Demo.EmployeeFormProps> = ({ employee, isVisible, onUpdate, onHide }) => {
    const emptyEmployeeTemplate: Demo.Employee = {
        EmployeeID: undefined, // or another appropriate default value or leave it undefined
        Age: 0,
        Attrition: '',
        BusinessTravel: '',
        Department: '',
        DistanceFromHome: 0,
        Education: 1,
        EducationField: '',
        Gender: '',
        HourlyRate: 0,
        JobLevel: 1,
        JobRole: '',
        JobSatisfaction: 1,
        MaritalStatus: '',
        MonthlyIncome: 0,
        MonthlyRate: 0,
        NumCompaniesWorked: 0,
        OverTime: '',
        PerformanceRating: 1,
        StandardHours: 40,
        Shift: '',
        TotalWorkingYears: 0,
        TrainingTimesLastYear: 0,
        WorkLifeBalance: 1,
        YearsAtCompany: 0,
        YearsInCurrentRole: 0,
        YearsSinceLastPromotion: 0,
        YearsWithCurrManager: 0,
        Hours: 0
    };

    // Using employee if it exists, otherwise use the empty template
    const [employeeData, setEmployeeData] = useState<Demo.Employee>(employee || emptyEmployeeTemplate);
    const toastRef = useRef<Toast>(null);

    // Update state when the passed employee prop changes, for example when switching between edit forms
    useEffect(() => {
        setEmployeeData(employee || emptyEmployeeTemplate);
    }, [employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Demo.Employee) => {
        const { value } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [field]: field === 'EmployeeID' || field === 'Age' || field.includes('Year') || field.includes('Rate') || field === 'JobLevel' || field === 'Education' || field === 'Shift' ? parseInt(value) || 0 : value
        }));
    };

    const saveEmployee = async () => {
        try {
            // Check if we're editing (employee has a valid EmployeeID) or creating a new employee
            if (!employee) {
                await EmployeeService.createEmployee(employeeData); // Create new employee
            } else {
                await EmployeeService.updateEmployee(employeeData); // Update existing employee
            }

            toastRef.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: `Employee ${!employee ? 'created' : 'updated'} successfully.`,
                life: 3000,
            });

            // Refresh data
            setTimeout(() => {
                onUpdate();
                onHide();
            }, 3000);

        } catch (error) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save employee. Please try again.',
                life: 5000,
            });
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Save" icon="pi pi-check" onClick={saveEmployee} autoFocus />
            <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        </div>
    );

    return (
        <>
            <Dialog header={`${employee ? 'Edit Employee Details' : 'Add New Employee'}`} visible={isVisible} style={{ width: '50vw' }} footer={dialogFooter} onHide={onHide}>
                <div className="p-fluid">
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="EmployeeID">Employee ID (Numbers Only)</label>
                        </div>
                        <InputText
                            id="EmployeeID"
                            value={employeeData.EmployeeID ? employeeData.EmployeeID.toString() : ''}
                            onChange={(e) => handleChange(e, 'EmployeeID')}
                            disabled={!!employee}
                        />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="Age">Age</label>
                        </div>
                        <InputText id="Age" value={employeeData.Age.toString()} onChange={(e) => handleChange(e, 'Age')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="Attrition">Attrition</label>
                        </div>
                        <Dropdown id="Attrition" value={employeeData.Attrition} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} onChange={(e) => setEmployeeData({ ...employeeData, Attrition: e.value })} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="BusinessTravel">Business Travel</label>
                        </div>
                        <Dropdown id="BusinessTravel" value={employeeData.BusinessTravel} options={[{ label: 'Travel Frequently', value: 'Travel_Frequently' }, { label: 'Travel Rarely', value: 'Travel_Rarely' }, { label: 'Non-Travel', value: 'Non-Travel' }]} onChange={(e) => setEmployeeData({ ...employeeData, BusinessTravel: e.value })} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="Department">Department</label>
                        </div>
                        <Dropdown id="Department" value={employeeData.Department} options={[{ label: 'Nursing', value: 'Nursing' }, { label: 'Care', value: 'Care' }]} onChange={(e) => setEmployeeData({ ...employeeData, Department: e.value })} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="DistanceFromHome">Distance From Home (Whole Number)</label>
                        </div>
                        <InputText id="DistanceFromHome" value={employeeData.DistanceFromHome.toString()} onChange={(e) => handleChange(e, 'DistanceFromHome')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="Education">Education (1-5)</label>
                        </div>
                        <InputText id="Education" value={employeeData.Education.toString()} onChange={(e) => handleChange(e, 'Education')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="EducationField">Education Field</label>
                        </div>
                        <Dropdown id="EducationField" value={employeeData.EducationField} options={[
                            { label: 'Life Sciences', value: 'Life Sciences' },
                            { label: 'Medical', value: 'Medical' },
                            { label: 'Technical Degree', value: 'Technical Degree' },
                            { label: 'Marketing', value: 'Marketing' },
                            { label: 'Other', value: 'Other' },
                            { label: 'Human Resources', value: 'Human Resources' }
                        ]} onChange={(e) => setEmployeeData({ ...employeeData, EducationField: e.value })} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="Gender">Gender</label>
                        </div>
                        <Dropdown id="Gender" value={employeeData.Gender} options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' }
                        ]} onChange={(e) => setEmployeeData({ ...employeeData, Gender: e.value })} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="HourlyRate">Hourly Rate (Whole Number)</label>
                        </div>
                        <InputText id="HourlyRate" value={employeeData.HourlyRate.toString()} onChange={(e) => handleChange(e, 'HourlyRate')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="JobLevel">Job Level (1-5)</label>
                        </div>
                        <InputText id="JobLevel" value={employeeData.JobLevel.toString()} onChange={(e) => handleChange(e, 'JobLevel')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="JobRole">Job Role</label>
                        </div>
                        <Dropdown id="JobRole" value={employeeData.JobRole} options={[
                            { label: 'Nurse', value: 'Nurse' },
                            { label: 'Care', value: 'Care' }
                        ]} onChange={(e) => setEmployeeData({ ...employeeData, JobRole: e.value })} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="JobSatisfaction">Job Satisfaction (1-5)</label>
                        </div>
                        <InputText id="JobSatisfaction" value={employeeData.JobSatisfaction.toString()} onChange={(e) => handleChange(e, 'JobSatisfaction')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="MaritalStatus">Marital Status</label>
                        </div>
                        <Dropdown id="MaritalStatus" value={employeeData.MaritalStatus} options={[
                            { label: 'Married', value: 'Married' },
                            { label: 'Single', value: 'Single' },
                            { label: 'Divorced', value: 'Divorced' }
                        ]} onChange={(e) => setEmployeeData({ ...employeeData, MaritalStatus: e.value })} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="MonthlyIncome">Monthly Income (Whole Number)</label>
                        </div>
                        <InputText id="MonthlyIncome" value={employeeData.MonthlyIncome.toString()} onChange={(e) => handleChange(e, 'MonthlyIncome')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="MonthlyRate">Monthly Rate (Whole Number)</label>
                        </div>
                        <InputText id="MonthlyRate" value={employeeData.MonthlyRate.toString()} onChange={(e) => handleChange(e, 'MonthlyRate')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="NumCompaniesWorked">Number of Companies Worked  (Whole Number)</label>
                        </div>
                        <InputText id="NumCompaniesWorked" value={employeeData.NumCompaniesWorked.toString()} onChange={(e) => handleChange(e, 'NumCompaniesWorked')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="OverTime">Over Time</label>
                        </div>
                        <Dropdown id="OverTime" value={employeeData.OverTime} options={[
                            { label: 'Yes', value: 'Yes' },
                            { label: 'No', value: 'No' }
                        ]} onChange={(e) => setEmployeeData({ ...employeeData, OverTime: e.value })} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="PerformanceRating">Performance Rating (1-5)</label>
                        </div>
                        <InputText id="PerformanceRating" value={employeeData.PerformanceRating.toString()} onChange={(e) => handleChange(e, 'PerformanceRating')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="StandardHours">Standard Hours (Whole Number)</label>
                        </div>
                        <InputText id="StandardHours" value={employeeData.StandardHours.toString()} onChange={(e) => handleChange(e, 'StandardHours')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="TotalWorkingYears">Total Working Years (Whole Number)</label>
                        </div>
                        <InputText id="TotalWorkingYears" value={employeeData.TotalWorkingYears.toString()} onChange={(e) => handleChange(e, 'TotalWorkingYears')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="TrainingTimesLastYear">Training Times Last Year (Whole Number)</label>
                        </div>
                        <InputText id="TrainingTimesLastYear" value={employeeData.TrainingTimesLastYear.toString()} onChange={(e) => handleChange(e, 'TrainingTimesLastYear')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="WorkLifeBalance">Work Life Balance (1-5)</label>
                        </div>
                        <InputText id="WorkLifeBalance" value={employeeData.WorkLifeBalance.toString()} onChange={(e) => handleChange(e, 'WorkLifeBalance')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="YearsAtCompany">Years At Company (Whole Number)</label>
                        </div>
                        <InputText id="YearsAtCompany" value={employeeData.YearsAtCompany.toString()} onChange={(e) => handleChange(e, 'YearsAtCompany')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="YearsInCurrentRole">Years In Current Role (Whole Number)</label>
                        </div>
                        <InputText id="YearsInCurrentRole" value={employeeData.YearsInCurrentRole.toString()} onChange={(e) => handleChange(e, 'YearsInCurrentRole')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="YearsSinceLastPromotion">Years Since Last Promotion (Whole Number)</label>
                        </div>
                        <InputText id="YearsSinceLastPromotion" value={employeeData.YearsSinceLastPromotion.toString()} onChange={(e) => handleChange(e, 'YearsSinceLastPromotion')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="YearsWithCurrManager">Years With Current Manager (Whole Number)</label>
                        </div>
                        <InputText id="YearsWithCurrManager" value={employeeData.YearsWithCurrManager.toString()} onChange={(e) => handleChange(e, 'YearsWithCurrManager')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="Hours">Hours (Whole Number)</label>
                        </div>
                        <InputText id="Hours" value={employeeData.Hours.toString()} onChange={(e) => handleChange(e, 'Hours')} />
                    </div>
                    <div className="p-field">
                        <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <label htmlFor="Shift">Shift</label>
                        </div>
                        <Dropdown id="Shift" value={employeeData.Shift} options={[
                            { label: 'Day Shift', value: 0 },
                            { label: 'Night Shift', value: 1 }
                        ]} onChange={(e) => setEmployeeData({ ...employeeData, Shift: e.value })} />
                    </div>
                </div>
            </Dialog>
            <Toast ref={toastRef} position="top-center" />
        </>
    );
};

export default EmployeeForm;
