from django.db import models
from .utils import *

class Employee(models.Model):
    EmployeeID = models.IntegerField(primary_key=True)
    Age = models.IntegerField()
    Attrition = models.CharField(max_length=3)
    BusinessTravel = models.CharField(max_length=50)
    Department = models.CharField(max_length=50, choices=drop_down_select_departments)
    DistanceFromHome = models.IntegerField()
    Education = models.IntegerField()
    EducationField = models.CharField(max_length=50)
    Gender = models.CharField(max_length=50, choices=drop_down_select_genders)
    HourlyRate = models.IntegerField()
    JobLevel = models.IntegerField()
    JobRole =  models.CharField(max_length=50, choices=drop_down_select_jobRoles)#dropdown function
    JobSatisfaction =  models.IntegerField() #dropdown function
    MaritalStatus =  models.CharField(max_length=50, choices=drop_down_select_maritalStatus)#dropdown
    MonthlyIncome = models.IntegerField()
    MonthlyRate = models.IntegerField()
    NumCompaniesWorked = models.IntegerField()
    OverTime = models.CharField(max_length=3)
    PerformanceRating = models.IntegerField()
    StandardHours = models.IntegerField()
    Shift =  models.IntegerField()
    TotalWorkingYears = models.IntegerField()
    TrainingTimesLastYear = models.IntegerField()
    WorkLifeBalance = models.IntegerField()
    YearsAtCompany = models.IntegerField()
    YearsInCurrentRole = models.IntegerField()
    YearsSinceLastPromotion = models.IntegerField()
    YearsWithCurrManager = models.IntegerField()
    Hours = models.IntegerField()

    def __str__(self):
        return str(self.EmployeeID)

class Date(models.Model):
    Date = models.DateField(unique=True)

    def __str__(self):
        return str(self.date)

class ScheduleHistory(models.Model):
    Date = models.ForeignKey(Date, on_delete=models.CASCADE)
    Department = models.CharField(max_length=50)
    Shift = models.IntegerField()
    EmployeeList = models.ManyToManyField(Employee, related_name='schedule_history')
    SubEmployeeList = models.ManyToManyField(Employee, related_name='sub_schedule_history')

    def __str__(self):
        return f"{self.date} - {self.shift} - {self.employee}"
    
class InHoliday(models.Model):
    EmployeeID = models.IntegerField()
    StartDate = models.DateField()
    EndDate = models.DateField()
    
    def __str__(self):
        return f"{self.EmployeeID} - {self.StartDate} - {self.EndDate}"