import React, { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { HolidayService } from "../service/HolidayService";

const EndHolidayMessage: React.FC = () => {
    const [endHolidayMessage, setEndHolidayMessage] = useState<string>('');
    const toast = useRef<Toast>(null); 

    useEffect(() => {
        fetchEndHolidayMessage();
    }, []);

    const fetchEndHolidayMessage = async () => {
        try {
            const message = await HolidayService.getEndHolidayMessage();
            setEndHolidayMessage(message);
        } catch (error) {
            console.error('Error fetching end holiday message:', error);
        }
    };

    useEffect(() => {
        if (endHolidayMessage) {
            showEndHolidayToast(endHolidayMessage);
        }
    }, [endHolidayMessage]);

    const showEndHolidayToast = (message: string) => {
        toast.current?.show({ severity: 'info',summary: 'End Holiday Message', detail: message, life: 6000 });
    };

    return (
        <div>
            <Toast ref={toast} />
        </div>
    );
};

export default EndHolidayMessage;
