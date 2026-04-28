require("dotenv").config();
const express = require("express");
const app = express();
const port = 8080;

const Character = require("./models/Character");
const Magic = require("./models/Magic");
const Level = require("./models/Level");
const authRoutes = require("./routes/auth");
const { verifyToken, verifyRole } = require("./middleware/auth");

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/list-characters", async (req, res) => {
  try {
    const characters = await Character.find();
    res.render("list-characters", { characters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/new-character", (req, res) => {
  res.render("new-character");
});

app.post("/new-character", async (req, res) => {
  try {
    const characterData = {
      name: req.body.name,
      weapon: req.body.weapon,
      role: req.body.role,
      level: parseInt(req.body.level),
      hp: parseInt(req.body.hp),
      isAlive: req.body.isAlive === "on",
    };
    await Character.create(characterData);
    res.redirect("/list-characters");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get("/list-magics", async (req, res) => {
  try {
    const magics = await Magic.find();
    res.render("list-magics", { magics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/new-magic", (req, res) => {
  res.render("new-magic");
});


app.post("/new-magic", async (req, res) => {
  try {
    const magicData = {
      name: req.body.name,
      element: req.body.element,
      mpCost: parseInt(req.body.mpCost),
      isUnlocked: req.body.isUnlocked === "on",
    };
    await Magic.create(magicData);
    res.redirect("/list-magics");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/list-levels", async (req, res) => {
  try {
    const levels = await Level.find().populate("character");
    res.render("list-levels", { levels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/new-level", async (req, res) => {
  try {
    const characters = await Character.find();
    res.render("new-level", { characters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/new-level", async (req, res) => {
  try {
    const levelData = {
      worldName: req.body.worldName,
      character: req.body.character,
      starsCollected: parseInt(req.body.starsCollected),
      isCompleted: req.body.isCompleted === "on",
      completedAt: req.body.isCompleted === "on" ? new Date() : null,
    };
    await Level.create(levelData);
    res.redirect("/list-levels");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get("/api/characters", verifyToken, async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/characters/:id", async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/characters", verifyToken, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }
    const newCharacter = await Character.create(req.body);
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/characters/:id", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!character) {
      return res.status(404).json({ error: "Character does not exist" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/characters/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) {
      return res.status(404).json({ error: "Character does not exist" });
    }
    await Level.deleteMany({ character: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/magics", async (req, res) => {
  try {
    const magics = await Magic.find();
    res.json(magics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/magics/:id", async (req, res) => {
  try {
    const magic = await Magic.findById(req.params.id);
    if (!magic) {
      return res.status(404).json({ error: "Magic not found" });
    }
    res.json(magic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/magics", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }
    const newMagic = await Magic.create(req.body);
    res.status(201).json(newMagic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/magics/:id", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }
    const magic = await Magic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!magic) {
      return res.status(404).json({ error: "Magic does not exist" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/magics/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const magic = await Magic.findByIdAndDelete(req.params.id);
    if (!magic) {
      return res.status(404).json({ error: "Magic does not exist" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/levels", async (req, res) => {
  try {
    const levels = await Level.find().populate("character");
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/levels/:id", async (req, res) => {
  try {
    const level = await Level.findById(req.params.id).populate("character");
    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }
    res.json(level);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/levels", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }
    const newLevel = await Level.create(req.body);
    res.status(201).json(newLevel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/levels/:id", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }
    const level = await Level.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!level) {
      return res.status(404).json({ error: "Level does not exist" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/levels/:id", async (req, res) => {
  try {
    const level = await Level.findByIdAndDelete(req.params.id);
    if (!level) {
      return res.status(404).json({ error: "Level does not exist" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;