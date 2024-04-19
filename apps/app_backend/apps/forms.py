from django import forms
from .models import *

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = "__all__"
        
    def save(self, commit=True):
        employee = super(EmployeeForm, self).save(commit=False)
        if commit:
            employee.save()
        return employee

class ScheduleHistoryForm(forms.ModelForm):
    class Meta:
        model = ScheduleHistory
        fields = ['Date', 'Shift', 'EmployeeList']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'})
        }

    def save(self, commit=True):
        schedule = super(ScheduleHistoryForm, self).save(commit=False)
        if commit:
            schedule.save()
            
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class InHolidayForm(forms.ModelForm):
    class Meta:
        model = InHoliday
        fields = ['StartDate', 'EndDate', 'EmployeeID']
        widgets = {
            'StartDate': forms.DateInput(attrs={'type': 'date'}),
            'EndDate': forms.DateInput(attrs={'type': 'date'})
        }

    def save(self, commit=True):
        inHoliday = super(InHolidayForm, self).save(commit=False)
        if commit:
            inHoliday.save()
            
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)