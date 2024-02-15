'use strict';
const { Contract } = require('fabric-contract-api');
const { v4: uuidv4 } = require('uuid');
const { checkDoctorRole, checkPatientRole } = require('./role-check.js');

class EHRContract extends Contract {

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

    async GetMyProfile(ctx, user_id) {
        try {
            const validUser = await checkDoctorRole(ctx.stub) || await checkPatientRole(ctx.stub);

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

    // Get Appointment( display in sidebar )
    async GetAppointmentData(ctx, appointment_id) {
        try {
            const validUser = await checkDoctorRole(ctx.stub) || await checkPatientRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const exists = await this.AppointmentExists(ctx, appointment_id);
            if (!exists) {
                throw new Error(`The appointment with ID ${appointment_id} does not exist`);
            }

            const appointmentData = await ctx.stub.getState(appointment_id);
            const parsedAppointmentData = JSON.parse(appointmentData.toString());

            return JSON.stringify(parsedAppointmentData);
        } catch (error) {
            console.error("An error occurred in GetAppointment:", error.message);
            throw error;
        }
    }

    // Send My EHR into Appointment Schema
    async SendEHRToAppointment(ctx, patient_id, appointment_id, ehrData) {
        try {
            const validUser = await checkPatientRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const patientExists = await this.UserExists(ctx, patient_id);
            if (!patientExists) {
                throw new Error(`The patient with ID ${patient_id} does not exist`);
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