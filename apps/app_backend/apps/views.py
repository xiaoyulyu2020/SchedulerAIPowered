from django.shortcuts import render
from .models import *
from .serializers import *
from .forms import *
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .decision_tree import *
from .predictedData import *
from .utils import *
from datetime import datetime, timedelta
from collections import defaultdict
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

def home(request):
    return render(request, 'home.html')

def getEmployeeByIdFunctional(id):
        employee = Employee.objects.get(pk = id)
        serializers = EmployeeSerializer(employee)
        return serializers.data

def updateEmployeeByID(id, newEmployeeData):
    try:
        employee = Employee.objects.get(pk = id)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status = 404)
    serializer = EmployeeSerializer(employee, data=newEmployeeData)
    if serializer.is_valid():
        serializer.save()
    else:
        error_message = "Invalid data provided: {}".format(serializer.errors)
        raise ValueError(error_message)

class Working:
    def __init__(self, numberOfPatients):
        self.numberOfPatients = numberOfPatients
        self.totalWorkingHours = numberOfPatients * 3.25
        self.shiftNursingHours = round(numberOfPatients / 28) * 12
        self.nightShiftCareHours = round(numberOfPatients / 10) * 12
        self.dayShiftCareHours = (self.totalWorkingHours - (self.shiftNursingHours * 2)) - self.nightShiftCareHours

    def checkOverTime(self, employee):
        return (True if employee.OverTime == "Yes" else False)

    def updateOverTimeState(self, employee):
        id = employee.EmployeeID
        workingHr = int(employee.Hours)
        if workingHr == 40:
            employee.OverTime = "Yes"
            updateEmployeeByID(id, employee)
        else:
            employee.OverTime = "No"
            updateEmployeeByID(id, employee)

    def updateWorkingHr(self, employee, time):
        employee.Hours = time
        id = employee.EmployeeID
        updateEmployeeByID(id, employee)

## Employee
@api_view(["GET"])
def getAllEmployees(request):
    if request.method == 'GET':
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many = True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(['POST'])
def createEmployee(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        serializer = EmployeeSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employee created successfully'}, status = 201)
        else:
            return Response(serializer.errors, status = 400)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(["GET"])
def getTotalNumberOfEmployees(request):
    if request.method == "GET":
        employees = Employee.objects.all()
        numOfEmployees = len(employees)
        body = numOfEmployees
        if body:
            return Response(body)
        else:
            return Response({'error': 'Employee not exist'}, status = 404)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(['POST'])
def addEmployee(request):
    if request.method == "POST":
        csv_file_path = path_of_dummy_csv
        with open(csv_file_path, 'r') as csv_file:
            newEmployeesData = getEmployeesFromCsv(csv_file)
            for data in newEmployeesData:
                serializer = EmployeeSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()

            return Response({"message": "Employees added successfully"}, status=201)
    else:
        return Response({"error": "No CSV file uploaded"}, status=400)

def getEmployeesFromCsv(csv_file):
    csv_reader = csv.DictReader(csv_file)
    return list(csv_reader)

@api_view(["GET"])
def getEmployeeByID(request, id):
    try:
        employee = Employee.objects.get(pk = id)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status = 404)

    if request.method == 'GET':
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(["DELETE"])
def deleteEmployeeByID(request, id):
    try:
        id = str(id)
        employee = Employee.objects.get(pk = id)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status = 404)

    if request.method == "DELETE":
        employee.delete()
        return Response({'success': 'Employee deleted successfully'}, status=200)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(["PUT"])
def editEmployee(request, id):
    try:
        employee = Employee.objects.get(pk = id)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status = 404)
    if request.method == "PUT":
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status = 404)

@api_view(["GET"])
def averagePerformence(request):
    if request.method == "GET":
        employees = Employee.objects.all()
        numEmployees = len(employees)
        performence = 0
        for employee in employees:
            performanceRating = employee.PerformanceRating
            performence += int(performanceRating)
        body = performence / numEmployees
        return Response(body)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(["GET"])
def averageYears(request):
    if request.method == "GET":
        employees = Employee.objects.all()
        numEmployees = len(employees)
        years = 0
        for employee in employees:
            workYear = employee.TotalWorkingYears
            years += int(workYear)
        body = years / numEmployees
        return Response(body)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

# decision tree applies

