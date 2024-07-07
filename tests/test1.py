from locust import FastHttpUser, task, between, LoadTestShape

class WebsiteUser1(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=c84c1dd3-8d65-5ba9-996f-84e9dc9599ae&keychainrefId=a7a4b05e-cacb-5d33-b08b-777c80aafdfa")

class WebsiteUser2(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=15cf6f0c-c698-5124-96fe-086b68417334&keychainrefId=0e17856d-7719-55b3-b0ad-c352278e0d9e")

class WebsiteUser3(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=f93f038b-9fbf-53a9-9d64-73e31cbe027a&keychainrefId=240c443d-94ca-513e-86b3-32f4828b895c")

class WebsiteUser4(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=ea8aebfa-4007-50b4-9bbc-3e053aad75c9&keychainrefId=4ad113b7-032b-5cf2-a7a3-ba1fe47fd132")

class WebsiteUser5(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=4157b19d-b510-5f20-a3ce-98592f654322&keychainrefId=d352bf95-60da-5957-8c7f-1c9976296946")

class WebsiteUser6(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=8d25d806-7037-53a3-be02-8f150083fe3a&keychainrefId=0eee37bc-1c22-5b73-b135-acde478da417")

class WebsiteUser7(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=febe9983-99c8-5f1d-8016-2c814727be6a&keychainrefId=9f5121de-1ba2-538f-8873-840eacf061f7")

class WebsiteUser8(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=ed116d1b-c4e7-5276-8379-740a55157e1a&keychainrefId=011829a3-6b15-5031-a7ab-15ec4adfc280")

class WebsiteUser9(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=d27bc6ae-b34d-5b48-ba7a-e9094a55908e&keychainrefId=d243e30a-24aa-579c-9f48-3dbecff37ac9")

class WebsiteUser10(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role10(self):
        self.client.get("/getHospitalRole10?userId=0986e77d-9c84-59fd-8799-bf6e44346845&keychainrefId=8dac87ce-3729-5714-9e15-b5bb2e5c6604")

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
    WebsiteUser1, WebsiteUser2, WebsiteUser3, WebsiteUser4, WebsiteUser5,
    WebsiteUser6, WebsiteUser7, WebsiteUser8, WebsiteUser9, WebsiteUser10
]
