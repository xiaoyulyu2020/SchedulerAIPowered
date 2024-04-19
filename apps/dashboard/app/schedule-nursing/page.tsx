'use client';
import React from 'react';
import NursingCalendar from '../../demo/components/CalendarNursing'
import '../../public/calendar-style.css';

// Nursing shift component
const NursingSchedulesPage: React.FC = () => {
  return (
    <div className="grid">
        <div className="col-12"><NursingCalendar /></div>
    </div>
  );
};

export default NursingSchedulesPage;