#distance - performance
#get request data {"thresholdDistance": ##, "thresholdRating": ##} result with suitable emp-id s
@api_view(['POST'])
def predictDistancePerformance(request):
    predictedData = PredictedData()
    if request.method == "POST":
        if request.body:
            thresholdData = json.loads(request.body)
            thresholdDistance, thresholdRating = thresholdData.get("thresholdDistance"), thresholdData.get("thresholdRating")
            if Employee:
                employees = Employee.objects.all()
                for employee in employees:
                    distance, performance = employee.DistanceFromHome, employee.PerformanceRating
                    predicted_suitability = predictedEmployeesByDistancePerformance(distance, performance, thresholdDistance, thresholdRating)
                    if predicted_suitability[0] == 1:
                        serializersData = getEmployeeByIdFunctional(employee.EmployeeID)
                        predictedData.addDP(serializersData)
                if not predictedData.data["suitableEmployees"]["distancePerformence"]:
                    return Response({f"'message': No suitable result {thresholdData} and predicctedData {predictedData} and employees {employees}"}, status = 201)
                else:
                    return Response(predictedData.getDP())
            else:
                Response({'error': 'Employees not exist'}, status = 404)
        else:
            Response({'error': 'Unvalid data'}, status = 404)
    else:
        Response({'error': 'Method Not Allowed'}, status = 405)
    predictedData.reset()

## Day & Night Shift
def predictDayNightShift(predictedData):
    # Use the predictShift with Employees model data, add suitable employees into day and night shift in the predicted Data.
    dayShiftList = predictedData.data["suitableEmployees"]["dayShift"]
    nightShiftList = predictedData.data["suitableEmployees"]["nightShift"]
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many = True)

    for employee in serializer.data:
        shift, _ = predictShift(employee)
        (dayShiftList if int(shift) == 1 else nightShiftList).append(employee)

@api_view(['GET'])
def getDayAndNightShift(request, id):
    # 1 for day shift, 0 for night shift
    if request.method == "GET":
        predictedData = PredictedData()
        predictDayNightShift(predictedData)
        dayShift = predictedData.getDayShift()
        nightShift = predictedData.getNightShift()
        predictedData.reset()
        data = {"dayShift": dayShift} if id == 1 else {"nightShift": nightShift}
        return Response(data)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(['POST'])
def getFilterDepartment(request):
    ## Note: there no garantee that employee is same shift as before. shift 0 might be in shift 1 list.
    if request.method == "POST" and request.body:
        predictedData = PredictedData()
        departments = ["Nursing", "Care"]
        numberOfPatients = predictedData.data["numberOfPatients"]
        working = Working(numberOfPatients)
        nursingHr = working.shiftNursingHours
        careDayHr = working.dayShiftCareHours
        careNightHr = working.nightShiftCareHours
        responseData = json.loads(request.body)
        date = responseData.get("date")
        thresholdDistance, thresholdRating = responseData.get("thresholdDistance"), responseData.get("thresholdRating")

        holidays = InHoliday.objects.all()
        holidaysSerializer = InHolidaySerializer(holidays, many=True)
        holidayList = []
        for holiday in holidaysSerializer.data:
            employeeID = holiday["EmployeeID"]
            holidayList.append(employeeID)

        resetOnMonday(date)
        if not isDateInData(date):
            resetOnMonday(date)
            for department in departments:
                departmentDayShift = predictedData.data["suitableEmployees"][str.lower(department)+"DayShift"]
                departmentNightShift = predictedData.data["suitableEmployees"][str.lower(department)+"NightShift"]

                ## continueWorkers should not be concidered in the currenct shift.
                continueWorkerList = getContinuousWorkers(date)

                if continueWorkerList:
                    employees = Employee.objects.filter(Department=department).exclude(EmployeeID__in=continueWorkerList, Department=department)
                    serializer = EmployeeSerializer(employees, many = True)
                else:
                    employees = Employee.objects.filter(Department=department)
                    serializer = EmployeeSerializer(employees, many = True)

                for employee in serializer.data:
                    if employee["EmployeeID"] not in continueWorkerList and employee.get("EmployeeID") not in holidayList and employee.get("Hours") <= employee.get("StandardHours"):
                        shift, _ = predictShift(employee)
                        (departmentDayShift if int(shift) == 1 else departmentNightShift).append(employee)
            data = predictedData.data["suitableEmployees"]
            listNursingDay = data["nursingDayShift"]
            listNursingNight = data["nursingNightShift"]
            listCareDay = data["careDayShift"]
            listCareNight = data["careNightShift"]
            ## add predictHours-> update predicted hours
            for employee in listNursingDay:
                employee["Hours"] = predictHours(employee)[0]
            for employee in listNursingNight:
                employee["Hours"] = predictHours(employee)[0]
            for employee in listCareDay:
                employee["Hours"] = predictHours(employee)[0]
            for employee in listCareNight:
                employee["Hours"] = predictHours(employee)[0]
            # ## base on new list -> redictShift
            listNursingDay = predictShiftHr(listNursingDay, thresholdDistance, thresholdRating, nursingHr)
            listNursingNight = predictShiftHr(listNursingNight, thresholdDistance, thresholdRating, nursingHr)
            listCareDay = predictShiftHr(listCareDay, thresholdDistance, thresholdRating, careDayHr)
            listCareNight = predictShiftHr(listCareNight, thresholdDistance, thresholdRating, careNightHr)
            data["nursingDayShift"] = listNursingDay
            data["nursingNightShift"] = listNursingNight
            data["careDayShift"] = listCareDay
            data["careNightShift"] = listCareNight
            ## return whole data, let frontend choose
            ## Save data into database:
            ## save if request.body contains "date", ortherwise not save the shift
            ## data formate-- "date": "2024-03-30"
            saveTodayShift(date, listNursingDay, "Nursing", 1)
            saveTodayShift(date, listNursingNight, "Nursing", 0)
            saveTodayShift(date, listCareDay, "Care", 1)
            saveTodayShift(date, listCareNight, "Care", 0)
            predictedData.reset()
            return Response(data)
        else:
            return Response({'error': 'Date already exist'})
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

