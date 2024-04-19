/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Menu',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                },
                {
                    label: 'Schedules',
                    icon: 'pi pi-fw pi-calendar-plus',
                    items: [
                        {
                            label: 'Nursing Schedule',
                            icon: 'pi pi-fw pi-calendar-plus',
                            to: '/schedule-nursing',
                        },
                        {
                            label: 'Care Schedule',
                            icon: 'pi pi-fw pi-calendar-plus',
                            to: '/schedule-care',
                        }
                    ]

                },
                {
                    label: 'Employees',
                    icon: 'pi pi-fw pi-users',
                    to: '/employee-info',
                },
                {
                    label: 'Holidays',
                    icon: 'pi pi-fw pi-clock',
                    to: '/holiday-info',
                },
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
