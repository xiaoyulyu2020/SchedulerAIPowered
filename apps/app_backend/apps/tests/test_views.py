from django.test import TestCase, Client
from django.urls import reverse
from apps.models import *
import json

class TestViews(TestCase):
    
    ## GET Test
    def test_get_getAllEmployees(self):
        client = Client()
        response = client.get(reverse("urls-employees"))
        self.assertEqual(response.status_code, 200)
        
    def test_get_getDayAndNightShift(self):
        client = Client()
        response = client.get(reverse("get-day-and-night-shift", args=[1]))
        self.assertEqual(response.status_code, 200)
        
    def test_get_getAllShifts(self):
        client = Client()
        response = client.get(reverse("get-all-shifts"))
        self.assertEqual(response.status_code, 200)
        
    def test_get_getTodayShifts(self):
        client = Client()
        response = client.get(reverse("getTodayShifts"))
        self.assertEqual(response.status_code, 200)
        
    def test_get_getEmployeeShift(self):
        client = Client()
        response = client.get(reverse("getEmployeeShift"))
        self.assertEqual(response.status_code, 200)
        
    def test_get_getAllHoliday(self):
        client = Client()
        response = client.get(reverse("getAllHoliday"))
        self.assertEqual(response.status_code, 200)

    ## Get by ID
    def test_get_getEmployeeByID(self):
        Employee.objects.create(
            EmployeeID=1,
            Age=30,
            Attrition="No",
            BusinessTravel="Travel_Frequently",
            Department="Care",
            DistanceFromHome=5,
            Education=4,
            EducationField="Life Sciences",
            Gender="Male",
            HourlyRate=75,
            JobLevel=1,
            JobRole="Other",
            JobSatisfaction=4,
            MaritalStatus="Divorced",
            MonthlyIncome=3761,
            MonthlyRate=2373,
            NumCompaniesWorked=9,
            OverTime="No",
            PerformanceRating=3,
            StandardHours=24,
            Shift=0,
            TotalWorkingYears=10,
            TrainingTimesLastYear=3,
            WorkLifeBalance=2,
            YearsAtCompany=5,
            YearsInCurrentRole=4,
            YearsSinceLastPromotion=0,
            YearsWithCurrManager=3,
            Hours=36
        )
        client = Client()
        response = client.get(reverse("get-employee-by-id", args=[1]))
        self.assertEqual(response.status_code, 200)
        
    ## Delete By ID
    def test_detele_deleteEmployeeByID(self):
        Employee.objects.create(
            EmployeeID=1,
            Age=30,
            Attrition="No",
            BusinessTravel="Travel_Frequently",
            Department="Care",
            DistanceFromHome=5,
            Education=4,
            EducationField="Life Sciences",
            Gender="Male",
            HourlyRate=75,
            JobLevel=1,
            JobRole="Other",
            JobSatisfaction=4,
            MaritalStatus="Divorced",
            MonthlyIncome=3761,
            MonthlyRate=2373,
            NumCompaniesWorked=9,
            OverTime="No",
            PerformanceRating=3,
            StandardHours=24,
            Shift=0,
            TotalWorkingYears=10,
            TrainingTimesLastYear=3,
            WorkLifeBalance=2,
            YearsAtCompany=5,
            YearsInCurrentRole=4,
            YearsSinceLastPromotion=0,
            YearsWithCurrManager=3,
            Hours=36
        )
        client = Client()
        response = client.delete(reverse("delete-employee-by-id", args=[1]))
        self.assertEqual(response.status_code, 200)