from locust import FastHttpUser, task, between
import time
import uuid
import json

class WebsiteUser1(FastHttpUser):
    wait_time = between(1, 3)  # Adjust wait time as needed

    def on_start(self):
        # Generate sizes from 10 MB (10^7 bytes) to 50 MB (5*10^7 bytes), increment by 10 MB
        self.sizes = [10**7 + i * 10**7 for i in range(5)]
        self.current_size = 0

    @task
    def upload_varying_size_ehr(self):
        if self.current_size < len(self.sizes):
            payload_size = self.sizes[self.current_size]
            self.current_size += 1
        else:
            # Restart from the first size after reaching the last one
            self.current_size = 0
            payload_size = self.sizes[self.current_size]

        self.upload_ehr(payload_size)

    def upload_ehr(self, payload_size):
        unique_id = str(uuid.uuid4())
        headers = {'Content-Type': 'application/json'}
        data = "x" * payload_size
        body = json.dumps({"data": data})
        start_time = time.time()
        with self.client.post(f"/uploadEHR?userId=c84c1dd3-8d65-5ba9-996f-84e9dc9599ae", headers=headers, data=body, catch_response=True) as response:
            end_time = time.time()
            duration = end_time - start_time
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed: {response.status_code}")
            print(f"UserID: {unique_id}, Payload Size: {payload_size} bytes, Response Time: {duration:.2f} seconds, Status Code: {response.status_code}")

# List of user classes used by Locust
user_classes = [WebsiteUser1]

