import json
import os
import random
import uuid
from faker import Faker

json_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../crypto-material/crypto-material.json"))

with open(json_file_path, "r") as json_file:
    crypto_material_data = json.load(json_file)

# Access the keychains directly
keychain1_id = crypto_material_data["keychains"]["keychain1"]["id"]
keychain2_id = crypto_material_data["keychains"]["keychain2"]["id"]


fake = Faker("en_IN")

def generate_doctor(network_id, keychain_id):
    first_name = fake.first_name()
    last_name = fake.last_name()
    u_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, first_name+last_name))
    
    specialty = fake.random_element(
        elements=("Cardiology", "Dermatology", "Orthopedics", "Pediatrics", "Other")
    )
    contact_email = f"{first_name.lower()}.{last_name.lower()}@gmail.com"
    contact_phone = fake.phone_number()
    k_id=str(uuid.uuid5(uuid.NAMESPACE_DNS, first_name+last_name+contact_email+contact_phone))
    doctor_data = {
        "u_id": u_id,
        "k_id": k_id,
        "first_name": first_name,
        "last_name": last_name,
        "specialty": specialty,
        "contact_email": contact_email,
        "contact_phone": contact_phone,
        "network_id": network_id,
        "organization": "org1",
        "role": "doctor",
        "keychain_id": keychain_id,
    }

    return doctor_data

def generate_patient(network_id, unique_patients, keychain_id):
    while True:
        first_name = fake.first_name()
        last_name = fake.last_name()
        u_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, first_name+last_name))
        

        if u_id not in unique_patients:
            unique_patients.add(u_id)
            break

    date_of_birth = fake.date_of_birth(minimum_age=18, maximum_age=90)
    gender = random.choice(["Male", "Female", "Other"])
    address = fake.address()
    contact_email = f"{first_name.lower()}.{last_name.lower()}@gmail.com"
    contact_phone = fake.phone_number()
    emergency_contact_name = fake.name()
    emergency_contact_phone = fake.phone_number()
    k_id=str(uuid.uuid5(uuid.NAMESPACE_DNS, first_name+last_name+contact_email+contact_phone))

    patient_data = {
        "u_id": u_id,
        "k_id":k_id,
        "first_name": first_name,
        "last_name": last_name,
        "date_of_birth": date_of_birth.strftime("%Y-%m-%d"),
        "gender": gender,
        "address": address,
        "contact_email": contact_email,
        "contact_phone": contact_phone,
        "emergency_contact_name": emergency_contact_name,
        "emergency_contact_phone": emergency_contact_phone,
        "network_id": network_id,
        "organization": "org1",
        "role": "patient",
        "keychain_id": keychain_id,
    }

    return patient_data

def generate_assistant_doctor(network_id, supervisor_id, keychain_id):
    first_name = fake.first_name()
    last_name = fake.last_name()
    u_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, first_name+last_name))
    specialty = fake.random_element(
        elements=("Cardiology", "Dermatology", "Orthopedics", "Pediatrics", "Other")
    )
    contact_email = f"{first_name.lower()}.{last_name.lower()}@gmail.com"
    contact_phone = fake.phone_number()
    k_id=str(uuid.uuid5(uuid.NAMESPACE_DNS, first_name+last_name+contact_email+contact_phone))
    assistant_doctor_data = {
        "u_id": u_id,
        "k_id":k_id,
        "profile": {
            "first_name": first_name,
            "last_name": last_name,
            "specialty": specialty,
            "supervisor_id": supervisor_id,
        },
        "contact": {"email": contact_email, "phone": contact_phone},
        "network_id": network_id,
        "organization": "org1",
        "role": "assistant_doctor",
        "keychain_id": keychain_id,
    }

    return assistant_doctor_data

def generate_data(num_doctors, num_patients, num_assistant_doctors, keychain_id_network_a, keychain_id_network_b):
    unique_patients = set()

    network_a_doctors = [generate_doctor("A", keychain_id_network_a) for _ in range(num_doctors)]
    network_b_doctors = [generate_doctor("B", keychain_id_network_b) for _ in range(num_doctors)]

    # Generate three patients with the same data for both networks
    common_patients = [generate_patient("A", unique_patients, keychain_id_network_a) for _ in range(3)] # redundancy issue in net-B
    network_a_patients = common_patients + [generate_patient("A", unique_patients, keychain_id_network_a) for _ in range(num_patients - 3)]
    network_b_patients = common_patients + [generate_patient("B", unique_patients, keychain_id_network_b) for _ in range(num_patients - 3)]

    network_a_supervisor_ids = [doctor["u_id"] for doctor in network_a_doctors]
    network_b_supervisor_ids = [doctor["u_id"] for doctor in network_b_doctors]

    network_a_assistant_doctors = [
        generate_assistant_doctor("A", supervisor_id, keychain_id_network_a)
        for supervisor_id in network_a_supervisor_ids[:num_assistant_doctors]
    ]
    network_b_assistant_doctors = [
        generate_assistant_doctor("B", supervisor_id, keychain_id_network_b)
        for supervisor_id in network_b_supervisor_ids[:num_assistant_doctors]
    ]

    data = {
        "NetworkA": {
            "Doctors": network_a_doctors,
            "Patients": network_a_patients,
            "AssistantDoctors": network_a_assistant_doctors,
        },
        "NetworkB": {
            "Doctors": network_b_doctors,
            "Patients": network_b_patients,
            "AssistantDoctors": network_b_assistant_doctors,
        },
    }

    return data

data = generate_data(5, 20, 2, keychain1_id, keychain2_id)

script_dir = os.path.dirname(os.path.abspath(__file__))

# Create the 'userData' directory if it doesn't exist
os.makedirs(os.path.join(script_dir, "userData"), exist_ok=True)

# Save data to a JSON file inside the 'userData' directory
json_file_path = os.path.join(script_dir, "userData", "medical_data.json")
with open(json_file_path, "w") as json_file:
    json.dump(data, json_file, indent=2)

print(f"Data generated and saved to '{json_file_path}'")