from locust import FastHttpUser, task, between, LoadTestShape

class WebsiteUser1(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=c84c1dd3-8d65-5ba9-996f-84e9dc9599ae&keychainrefId=a7a4b05e-cacb-5d33-b08b-777c80aafdfa")

class StagesShape(LoadTestShape):
    stages = [
        {"duration": 10, "users": 100, "spawn_rate": 10},
        {"duration": 40, "users": 2000, "spawn_rate": 100},
        {"duration": 160, "users": 0, "spawn_rate": 30},
    ]

    def tick(self):
        run_time = self.get_run_time()
        for stage in self.stages:
            if run_time < stage["duration"]:
                return stage["users"], stage["spawn_rate"]
        return None

user_classes = [
    WebsiteUser1]

    
# locust -f test3.py --csv=results