## Schedule
def saveTodayShift(dateStr, employeeList, department, shift):
    date = datetime.strptime(dateStr, '%Y-%m-%d').date()
    dateObj, _ = Date.objects.get_or_create(Date=date)
    scheduleHistory = ScheduleHistory.objects.create(Date=dateObj, Department=department, Shift=shift)
    employeeIDs = []
    subEmployeeIDs = []
    for employee in employeeList:
        if employee.get("Hours") != 0:
            employeeIDs.append(employee.get("EmployeeID"))
        else:
            subEmployeeIDs.append(employee.get("EmployeeID"))
    scheduleHistory.EmployeeList.set(employeeIDs)
    scheduleHistory.SubEmployeeList.set(subEmployeeIDs)
    scheduleHistory.save()
    # Update hr and overtime status
    if employeeIDs:
        for id in employeeIDs:
            updateHourOfEmployee(id)

def allShifts():
    allShifts = ScheduleHistory.objects.all()
    shiftsData = []

    for shift in allShifts:
        date = shift.Date.Date
        department = shift.Department
        shiftType = shift.Shift
        employees = shift.EmployeeList.all()
        subEmployees = shift.SubEmployeeList.all()

        shiftData = {
            "date": date.strftime('%Y-%m-%d'),
            "department": department,
            "shift": shiftType,
            "employees": [str(employee) for employee in employees],
            "subEmployees": [str(employee) for employee in subEmployees]
        }
        shiftsData.append(shiftData)
    return shiftsData

def employeeShift():
    allShiftsData = allShifts()
    returnData = {}
    if allShiftsData:
        for packdata in allShiftsData:
            date = packdata["date"]
            shift = packdata["shift"]
            employeeIDList = packdata["employees"]
            for employeID in employeeIDList:
                if employeID not in returnData:
                    returnData[employeID] = [{"date": date, "shift": shift}]
                else:
                    returnData[employeID].append({"date": date, "shift": shift})
    return returnData

@api_view(["GET"])
def getEmployeeShift(request):
    if request.method == "GET":
        data = employeeShift()
        return Response(data)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

def todayShift():
    data = allShifts()
    today = datetime.now().date()
    todayShifts = [shift for shift in data if shift['date'] == str(today)]

    employeesToday = []
    employeesTodayObj = []
    for shift in todayShifts:
        employeesToday.extend(shift['employees'])

    for id in employeesToday:
        obj = getEmployeeByIdFunctional(id)
        employeesTodayObj.append(obj)
    return employeesTodayObj

@api_view(["GET"])
def getTodayShifts(request):
    if request.method == "GET":
        shiftsData = todayShift()
        return Response(shiftsData)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(["GET"])
