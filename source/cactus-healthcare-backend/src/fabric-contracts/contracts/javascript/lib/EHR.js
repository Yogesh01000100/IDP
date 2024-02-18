'use strict';
const { Contract } = require('fabric-contract-api');
const { v4: uuidv4 } = require('uuid');
const { checkDoctorRole, checkPatientRole, checkAsstDoctorRole } = require('./role-check.js');

class EHRContract extends Contract {


    async init(ctx) {
        const networkData = {
            "NetworkA": {
                "Doctors": [
                  {
                    "u_id": "d49a5287-7739-5b2e-badc-5afecce1180c",
                    "role": "doctor",
                    "first_name": "Aradhya",
                    "last_name": "Kurian",
                    "specialty": "Other",
                    "contact_email": "aradhya.kurian@gmail.com",
                    "contact_phone": "7458868037",
                    "network_id": "HSPA",
                    "organization": "org1"
                  },
                  {
                    "u_id": "7c25291d-632e-5123-9a86-10e32b2a5c68",
                    "role": "doctor",
                    "first_name": "Darshit",
                    "last_name": "Amble",
                    "specialty": "Dermatology",
                    "contact_email": "darshit.amble@gmail.com",
                    "contact_phone": "3547847802",
                    "network_id": "HSPA",
                    "organization": "org1"
                  },
                  {
                    "u_id": "ffd06eda-2ed5-57fd-be18-79349299b8ed",
                    "role": "doctor",
                    "first_name": "Prisha",
                    "last_name": "Saxena",
                    "specialty": "Cardiology",
                    "contact_email": "prisha.saxena@gmail.com",
                    "contact_phone": "0538681448",
                    "network_id": "HSPA",
                    "organization": "org1"
                  }
                ],
                "Patients": [
                  {
                    "u_id": "ab04032a-af7c-51b9-b661-14304ee96848",
                    "role": "patient",
                    "first_name": "Samiha",
                    "last_name": "Arya",
                    "date_of_birth": "1971-12-26",
                    "gender": "Female",
                    "address": "H.No. 740\nChandran Path\nDanapur 025588",
                    "contact_email": "samiha.arya@gmail.com",
                    "contact_phone": "04362431066",
                    "emergency_contact_name": "Inaaya  Bajaj",
                    "emergency_contact_phone": "+919658138852",
                    "network_id": "HSPA",
                    "organization": "org1",
                    "data": []
                  },
                  {
                    "u_id": "660992eb-ee20-59a1-9a0f-b37f54f0bff2",
                    "role": "patient",
                    "first_name": "Kismat",
                    "last_name": "Kalita",
                    "date_of_birth": "1936-04-12",
                    "gender": "Female",
                    "address": "687\nChaudry Circle\nPimpri-Chinchwad-514935",
                    "contact_email": "kismat.kalita@gmail.com",
                    "contact_phone": "7114421369",
                    "emergency_contact_name": "Shray Bandi",
                    "emergency_contact_phone": "+912203832495",
                    "network_id": "HSPA",
                    "organization": "org1",
                    "data": []
                  },
                  {
                    "u_id": "91883d87-b98b-5841-896f-e4d6aa731c95",
                    "role": "patient",
                    "first_name": "Baiju",
                    "last_name": "Shroff",
                    "date_of_birth": "1992-01-18",
                    "gender": "Male",
                    "address": "044\nGuha Marg\nKirari Suleman Nagar-848413",
                    "contact_email": "baiju.shroff@gmail.com",
                    "contact_phone": "9878250598",
                    "emergency_contact_name": "Biju Khatri",
                    "emergency_contact_phone": "9748884235",
                    "network_id": "HSPA",
                    "organization": "org1",
                    "data": []
                  }
                ],
                "AssistantDoctors": [
                  {
                    "u_id": "122f782c-7215-5a08-ae98-47b888486cef",
                    "role": "assistant_doctor",
                    "first_name": "Shlok",
                    "last_name": "Cheema",
                    "specialty": "Pediatrics",
                    "supervisor_id": "d49a5287-7739-5b2e-badc-5afecce1180c",
                    "contact_email": "shlok.cheema@gmail.com",
                    "contact_phone": "+911271502789",
                    "network_id": "HSPA",
                    "organization": "org1"
                  }
                ],
                "Appointments": [
                  {
                    "appointment_id": "5f2b80e7-0c93-4d61-b1e7-8c13675c1033",
                    "patient_id": "ab04032a-af7c-51b9-b661-14304ee96848",
                    "doctor_id": "d49a5287-7739-5b2e-badc-5afecce1180c",
                    "network_id": "HSPA",
                    "status": "pending",
                    "ehr_req": "false",
                    "data": []
                  }
                ]
              }
        };

        for (const network in networkData) {
            const networkObject = networkData[network];
            for (const entity in networkObject) {
                const entityArray = networkObject[entity];
                for (const item of entityArray) {
                    const key = `${entity}_${item.u_id}`;
                    const record = await ctx.stub.getState(key);
    
                    if (!record || record.length === 0) {
                        await ctx.stub.putState(key, Buffer.from(JSON.stringify(item)));
                    } else {
                        console.log(`Data already exists in the state for key: ${key}`);
                    }
                }
            }
        }
    }

