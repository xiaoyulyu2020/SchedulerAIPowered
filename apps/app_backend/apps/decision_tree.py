from sklearn.metrics import mean_squared_error
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from apps.utils import *

def predictedEmployeesByDistancePerformance(distance, performance, thresholdDistance, thresholdRating):
    df['Suitability'] = ((df['DistanceFromHome'] <= thresholdDistance) & (df['PerformanceRating'] >= thresholdRating)).astype(int)
    X = df[['DistanceFromHome', 'PerformanceRating']]
    y = df['Suitability']

    X_train, X_test, y_train, y_test = train_test_split(X.values, y, test_size=0.2, random_state=42)

    clf = DecisionTreeClassifier()
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    predicted_suitability = clf.predict([[distance, performance]])

    return predicted_suitability

def predictShift(employee):
    # Predict employee day and night shift #
    target = "Shift"
    data = pd.get_dummies(df, columns=['BusinessTravel', 'Department', 'EducationField', 'Gender', 'JobRole', 'MaritalStatus', 'OverTime'])
    features = list(data.columns)
    unwanted_columns = ["EmployeeID", "Shift", "Attrition", "Over18", "StandardHours"]
    for column in unwanted_columns:
        features.remove(column)
        
    employee_df = pd.DataFrame([employee])
    employee_encoded = pd.get_dummies(employee_df, columns=['BusinessTravel', 'Department', 'EducationField', 'Gender', 'JobRole', 'MaritalStatus', 'OverTime'])
    
    for column in data.columns:
        if column not in employee_encoded.columns:
            employee_encoded[column] = 0  # Add missing columns with default value 0
            
    employee_ready = employee_encoded[features]
    
    X_train, X_test, y_train, y_test = train_test_split(data[features], data[target], test_size=0.2, random_state=42)
    clf = DecisionTreeClassifier(random_state=42)
    clf.fit(X_train, y_train)
    shift_prediction = clf.predict(employee_ready)
    # Evaluate the accuracy of the model on the test set
    y_pred_test = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred_test)
    
    return shift_prediction[0], accuracy


def predictShiftHr(shiftList, thresholdDistance, thresholdRating, totalShiftHr):
    # base on distance and performance, concidering the total hr of different department and shift, give a shift list containing each employee in json format. #
    result = []
    hoursSum = 0
    while hoursSum < totalShiftHr:
        for employee in shiftList:
            distance = employee["DistanceFromHome"]
            performance = employee["PerformanceRating"]
            predicted_suitability = predictedEmployeesByDistancePerformance(distance, performance, thresholdDistance, thresholdRating)
            if predicted_suitability[0] == 1:
                result.append(employee)
                hoursSum = sum(entry['Hours'] for entry in result)
                if hoursSum >= totalShiftHr:
                    return result
        if thresholdRating > 0:
            thresholdRating -= 1
            result = []
            hoursSum = 0
        else:
            return "No results"
    return result

def predictHours(employee):
    # Predict 0 or 12 hour for each employee #
    target = "Hours"
    data = pd.get_dummies(df, columns=['BusinessTravel', 'Department', 'EducationField', 'Gender', 'JobRole', 'MaritalStatus', 'OverTime'])
    features = list(data.columns)
    unwanted_columns = ["EmployeeID", "Hours", "Attrition", "Over18", "StandardHours"]
    for column in unwanted_columns:
        features.remove(column)
        
    employee_df = pd.DataFrame([employee])
    employee_encoded = pd.get_dummies(employee_df, columns=['BusinessTravel', 'Department', 'EducationField', 'Gender', 'JobRole', 'MaritalStatus', 'OverTime'])
    
    for column in data.columns:
        if column not in employee_encoded.columns:
            employee_encoded[column] = 0
            
    employee_ready = employee_encoded[features]
    
    X_train, X_test, y_train, y_test = train_test_split(data[features], data[target], test_size=0.2, random_state=42)
    regressor = DecisionTreeClassifier(random_state=42)
    regressor.fit(X_train, y_train)
    hours_prediction = regressor.predict(employee_ready)
    y_pred_test = regressor.predict(X_test)
    mse = mean_squared_error(y_test, y_pred_test)
    
    return hours_prediction[0], mse