def getAllShifts(request):
    if request.method == "GET":
        shiftsData = allShifts()
        return Response(shiftsData)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

@api_view(["DELETE"])
def deleteShiftByDate(request):
    if request.method == 'DELETE':
        dataRespond = json.loads(request.body)
        dateStr = dataRespond["date"]
        if isDateInData(dateStr):
            try:
                dateObj = Date.objects.get(Date=dateStr)
                ScheduleHistory.objects.filter(Date=dateObj).delete()
                return Response({'message': 'Shifts deleted successfully'}, status=200)
            except Date.DoesNotExist:
                return Response({'message': 'Date not found'}, status=404)
        else:
            return Response({'message': 'Date not exist'}, status=405)
    else:
        return Response({'message': 'Invalid request method'}, status=405)

## only working 2 days continuely
def getContinuousWorkers(date):
    date = datetime.strptime(date, '%Y-%m-%d').date()
    previousDay = date - timedelta(days=1)  # Get previous day
    previousDayStr = previousDay.strftime('%Y-%m-%d')
    twoDaysAgo = date - timedelta(days=2) # Get previous 2 days
    twoDaysAgoStr = twoDaysAgo.strftime('%Y-%m-%d')
    twoDaysAgoList = []
    previousDayList = []
    data = allShifts()
    if data and len(data) >= 2:
        continuousWorkers = []
        for entry in data:
            dateStr = entry['date']
            employees = entry['employees']

            if dateStr == twoDaysAgoStr:
                twoDaysAgoList.extend(employees)
            if dateStr == previousDayStr:
                previousDayList.extend(employees)
        continuousWorkers = list(set(twoDaysAgoList) & set(previousDayList))
        continuousWorkers = [int(item) for item in continuousWorkers]
        # Remove duplicate employees
        return continuousWorkers
    else:
        return []

def isDateInData(dateToCheck):
    data = allShifts()
    for entry in data:
        date = entry.get('date')
        if date == dateToCheck:
            return True
    return False

## updateHours & overtime handler
def updateHourOfEmployee(id):
    try:
        employee = Employee.objects.get(pk=id)
        employee.Hours += 12
        if employee.Hours > 40:
            employee.OverTime = "Yes"
        else:
            employee.OverTime = "No"
        employee.save()
        return Response({"message":"Employee date updated successfully."}, status=200)
    except Employee.DoesNotExist:
        return Response({"message":"Employee not exists."}, status=404)

## reset all emplyees' hr to 0
def restHrAndStatus():
    try:
        employees = Employee.objects.all()
        for employee in employees:
            employee.Hours = 0
            employee.OverTime = "No"
        return Response({"message": "Reset successfully."}, status=200)
    except:
        return Response({"message": "Employees not exist."}, status=404)

## if the date is Monday, before create new shift for a week, reset all employees' hr & OverTime
def resetOnMonday(date):
    employees = Employee.objects.all()
    if isinstance(date, str):
        date = datetime.strptime(date,'%Y-%m-%d').date()
        if date.weekday() == 0: # Monday
            for employee in employees:
                employee.Hours = 0
                employee.OverTime = "No"
                employee.save()
            return Response({"message": "Reset All Employees Successfully."}, status=200)
    else:
        return Response({"message": "Reset Error: Date Must Be String."}, status=404)

@api_view(["POST"])
def getByDept(request):
    if request.method == 'POST':
        dataRespond = json.loads(request.body)
        dep = dataRespond.get('dep')
        try:
            employees = Employee.objects.filter(Department = dep)
            serializer = EmployeeSerializer(employees, many = True)
            return Response(serializer.data)
        except Date.DoesNotExist:
            return Response({'message': 'Date not found'}, status=404)
    else:
        return Response({'message': 'Invalid request method'}, status=405)

def isDateInData(dateToCheck):
    data = allShifts()
    for entry in data:
        date = entry.get('date')
        if date == dateToCheck:
            return True
    return False

## updateHours & overtime handler
def updateHourOfEmployee(id):
    try:
        employee = Employee.objects.get(pk=id)
        employee.Hours += 12
        if employee.Hours > 40:
            employee.OverTime = "Yes"
        else:
            employee.OverTime = "No"
        employee.save()
        return Response({"message":"Employee date updated successfully."}, status=200)
    except Employee.DoesNotExist:
        return Response({"message":"Employee not exists."}, status=404)

