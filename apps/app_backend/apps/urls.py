from django.urls import path
from . import views
urlpatterns = [
    path('', views.home, name="urls-home"),
    ## Employee URL
    path('employees', views.getAllEmployees, name="urls-employees"),
    path('employees/create', views.createEmployee, name="create-employee"),
    path('employees/<int:id>', views.getEmployeeByID, name='get-employee-by-id'),
    path('employees/delete/<int:id>', views.deleteEmployeeByID, name='delete-employee-by-id'),
    path('employees/edit/<int:id>', views.editEmployee, name='edit-employee'),
    path('employees/addEmployee', views.addEmployee, name='add-employee-csv'),
    path('employees/count', views.getTotalNumberOfEmployees, name='getTotalNumberOfEmployees'),
    path('employees/avePer', views.averagePerformence, name='averagePerformence'),
    path('employees/aveYear', views.averageYears, name='averageYears'),
    
    path('employees/ageRangeHandler', views.ageRangeHandler, name='ageRangeHandler'),
    path('employees/getSatRangeHandler', views.getSatRangeHandler, name='getSatRangeHandler'),
    path('employees/getAverageSalaryHandler', views.getAverageSalaryHandler, name='getAverageSalaryHandler'),

    ## AI URL
    path('DT/distancePerformance', views.predictDistancePerformance, name="predict-distance-performance"),
    path('DT/getShift/<int:id>', views.getDayAndNightShift, name='get-day-and-night-shift'),
    path('DT/getFilterDepartment', views.getFilterDepartment, name='get-filter-department'),

    ## Shifts URL
    path('shifts', views.getAllShifts, name="get-all-shifts"),
    path('shifts/delete', views.deleteShiftByDate, name="delete-shift-by-date"),
    path('shifts/today', views.getTodayShifts, name="getTodayShifts"),
    path('shifts/employeeShift', views.getEmployeeShift, name="getEmployeeShift"),
    path('shifts/deleteShift', views.deleteShift, name="deleteShift"),
    path('test/getByDept', views.getByDept, name="getByDept"),
    path('shifts/addEmployeeToShift', views.addEmployeeToShiftHandler, name="addEmployeeToShiftHandler"),

    ## Holiday URL
    path('holiday/create', views.createHoliday, name="createHoliday"),
    path('holiday/getHoliday/<int:id>', views.getHolidayByIDHandler, name="getHolidayByIDHandler"),
    path('holiday/delete/<int:id>', views.deleteHolidayHandler, name="deleteHolidayHandler"),
    path('holiday/edit/<int:id>', views.editHolidayHandler, name="editHolidayHandler"),
    path('holiday/all', views.getAllHoliday, name="getAllHoliday"),

    ## endHoliday URL
    path('holiday/end', views.endHolidayTodayHandler, name="endHolidayTodayHandler"),

]
