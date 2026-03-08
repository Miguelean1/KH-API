const request = require("supertest");
const sinon = require("sinon");
const mongoose = require("mongoose");
const { expect } = require("chai");

const app = require("../app");
const Character = require("../models/Character");

describe("Characters API Unit Tests (Mocks)", () => {

  afterEach(() => {
    sinon.restore(); 
  });

  it("GET all characters", async () => {
    sinon.stub(Character, "find").resolves([
      { _id: "1", name: "Sora", weapon: "Keyblade", role: "Hero", level: 50 },
      { _id: "2", name: "Donald", weapon: "Staff", role: "Mage", level: 48 }
    ]);

    const res = await request(app).get("/api/characters");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(2);
    expect(res.body[0].name).to.equal("Sora");
  });

  it("POST correct character", async () => {
    sinon.stub(Character, "create").resolves({
      _id: "abc",
      name: "Riku",
      weapon: "Way to the Dawn",
      level: 52
    });

    const res = await request(app)
      .post("/api/characters")
      .send({ name: "Riku", weapon: "Way to the Dawn", level: 52 });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");
    expect(res.body.name).to.equal("Riku");
  });

  it("GET character by ID", async () => {
    sinon.stub(Character, "findById").resolves({
      _id: "1", name: "Goofy", weapon: "Shield", role: "Defender"
    });

    const res = await request(app).get("/api/characters/1");

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("Goofy");
  });

  it("POST with empty body", async () => {
    const res = await request(app).post("/api/characters").send({});

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Request body is empty");
  });

  it("POST with validation error", async () => {
    const err = new mongoose.Error.ValidationError();
    err.addError("level", new mongoose.Error.ValidatorError({ message: "Level must be greater than 0" }));
    sinon.stub(Character, "create").rejects(err);

    const res = await request(app)
      .post("/api/characters")
      .send({ name: "Sora", level: -5 }); 

    expect(res.status).to.equal(400);
    expect(res.body.error).to.include("Level must be greater than 0");
  });

});