## reset all emplyees' hr to 0
def restHrAndStatus():
    try:
        employees = Employee.objects.all()
        for employee in employees:
            employee.Hours = 0
            employee.OverTime = "No"
        return Response(Response({"message": "Reset successfully."}, status=200))
    except:
        return Response({"message": "Employees not exist."}, status=404)

## if the date is Monday, before create new shift for a week, reset all employees' hr & OverTime
def resetOnMonday(date):
    employees = Employee.objects.all()
    if isinstance(date, str):
        date = datetime.strptime(date,'%Y-%m-%d').date()
        if date.weekday() == 0: # Monday
            for employee in employees:
                employee.Hours = 0
                employee.OverTime = "No"
                employee.save()
            return Response({"message": "Reset All Employees Successfully."}, status=200)
    else:
        return Response({"message": "Reset Error: Date Must Be String."}, status=404)


def deleteByDateId(date, employeeID):
    try:
        shifts = ScheduleHistory.objects.filter(Date__Date=date)
        for shift in shifts:
            employeeID_int = int(employeeID)  # Convert employeeID to integer
            if employeeID_int in shift.EmployeeList.values_list('pk', flat=True):
                shift.EmployeeList.remove(employeeID_int)
                return Response({"message": "Employee removed from shift successfully."}, status=200)
        return Response({"message": "Employee not exist in any shift for this date."}, status=404)

    except ScheduleHistory.DoesNotExist:
        return Response({"message": "Date not exist."}, status=404)


@api_view(["DELETE"])
def deleteShift(request):
    if request.method == "DELETE":
        dataRespond = json.loads(request.body)
        date = dataRespond.get("date")
        employeeID = dataRespond.get("employeeID")
        deleteByDateId(date, employeeID)
        return Response({'message': 'Delete success'}, status=200)
    else:
        return Response({'message': 'Invalid request method'}, status=405)

# shift handler
def addEmployeeToShift(data):
    try:
        date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        employeeID = int(data["employeeID"])
        shifts = ScheduleHistory.objects.filter(Date__Date=date)
        
        if not shifts:
            return JsonResponse({"message": "No shift found for the given date"}, status=404)
        else:
            for shift in shifts:
                if employeeID in shift.EmployeeList.values_list('pk', flat=True):
                    return JsonResponse({"message": "Employee already exists in the shift"}, status=400)
                shift.EmployeeList.add(employeeID)
                updateHourOfEmployee(employeeID)
                return JsonResponse({"message": "Employee added to the shift successfully"}, status=200)
    except ValueError:
        return JsonResponse({"error": "Invalid input data"}, status=400)

@api_view(['POST'])
def addEmployeeToShiftHandler(request):
    if request.method == 'POST':
        data = request.data
        response = addEmployeeToShift(data)
        return response
    else:
        return Response({'error': 'Method Not Allowed'}, status=405)

## holiday
@api_view(["GET"])
def inHolidayAll(request):
    if request.method == "GET":
        inHolidayObj = InHoliday.objects.all()
        serializers = InHolidaySerializer(data = inHolidayObj, many = True)
        body = serializers.data
        return Response(body)
    else:
        return Response({'message': 'Invalid request method'}, status=405)

# {
#     "employeeID": int
#     "startDate": date string;
#     "endDate": date string;
# }
@api_view(['POST'])
def createHoliday(request):
    if request.method == 'POST':
        data = request.data
        if not isSameHoliday(data):
            serializer = InHolidaySerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                pk = serializer.data["id"]
                return Response({'message': f'Holiday created successfully. Pk = {pk}'}, status=201)
            else:
                return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'Holiday with same attributes already exists'}, status=400)
    else:
        return Response({'error': 'Method Not Allowed'}, status=405)

def getHolidayById(id):
    try:
        holidays = InHoliday.objects.get(pk=id)
        if holidays:
            serializer = InHolidaySerializer(holidays)
            if holidays:
                return serializer.data
            else:
                return 'error : No holidays found for this employee'
    except ValueError:
        return 'error : Invalid EmployeeID'

@api_view(["GET"])
def getHolidayByIDHandler(request, id):
    if request.method == "GET":
        body = getHolidayById(id)
        if body:
            return Response(body)
        else:
            Response({'error': 'Pk not exist, check again.'}, status = 405)
    else:
        return Response({'error': 'Method Not Allowed'}, status = 405)

