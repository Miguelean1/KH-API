const request = require("supertest");
const mongoose = require("mongoose");
const { expect } = require("chai");

const app = require("../app");
const Magic = require("../models/Magic");

describe("Magics API Integration Tests", () => {

  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/test_api");
  });

  beforeEach(async () => {
    await Magic.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("GET all magics (empty)", async () => {
    const res = await request(app).get("/api/magics");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(0);
  });

  it("POST correct magic", async () => {
    const res = await request(app)
      .post("/api/magics")
      .send({ name: "Piro III", element: "Fire", mpCost: 15, isUnlocked: true });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");
    expect(res.body.name).to.equal("Piro III");
  });

  it("GET all magics (after adding one)", async () => {
    await Magic.create({ name: "Bolt", element: "Thunder", mpCost: 20 });

    const res = await request(app).get("/api/magics");

    expect(res.status).to.equal(200);
    expect(res.body.length).to.equal(1);
    expect(res.body[0].name).to.equal("Bolt");
  });

  it("PUT with empty body", async () => {
    const magic = await Magic.create({ name: "Blizz", element: "Ice", mpCost: 15 });

    const res = await request(app)
      .put(`/api/magics/${magic._id}`)
      .send({}); 

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Request body is empty");
  });

  it("POST missing required field (Mongoose validation)", async () => {
    const res = await request(app)
      .post("/api/magics")
      .send({ element: "Ice", mpCost: 10 }); 

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include("El nombre de la magia es obligatorio");
  });

});
