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

# 21
class WebsiteUser21(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=2a800950-52a1-52f3-b4ae-7452fb3b86c2&keychainrefId=d27e6813-be24-53eb-bc20-3a7f13855e51")

class WebsiteUser22(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=8d6ac14c-95fa-55f6-b852-0615db896d56&keychainrefId=54387c25-5482-528f-b3d1-822fc56a9d9d")

class WebsiteUser23(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=0de05d4a-4f1b-52d4-b5e8-4d9a720faa01&keychainrefId=1983bd89-5878-569e-9395-8b7f80c0a73a")

class WebsiteUser24(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=f595675e-a669-57d8-9783-abfb8887b7f1&keychainrefId=6d79f040-5016-5e40-b9f1-cb2c9a9a8e0b")

class WebsiteUser25(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=caba15bf-62f4-56f4-878e-da8e9272a7d8&keychainrefId=1443fc3d-d5af-5e6d-931f-a40b4e81f2cc")

class WebsiteUser26(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=a72d8410-cecf-578d-8691-8baf307eb127&keychainrefId=e4d2e8b4-60c5-5b37-aa63-97c92b3bf2c8")

class WebsiteUser27(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=e2ce772c-1a11-58bb-8792-06727e7a13a1&keychainrefId=573e0a6f-7d1a-5b7f-83f7-7f7852d01e5d")

class WebsiteUser28(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=91d86e8d-c67b-5f65-8aa4-d81be8ff0fdf&keychainrefId=aa62be70-35a5-5425-9813-4d57af8a43cf")

class WebsiteUser29(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=f78f7f3e-e203-5d0a-99b1-20c422dd5d67&keychainrefId=96aa7f40-32af-592e-90ef-b3576db4e2db")

class WebsiteUser30(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role30(self):
        self.client.get("/getHospitalRole30?userId=28d1d1ea-c970-566c-bdba-a5f99baefd54&keychainrefId=bd41e963-8a19-5538-b043-77e3521d5fdf")

# 31
class WebsiteUser31(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=80707190-1e40-570c-aab4-d38ce1a0dfd5&keychainrefId=10227dd2-454e-50fb-9b34-a87dc0c0f975")

class WebsiteUser32(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=8bc646bc-65fa-5e5e-bcdb-ab379a8f6efb&keychainrefId=7155dcbe-37bc-5c01-8bed-1c7f739778f7")

class WebsiteUser33(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=6c3059ff-74ea-5499-b9e5-a673c2f74e7d&keychainrefId=d63ef68e-19e4-5285-baf3-c4c39340070f")

class WebsiteUser34(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=0f8a1ad2-0776-5285-87fc-7646f838d9cf&keychainrefId=8838a94f-27f3-5d31-95cb-afdb012cccc8")

class WebsiteUser35(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=3528051b-7c82-5323-96e0-c423692a8666&keychainrefId=c353822d-b5e0-5ca2-a05f-4daec9f0bb6a")

class WebsiteUser36(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=eb239dba-8fdb-5bb7-aa6f-8db57ce44b82&keychainrefId=7e44c8c9-ea61-5de7-b413-ae1c0c9bd398")


class WebsiteUser37(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=304a9202-b881-537d-98ea-fa9a02378d1b&keychainrefId=dea368de-0e00-596c-8c51-e8589113982f")


class WebsiteUser38(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=eeb019da-929e-5ce7-9ca7-c24f96a28d6d&keychainrefId=6a2ee46e-4e09-5c61-bb0f-13d395880370")

class WebsiteUser39(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=404e2c3f-9be8-536c-889a-15ff69190c9f&keychainrefId=063592ca-5f4a-51da-8527-9b08ae1256a7")

class WebsiteUser40(FastHttpUser):
    wait_time = between(0.5, 1)
    @task
    def get_hospital_role40(self):
        self.client.get("/getHospitalRole40?userId=1e65c71e-c0d7-5dfb-9b29-dea441e07684&keychainrefId=984363cd-d385-51e4-b001-2d76c089b689")

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
    WebsiteUser16, WebsiteUser17, WebsiteUser18, WebsiteUser19, WebsiteUser20,
    WebsiteUser21, WebsiteUser22, WebsiteUser23, WebsiteUser24, WebsiteUser25,
    WebsiteUser26, WebsiteUser27, WebsiteUser28, WebsiteUser29, WebsiteUser30,
    WebsiteUser31, WebsiteUser32, WebsiteUser33, WebsiteUser34, WebsiteUser35,
    WebsiteUser36, WebsiteUser37, WebsiteUser38, WebsiteUser39, WebsiteUser40,
]

    
# locust -f test3.py --csv=results
