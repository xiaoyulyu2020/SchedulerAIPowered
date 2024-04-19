/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            by
            <span className="font-medium ml-2">Schedule Assistant</span>
        </div>
    );
};

export default AppFooter;
