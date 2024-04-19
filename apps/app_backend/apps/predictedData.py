class PredictedData:
    def __init__(self) -> None:
        self.data = {
        "suitableEmployees": {
            "distancePerformence": [],
            "dayShift": [],
            "nightShift": [],
            "nursingDayShift": [],
            "nursingNightShift": [],
            "careDayShift": [],
            "careNightShift": []
            },
        "numberOfPatients": 100,
        "weeklyShiftData":[]
        }
        
    def reset(self):
        self.data["suitableEmployees"] = {
            "distancePerformence": [],
            "dayShift": [],
            "nightShift": [],
            "nursingDayShift": [],
            "nursingNightShift": [],
            "careDayShift": [],
            "careNightShift": []
            }
        
    def addDP(self, obj):
        self.data["suitableEmployees"]["distancePerformence"].append(obj)
        
    def getDP(self):
        return self.data["suitableEmployees"]["distancePerformence"]
    
    def addNursingDayShift(self, obj):
        self.data["suitableEmployees"]["nursingDayShift"].append(obj)
        
    def addNursingNightShift(self, obj):
        self.data["suitableEmployees"]["nursingNightShift"].append(obj)

    def addCareDayShift(self, obj):
        self.data["suitableEmployees"]["careDayShift"].append(obj)
        
    def addCareNightShift(self, obj):
        self.data["suitableEmployees"]["careNightShift"].append(obj)

    def getDayShift(self):
        return self.data["suitableEmployees"]["dayShift"]
    
    def getNightShift(self):
        return self.data["suitableEmployees"]["nightShift"]
    
    def getNursingDayShift(self):
        return self.data["suitableEmployees"]["nursingDayShift"]
    
    def getNursingNightShift(self):
        return self.data["suitableEmployees"]["nursingNightShift"]
    
    def getCareDayShift(self):
        return self.data["suitableEmployees"]["careDayShift"]
    
    def getCareNightShift(self):
        return self.data["suitableEmployees"]["careNightShift"]