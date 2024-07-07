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


# 11
class WebsiteUser11(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=245e857c-4743-58df-a7e2-a42f2554da29&keychainrefId=948ddbe7-995e-5414-9bd8-834b00100ff1")

class WebsiteUser12(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=43a54462-2892-58b1-9389-3a70493cad98&keychainrefId=a2060fea-16d6-54bd-aa9a-470eed607660")

class WebsiteUser13(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=2bffae7d-a687-5735-b5b5-ebf9321855c5&keychainrefId=5dfed46e-97b1-5ad8-9009-9cdeca588756")

class WebsiteUser14(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=72250669-273a-58b0-828b-d701e210eca7&keychainrefId=099981dd-fd63-561b-bad7-f93f96a19d8a")

class WebsiteUser15(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=bfbd8935-c1dc-519e-a289-8b8ecc87a726&keychainrefId=79f26a5b-a0c1-54ec-a18e-8609559c12b2")

class WebsiteUser16(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=e96418d7-779a-5eb7-8f83-5697f2b42d49&keychainrefId=3ac3aa6b-c91c-54e0-8b76-3cb97d46a3df")

class WebsiteUser17(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=c264e3bf-fd2c-501d-8fa6-c725495d5a90&keychainrefId=fa4a5e0c-3da1-5642-8c41-8382d4af0485")

class WebsiteUser18(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=87235a69-fb41-537d-adbe-b6643512a906&keychainrefId=6d9856df-6547-5e95-9d6c-bcc18cdd5272")

class WebsiteUser19(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=29a7a2c7-9b4b-568d-be7c-e19a9a884a31&keychainrefId=4512b31d-68ea-502e-a5e9-b1e9045ebb49")

class WebsiteUser20(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role20(self):
        self.client.get("/getHospitalRole20?userId=fc6d33b5-b32e-5010-9b7b-db8045d25de8&keychainrefId=514ea987-97c9-5666-ab42-c8a2aef91174")


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
    WebsiteUser6, WebsiteUser7, WebsiteUser8, WebsiteUser9, WebsiteUser10,
    WebsiteUser11, WebsiteUser12, WebsiteUser13, WebsiteUser14, WebsiteUser15,
    WebsiteUser16, WebsiteUser17, WebsiteUser18, WebsiteUser19, WebsiteUser20
]

    
# locust -f test3.py --csv=results
