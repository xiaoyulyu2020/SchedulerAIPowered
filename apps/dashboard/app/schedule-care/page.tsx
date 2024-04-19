'use client';
import React from 'react';
import CareCalendar from '../../demo/components/CalendarCare'
import '../../public/calendar-style.css';

// Care shift components
const SchedulesPage: React.FC = () => {
  return (
    <div className="grid">
        <div className="col-12"><CareCalendar /></div>
    </div>
  );
};

export default SchedulesPage;