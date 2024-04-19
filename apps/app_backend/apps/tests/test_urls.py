from django.test import SimpleTestCase
from django.urls import reverse, resolve
from apps.views import *


class TestUrls(SimpleTestCase):
    ## employee URL Test
    def test_urls_employees(self):
        url = reverse("urls-employees")
        self.assertEqual(resolve(url).func, getAllEmployees)
        
    def test_urls_createEmployee(self):
        url = reverse("create-employee")
        self.assertEqual(resolve(url).func, createEmployee)
        
    def test_urls_getEmployeeByID(self):
        url = reverse("get-employee-by-id", args=[1077496])
        self.assertEqual(resolve(url).func, getEmployeeByID)
        
    def test_urls_deleteEmployeeByID(self):
        url = reverse("delete-employee-by-id", args=[1077496])
        self.assertEqual(resolve(url).func, deleteEmployeeByID)
        
    def test_urls_editEmployee(self):
        url = reverse("edit-employee", args=[1077496])
        self.assertEqual(resolve(url).func, editEmployee)
        
    def test_urls_addEmployee(self):
        url = reverse("add-employee-csv")
        self.assertEqual(resolve(url).func, addEmployee)
        
    def test_urls_getTotalNumberOfEmployees(self):
        url = reverse("getTotalNumberOfEmployees")
        self.assertEqual(resolve(url).func, getTotalNumberOfEmployees)
        
    def test_urls_averagePerformence(self):
        url = reverse("averagePerformence")
        self.assertEqual(resolve(url).func, averagePerformence)
        
    def test_urls_averageYears(self):
        url = reverse("averageYears")
        self.assertEqual(resolve(url).func, averageYears)
    ## AI URL Test
    def test_urls_predictDistancePerformance(self):
        url = reverse("predict-distance-performance")
        self.assertEqual(resolve(url).func, predictDistancePerformance)
        
    def test_urls_getDayAndNightShift(self):
        url = reverse("get-day-and-night-shift", args=[1])
        self.assertEqual(resolve(url).func, getDayAndNightShift)
        
    def test_urls_getFilterDepartment(self):
        url = reverse("get-filter-department")
        self.assertEqual(resolve(url).func, getFilterDepartment)
    ## Shift URL Test
    def test_urls_getAllShifts(self):
        url = reverse("get-all-shifts")
        self.assertEqual(resolve(url).func, getAllShifts)
        
    def test_urls_deleteShiftByDate(self):
        url = reverse("delete-shift-by-date")
        self.assertEqual(resolve(url).func, deleteShiftByDate)
        
    def test_urls_getTodayShifts(self):
        url = reverse("getTodayShifts")
        self.assertEqual(resolve(url).func, getTodayShifts)
        
    def test_urls_getEmployeeShift(self):
        url = reverse("getEmployeeShift")
        self.assertEqual(resolve(url).func, getEmployeeShift)
        
    def test_urls_deleteShift(self):
        url = reverse("deleteShift")
        self.assertEqual(resolve(url).func, deleteShift)
        
    def test_urls_getByDept(self):
        url = reverse("getByDept")
        self.assertEqual(resolve(url).func, getByDept)
        
    def test_urls_addEmployeeToShiftHandler(self):
        url = reverse("addEmployeeToShiftHandler")
        self.assertEqual(resolve(url).func, addEmployeeToShiftHandler)
    
    ## Holiday URL Test
    def test_urls_createHoliday(self):
        url = reverse("createHoliday")
        self.assertEqual(resolve(url).func, createHoliday)
    
    def test_urls_getHolidayByIDHandler(self):
        url = reverse("getHolidayByIDHandler", args=[1077496])
        self.assertEqual(resolve(url).func, getHolidayByIDHandler)
    
    def test_urls_deleteHolidayHandler(self):
        url = reverse("deleteHolidayHandler", args=[1077496])
        self.assertEqual(resolve(url).func, deleteHolidayHandler)
    
    def test_urls_editHolidayHandler(self):
        url = reverse("editHolidayHandler", args=[1077496])
        self.assertEqual(resolve(url).func, editHolidayHandler)
    
    def test_urls_getAllHoliday(self):
        url = reverse("getAllHoliday")
        self.assertEqual(resolve(url).func, getAllHoliday)
    
    def test_urls_endHolidayTodayHandler(self):
        url = reverse("endHolidayTodayHandler")
        self.assertEqual(resolve(url).func, endHolidayTodayHandler)