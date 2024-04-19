/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';

type InventoryStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

type Status = 'DELIVERED' | 'PENDING' | 'RETURNED' | 'CANCELLED';

export type LayoutType = 'list' | 'grid';
export type SortOrderType = 1 | 0 | -1;

export interface CustomEvent {
    name?: string;
    status?: 'Ordered' | 'Processing' | 'Shipped' | 'Delivered';
    date?: string;
    color?: string;
    icon?: string;
    image?: string;
}

interface ShowOptions {
    severity?: string;
    content?: string;
    summary?: string;
    detail?: string;
    life?: number;
}

export interface ChartDataState {
    barData?: ChartData;
    pieData?: ChartData;
    lineData?: ChartData;
    polarData?: ChartData;
    radarData?: ChartData;
}
export interface ChartOptionsState {
    barOptions?: ChartOptions;
    pieOptions?: ChartOptions;
    lineOptions?: ChartOptions;
    polarOptions?: ChartOptions;
    radarOptions?: ChartOptions;
}

export interface AppMailProps {
    mails: Demo.Mail[];
}

export interface AppMailSidebarItem {
    label: string;
    icon: string;
    to?: string;
    badge?: number;
    badgeValue?: number;
}

export interface AppMailReplyProps {
    content: Demo.Mail | null;
    hide: () => void;
}

declare namespace Demo {
    interface Task {
        id?: number;
        name?: string;
        description?: string;
        completed?: boolean;
        status?: string;
        comments?: string;
        attachments?: string;
        members?: Member[];
        startDate?: string;
        endDate?: string;
    }

    interface AgeRange {
        20: number;
        30: number;
        40: number;
        50: number;
        60: number;
    }

    interface EmployeeForm {
        employee: Demo.Employee;
        isVisible: boolean;
        onUpdate: () => void;
        onHide: () => void;
    }

    interface Sat {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    }
    interface Member {
        name: string;
        image: string;
    }

    interface DialogConfig {
        visible: boolean;
        header: string;
        newTask: boolean;
    }

    interface Mail {
        id: number;
        from: string;
        to: string;
        email: string;
        image: string;
        title: string;
        message: string;
        date: string;
        important: boolean;
        starred: boolean;
        trash: boolean;
        spam: boolean;
        archived: boolean;
        sent: boolean;
    }
    interface FilterData {
        thresholdDistance: number;
        thresholdRating: number;
        date: string;
    }


    interface User {
        id: number;
        name: string;
        image: string;
        status: string;
        messages: Message[];
        lastSeen: string;
    }

    interface Message {
        text: string;
        ownerId: number;
        createdAt: number;
    }

    //ProductService
    type Product = {
        id?: string;
        code?: string;
        name: string;
        description: string;
        image?: string;
        price?: number;
        category?: string;
        quantity?: number;
        inventoryStatus?: InventoryStatus;
        rating?: number;
        orders?: ProductOrder[];
        [key: string]: string | string[] | number | boolean | undefined | ProductOrder[] | InventoryStatus;
    };

    type Employee = {
        EmployeeID?: number;
        Age: number;
        Attrition: string;
        BusinessTravel: string;
        Department: string;
        DistanceFromHome: number;
        Education: number;
        EducationField: string;
        Gender: string;
        HourlyRate: number;
        JobLevel: number;
        JobRole: string;
        JobSatisfaction: number;
        MaritalStatus: string;
        MonthlyIncome: number;
        MonthlyRate: number;
        NumCompaniesWorked: number;
        //Over18: string;
        OverTime: string;
        PerformanceRating: number;
        StandardHours: number;
        TotalWorkingYears: number;
        TrainingTimesLastYear: number;
        WorkLifeBalance: number;
        YearsAtCompany: number;
        YearsInCurrentRole: number;
        YearsSinceLastPromotion: number;
        YearsWithCurrManager: number;
        Hours: number;
        Shift: string;
    };

    // IconService
    type Icon = {
        icon?: {
            paths?: string[];
            attrs?: [{}];
            isMulticolor?: boolean;
            isMulticolor2?: boolean;
            grid?: number;
            tags?: string[];
        };
        attrs?: [{}];
        properties?: {
            order?: number;
            id: number;
            name: string;
            prevSize?: number;
            code?: number;
        };
        setIdx?: number;
        setId?: number;
        iconIdx?: number;
    };

    // Calendar
    type ShiftData = {
        date: string;
        shift: number;
    };

    type NewShiftData = Record<string, ShiftData[]>;

    interface SchedulerEvent {
        id: string;
        startDate: Date;
        endDate: Date;
        title: string;
        bgColor: string;
        occupancy: number;
    }

    interface SchedulerResource {
        id: string;
        label: {
            title: string;
            subtitle: string;
        };
        data: SchedulerEvent[];
    }

    interface EmployeeShifts {
        [key: string]: {
            date: string;
            shift: number;
        }[];
    }

    interface DateMeta {
        year: number;
        month: number;
        day: number;
    }

    interface Shift {
        date: string;
        department: string;
        shift: number;
        employees: string[];
        subEmployees: string[];
    }

    interface Holiday {
        id: number;
        EmployeeID: number;
        StartDate: string;
        EndDate: string;
    }

    interface HolidayFormProps {
        holiday?: Holiday; // If provided, we're editing; if not, creating a new holiday.
        isVisible: boolean;
        onSave: () => void; // Callback to refresh the holiday list on save.
        onHide: () => void; // Callback to hide the form dialog.
    }

    interface EmployeeFormProps {
        employee?: Employee | null; // If provided, we're editing; if not, creating a new employee
        isVisible: boolean;
        onUpdate: () => void; // Callback to refresh the list on update
        onHide: () => void; // Callback to hide the form dialog
    }

    interface FilterContextType {
        filterDepartment: string;
        setFilterDepartment: (value: string) => void;
        searchEmployeeId: string;
        setSearchEmployeeId: (value: string) => void;
        filterShift: number;
        setFilterShift: (value: number) => void;
    }

    interface FilterProviderProps {
        children: ReactNode;
    }
}
