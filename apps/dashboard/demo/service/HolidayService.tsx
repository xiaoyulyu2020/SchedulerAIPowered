import { Demo } from '@/types';

export const HolidayService = {
    getEndHolidayMessage() {
        return fetch('http://127.0.0.1:8000/home/holiday/end')
            .then((res) => res.text())
            .then((message: string) => message);
    },
}