def deleteHoliday(id):
    if id:
        try:
            holidayObj = InHoliday.objects.get(pk=id)
            holidayObj.delete()
            return "message : Holiday deleted successfully"
        except InHoliday.DoesNotExist:
            return "error : Holiday not found"
    else:
        return "error : Data needed to delete"

@api_view(["DELETE"])
def deleteHolidayHandler(request, id):
    if request.method == "DELETE":
        response = deleteHoliday(id)
        return Response(response)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)

def editHoliday(data, id):
    if data and id:
        try:
            dataPut = data
            holidayObj = InHoliday.objects.get(pk=id)
            holidayObj.StartDate = dataPut["StartDate"]
            holidayObj.EndDate = dataPut["EndDate"]
            holidayObj.EmployeeID = dataPut["EmployeeID"]
            holidayObj.save()
            return "message : Holiday edited successfully"
        except InHoliday.DoesNotExist:
            return "error : Holiday not found"
    else:
        return "error : Data needed to edit"

@api_view(["PUT"])
def editHolidayHandler(request,id):
    if request.method == "PUT":
        requestData = json.loads(request.body)
        response = editHoliday(requestData, id)
        return Response(response)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)

@api_view(["GET"])
def getAllHoliday(request):
    if request.method == "GET":
        holidays = InHoliday.objects.all()
        serializer = InHolidaySerializer(holidays, many=True)
        return Response(serializer.data)
    else:
        return Response({"error": "Method not allowed"}, status=405)

def deleteFromHolidayIfEnd():
    today = datetime.now().strftime('%Y-%m-%d')
    todayDate = datetime.strptime(today, '%Y-%m-%d').date()
    holidayObjs = InHoliday.objects.filter(EndDate=todayDate)

    if holidayObjs.exists():
        for holiday in holidayObjs:
            employeeID = holiday.EmployeeID
            holiday.delete()

        return f"Deleted holidays with EndDate {today}, EmployeeID : {employeeID}. You may want to contact to employee to check availability. As default, I will put {employeeID} into the future shift."
    else:
        return f"No holidays found with EndDate is TODAY : {today}"

@api_view(["GET"])
def endHolidayTodayHandler(request):
    if request.method == "GET":
        message = deleteFromHolidayIfEnd()
        return Response(message)
    else:
        return Response({"error": "Method not allowed"}, status=405)

def isSameHoliday(data):
    employeeID = data.get("EmployeeID")
    startDate = data.get("StartDate")
    endDate = data.get("EndDate")
    existing_holidays = InHoliday.objects.filter(EmployeeID=employeeID, StartDate=startDate, EndDate=endDate)
    if existing_holidays.exists():
        return True
    else:
        return False

# Data analyse
def ageRange():
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    age_counts = {
        "20": 0,
        "30": 0,
        "40": 0,
        "50": 0,
        "60": 0
    }
    for employee_data in serializer.data:
        age = employee_data["Age"]
        if age < 30:
            age_range = "20"
        elif age < 40:
            age_range = "30"
        elif age < 50:
            age_range = "40"
        elif age < 60:
            age_range = "50"
        else:
            age_range = "60"
        age_counts[age_range] += 1
    return age_counts

@api_view(["GET"])
def ageRangeHandler(request):
    if request.method == "GET":
        body = ageRange()
        return Response(body)
    else:
        return Response({"error": "Method not allowed"}, status=405)

def getSatRange():
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    sat_counts = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
    }
    for employee_data in serializer.data:
        sat = employee_data["JobSatisfaction"]
        if sat == 1:
            sat_range = "1"
        elif sat == 2:
            sat_range = "2"
        elif sat == 3:
            sat_range = "3"
        elif sat == 4:
            sat_range = "4"
        else:
            sat_range = "5"
        sat_counts[sat_range] += 1
    return sat_counts

@api_view(["GET"])
def getSatRangeHandler(request):
    if request.method == "GET":
        body = getSatRange()
        return Response(body)
    else:
        return Response({"error": "Method not allowed"}, status=405)

def averageSalary():
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    numOfEmployees = len(employees)
    totalSalary = 0
    for employee in serializer.data:
        salary = int(employee["MonthlyIncome"])
        totalSalary += salary
    data = totalSalary // numOfEmployees
    return data

@api_view(["GET"])
def getAverageSalaryHandler(request):
    if request.method == "GET":
        body = averageSalary()
        return Response(body)
    else:
        return Response({"error": "Method not allowed"}, status=405)