    // Create Doctor
    async CreateDoctor(ctx, doctor_id, data) {
        try {
            const validUser = await checkDoctorRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const exists = await this.UserExists(ctx, doctor_id);
            if (exists) {
                throw new Error(`The doctor with ID ${doctor_id} already exists`);
            }

            const doctor = { u_id: doctor_id, data: data };
            await ctx.stub.putState(doctor_id, Buffer.from(JSON.stringify(doctor)));
        } catch (error) {
            console.error("An error occurred in CreateDoctor:", error.message);
            throw error;
        }
    }

    // Create Patient
    async CreatePatient(ctx, patient_id, data) {
        try {
            const validUser = await checkPatientRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const exists = await this.UserExists(ctx, patient_id);
            if (exists) {
                throw new Error(`The patient with ID ${patient_id} already exists`);
            }

            const patient = { u_id: patient_id, data: data };
            await ctx.stub.putState(patient_id, Buffer.from(JSON.stringify(patient)));
        } catch (error) {
            console.error("An error occurred in CreatePatient:", error.message);
            throw error;
        }
    }

    async GetMyProfileDoctor(ctx, user_id) {
        try {
            const validUser = await checkDoctorRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const userExists = await this.UserExists(ctx, user_id);
            if (!userExists) {
                throw new Error(`The user with ID ${user_id} does not exist`);
            }

            const userData = await ctx.stub.getState(user_id);
            const userProfile = JSON.parse(userData.toString());

            return JSON.stringify(userProfile);
        } catch (error) {
            console.error("An error occurred:", error.message);
            throw error;
        }
    }

    async GetMyProfilePatient(ctx, user_id) {
        try {
            const validUser = await checkPatientRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const userExists = await this.UserExists(ctx, user_id);
            if (!userExists) {
                throw new Error(`The user with ID ${user_id} does not exist`);
            }

            const userData = await ctx.stub.getState(user_id);
            const userProfile = JSON.parse(userData.toString());

            return JSON.stringify(userProfile);
        } catch (error) {
            console.error("An error occurred:", error.message);
            throw error;
        }
    }

    async GetMyProfileAssistantDoctor(ctx, user_id) {
        try {
            const validUser = await checkAsstDoctorRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const userExists = await this.UserExists(ctx, user_id);
            if (!userExists) {
                throw new Error(`The user with ID ${user_id} does not exist`);
            }

            const userData = await ctx.stub.getState(user_id);
            const userProfile = JSON.parse(userData.toString());

            return JSON.stringify(userProfile);
        } catch (error) {
            console.error("An error occurred:", error.message);
            throw error;
        }
    }
    
    // Create Appointment
    async CreateAppointment(ctx, patient_id, doctor_id) {
        try {
            const validUser = await checkPatientRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const patientExists = await this.UserExists(ctx, patient_id);
            if (!patientExists) {
                throw new Error(`The patient with ID ${patient_id} does not exist`);
            }

            const doctorExists = await this.UserExists(ctx, doctor_id);
            if (!doctorExists) {
                throw new Error(`The doctor with ID ${doctor_id} does not exist`);
            }

            const generatedAppointmentId =uuidv4();
            const appointment = { appointment_id: generatedAppointmentId, status: 'pending' };
            await ctx.stub.putState(generatedAppointmentId, Buffer.from(JSON.stringify(appointment)));

            return JSON.stringify({ success: true, message: 'Appointment created successfully', appointment_id: generatedAppointmentId });
        } catch (error) {
            console.error("An error occurred in CreateAppointment:", error.message);
            throw error;
        }
    }

