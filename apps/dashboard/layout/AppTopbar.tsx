/* eslint-disable @next/next/no-img-element */
import { Sidebar } from 'primereact/sidebar';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useFilters } from './context/filtercontext';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [visibleBottom, setVisibleBottom] = useState<boolean>(false);
    const { filterDepartment, setFilterDepartment, searchEmployeeId, setSearchEmployeeId, filterShift, setFilterShift } = useFilters();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between'}} >
                <Link href="/" className="layout-topbar-logo" style={{ width: 'fit-content' }}>
                    <span>Schedule Assistant</span>
                </Link>

                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars" />
                </button>
                <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                    <i className="pi pi-ellipsis-v" />
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ padding: '0.5rem' }}>
                    <InputText
                        value={searchEmployeeId}
                        onChange={(e) => setSearchEmployeeId(e.target.value)}
                        placeholder="Search by Employee"
                    />
                </div>
                <div style={{ padding: '0.5rem' }}>
                    <Dropdown
                        value={filterDepartment}
                        options={[{ label: 'Nursing', value: 'Nursing' }, { label: 'Care', value: 'Care' }]}
                        onChange={(e) => setFilterDepartment(e.value)}
                        placeholder="Filter by Department"
                        showClear
                    />
                </div>
                <div style={{ padding: '0.5rem' }}>
                    <Dropdown
                        value={filterShift}
                        options={[{ label: 'Day Shift', value: '0' }, { label: 'Night Shift', value: '1' }]}
                        onChange={(e) => setFilterShift(e.value)}
                        placeholder="Filter by Shift"
                        showClear
                    />
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
