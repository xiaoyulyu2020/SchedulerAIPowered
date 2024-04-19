import React, { createContext, useContext, useState } from 'react';
import { Demo } from '@/types';

const defaultContextValue: Demo.FilterContextType = {
    filterDepartment: '',
    setFilterDepartment: () => {},
    searchEmployeeId: '',
    setSearchEmployeeId: () => {},
    filterShift: 0,
    setFilterShift: () => {}
};

const FilterContext = createContext<Demo.FilterContextType>(defaultContextValue);

export const useFilters = () => useContext(FilterContext);

export const FilterProvider: React.FC<Demo.FilterProviderProps> = ({ children }) => {
    const [filterDepartment, setFilterDepartment] = useState('');
    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [filterShift, setFilterShift] = useState(0);

    return (
        <FilterContext.Provider value={{
            filterDepartment,
            setFilterDepartment,
            searchEmployeeId,
            setSearchEmployeeId,
            filterShift,
            setFilterShift
        }}>
        {children}
        </FilterContext.Provider>
    );
};