    // Accept Appointment
    async AcceptAppointment(ctx, appointment_id) {
        try {
            const validUser = await checkDoctorRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const exists = await this.AppointmentExists(ctx, appointment_id);
            if (!exists) {
                throw new Error(`The appointment with ID ${appointment_id} does not exist`);
            }

            const acceptedAppointment = { appointment_id: appointment_id, status: 'accepted' };
            await ctx.stub.putState(appointment_id, Buffer.from(JSON.stringify(acceptedAppointment)));

            return JSON.stringify({ success: true, message: 'Appointment accepted successfully', appointment_id: appointment_id });
        } catch (error) {
            console.error("An error occurred in AcceptAppointment:", error.message);
            throw error;
        }
    }

    // Get Appointment
    async GetAppointmentData(ctx, user_id) {
        try {
            const validUser = await checkDoctorRole(ctx.stub) || await checkPatientRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const exists = await this.AppointmentExists(ctx, user_id);
            if (!exists) {
                throw new Error(`The appointment associated with userId: ${user_id} does not exist`);
            }

            const appointmentData = await ctx.stub.getState(user_id);
            const parsedAppointmentData = JSON.parse(appointmentData.toString());

            return JSON.stringify(parsedAppointmentData);
        } catch (error) {
            console.error("An error occurred in GetAppointment:", error.message);
            throw error;
        }
    }

    // Send My EHR into Appointment Schema
    async SendEHRToAppointment(ctx, appointment_id, ehrData) {
        try {
            const validUser = await checkPatientRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const exists = await this.AppointmentExists(ctx, appointment_id);
            if (!exists) {
                throw new Error(`The appointment with ID ${appointment_id} does not exist`);
            }

            const appointmentData = await ctx.stub.getState(appointment_id);
            const parsedAppointmentData = JSON.parse(appointmentData.toString());

            parsedAppointmentData.ehr = ehrData;
            await ctx.stub.putState(appointment_id, Buffer.from(JSON.stringify(parsedAppointmentData)));

            return JSON.stringify({ success: true, message: 'EHR sent to appointment successfully', appointment_id: appointment_id });
        } catch (error) {
            console.error("An error occurred in SendEHRToAppointment:", error.message);
            throw error;
        }
    }

    // Get Patient EHR ( Doctor )
    async GetEHRForDoctor(ctx, appointment_id) {
        try {
            const validUser = await checkDoctorRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const appointmentExists = await this.AppointmentExists(ctx, appointment_id);
            if (!appointmentExists) {
                throw new Error(`The appointment with ID ${appointment_id} does not exist`);
            }

            // Fetch EHR data from the appointment
            const patientEHRData = await ctx.stub.getState(appointment_id);
            const parsedPatientEHRData = JSON.parse(patientEHRData.toString());

            return JSON.stringify(parsedPatientEHRData);
        } catch (error) {
            console.error("An error occurred in GetPatientEHRForDoctor:", error.message);
            throw error;
        }
    }


    // Get My EHR ( Patient )
    async GetEHRForPatient(ctx, user_id) {
        try {
            const validUser = await checkPatientRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const exists = await this.UserExists(ctx, user_id);
            if (!exists) {
                throw new Error(`The user with ID ${user_id} does not exist`);
            }

            const patientEHRData = await ctx.stub.getState(user_id);
            const parsedPatientEHRData = JSON.parse(patientEHRData.toString());

            return JSON.stringify(parsedPatientEHRData);
        } catch (error) {
            console.error("An error occurred in GetMyEHRForPatient:", error.message);
            throw error;
        }
    }

    async AppointmentExists(ctx, appointment_id) {
        const record = await ctx.stub.getState(appointment_id);
        return !!record && record.length > 0;
    }

    async UserExists(ctx, user_id) {
        const record = await ctx.stub.getState(user_id);
        return !!record && record.length > 0;
    }
}

module.exports = EHRContract;