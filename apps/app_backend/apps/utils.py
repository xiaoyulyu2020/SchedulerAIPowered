import json
import csv
import os
import pandas as pd

script_directory = os.path.dirname(os.path.abspath(__file__))
path_of_config = os.path.join(script_directory, "config.json")
path_of_csv = os.path.join(script_directory, "csv_files/watson_healthcare_modified.csv")
path_of_dummy_csv = os.path.join(script_directory, "csv_files/dummy.csv")

def read_config(path_of_config):
    if not os.path.exists(path_of_config):
        raise FileNotFoundError(f"Config file does not exist: {path_of_config}")
    with open(path_of_config, "r") as read_config:
        config = json.load(read_config)
    return config

config = read_config(path_of_config)

def read_csv_columns(path_of_csv):
    with open(path_of_csv, "r") as read_csv:
        columns = csv.DictReader(read_csv).fieldnames
    return columns

def update_existing_config_headers():
    headers = df.columns.tolist()
    if headers:
        config["headers_csv"] = headers

        with open(path_of_config, "w")as write_config:
            json.dump(config, write_config, indent=4)
            print("Updating configration ... ...")
    else:
        raise ValueError("There are no columns in the data frame.")

def get_employee_detail_by_id(EmployeeID):
    if not isinstance(EmployeeID, int):
        raise ValueError("Employee ID must be an integer.")

    employee = df[df["EmployeeID"] == EmployeeID].to_dict(orient='records')
    if employee:
        return employee[0]
    else:
        raise ValueError(f"No employee found with the given EmployeeID: {EmployeeID}")

def get_column_by_header(header):
    if header in config["headers_csv"]:
        return df[header].unique().tolist()
    else:
        raise ValueError(f"No header was found, header: {header}. Check again.")

def drop_down_select(given_list):
    drop_down_select = []
    for element in given_list:
        drop_down_select.append((element, element))
    return drop_down_select

df = pd.read_csv(path_of_csv)

departments_list = get_column_by_header("Department")
genders_list = get_column_by_header("Gender")
jobRoles_list = get_column_by_header("JobRole")
jobSat_list = get_column_by_header("JobSatisfaction")
maritalStatus_list = get_column_by_header("MaritalStatus")
over18_list = get_column_by_header("Over18")
performanceRating_list = get_column_by_header("PerformanceRating")
shift_list = get_column_by_header("Shift")

drop_down_select_departments = drop_down_select(departments_list)
drop_down_select_genders = drop_down_select(genders_list)
drop_down_select_jobRoles = drop_down_select(jobRoles_list)
drop_down_select_jobSta = drop_down_select(jobSat_list)
drop_down_select_maritalStatus = drop_down_select(maritalStatus_list)
drop_down_select_over18 = drop_down_select(over18_list)
drop_down_select_performance = drop_down_select(performanceRating_list)
drop_down_select_shift = drop_down_select(shift_list)