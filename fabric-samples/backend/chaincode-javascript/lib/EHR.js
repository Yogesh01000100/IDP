"use strict";

const { Contract } = require("fabric-contract-api");
const {
  checkPatientRole,
  checkAsstDoctorRole,
  checkDoctorRole,
} = require("./role-check.js");
const { checkPatientCapability } = require("./capability-check.js");

class EHRContract extends Contract {
  async InitLedger(ctx) {
    const networkData = [
      {
        u_id: "caba15bf-62f4-56f4-878e-da8e9272a7d8",
        role: "patient",
        first_name: "Simran",
        last_name: "mishra",
        contact_email: "simran.mishra@hospital-2.com",
        contact_phone: "09120432555",
        network_id: "HSPB",
        capabilities: ["c1"],
      },
      {
        u_id: "a72d8410-cecf-578d-8691-8baf307eb127",
        role: "patient",
        first_name: "Kiara",
        last_name: "Kanda",
        contact_email: "kiara.kanda@hospital-2.com",
        contact_phone: "8414703241",
        network_id: "HSPB",
        capabilities: ["c1"],
      },
    ];

    for (const record of networkData) {
      await ctx.stub.putState(record.u_id, Buffer.from(JSON.stringify(record)));
      console.info(`User record ${record.u_id} initialized`);
    }
  }

  async GetMyProfileDoctor(ctx, user_id) {
    try {
      const validUser = await checkDoctorRole(ctx.stub);

      if (!validUser) {
        throw new Error("Access denied. Insufficient permissions.");
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

  async GetMyProfilePatient(ctx, u_id) {
    try {
      const userExists = await this.UserExists(ctx, u_id);
      if (!userExists) {
        throw new Error(`The user with ID ${u_id} does not exist`);
      }

      const userData = await ctx.stub.getState(u_id);
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
        throw new Error("Access denied. Insufficient permissions.");
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

  async UserExists(ctx, u_id) {
    const record = await ctx.stub.getState(u_id);
    if (!record || record.length === 0) {
      console.error(`User with ID ${u_id} not found.`);
      return false;
    }
    console.info(`User with ID ${u_id} exists.`);
    return true;
  }
}

module.exports = EHRContract;
