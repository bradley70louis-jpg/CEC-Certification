// backend/index.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// ---- Simple JSON “DB” persisted to disk ----
const DB_PATH = path.join(__dirname, "db.json");

function loadDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [], certificates: [] };
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    console.error("❌ Failed to load DB:", e);
    return { users: [], certificates: [] };
  }
}

function saveDB(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (e) {
    console.error("❌ Failed to save DB:", e);
  }
}

let db = loadDB();

// ---- Helpers ----
function makeToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing Bearer token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
}

function normCertId(id) {
  return String(id || "").trim();
}

// ---- AUTH ----
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ error: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    email,
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  };

  db.users.unshift(user);
  saveDB(db);

  const token = makeToken(user);
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = makeToken(user);
  res.json({ token, user: { id: user.id, email: user.email } });
});

// ---- CERTIFICATES (per-user, certificateId = entered certificate number) ----
// A certificate record looks like:
// {
//   id: "EICR-000123"   (certificate number you typed)
//   userId: "..."       (owner)
//   type: "EICR"
//   property: { address, postcode }
//   createdAt, updatedAt
//   data: { page1, page2, page3, page4, cuSchedule }  (full payload)
// }

app.get("/api/certificates", auth, (req, res) => {
  const list = db.certificates
    .filter((c) => c.userId === req.user.userId)
    .map((c) => ({
      id: c.id,
      type: c.type,
      property: c.property,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

  res.json({ certificates: list });
});

app.get("/api/certificates/:id", auth, (req, res) => {
  const id = normCertId(req.params.id);
  const cert = db.certificates.find(
    (c) => c.userId === req.user.userId && c.id === id
  );
  if (!cert) return res.status(404).json({ error: "Certificate not found" });
  res.json({ certificate: cert });
});

app.post("/api/certificates", auth, (req, res) => {
  const { id, type, property, data } = req.body || {};
  const certId = normCertId(id);

  if (!certId) return res.status(400).json({ error: "id (certificate number) is required" });
  if (!type) return res.status(400).json({ error: "type is required" });

  const exists = db.certificates.find(
    (c) => c.userId === req.user.userId && c.id === certId
  );
  if (exists) {
    return res.status(409).json({ error: "Certificate ID already exists" });
  }

  const now = new Date().toISOString();
  const cert = {
    id: certId,
    userId: req.user.userId,
    type,
    property: property || { address: "", postcode: "" },
    data: data || {},
    createdAt: now,
    updatedAt: now,
  };

  db.certificates.unshift(cert);
  saveDB(db);
  res.json({ certificate: cert });
});

app.put("/api/certificates/:id", auth, (req, res) => {
  const id = normCertId(req.params.id);
  const idx = db.certificates.findIndex(
    (c) => c.userId === req.user.userId && c.id === id
  );
  if (idx === -1) return res.status(404).json({ error: "Certificate not found" });

  const existing = db.certificates[idx];
  const { property, data } = req.body || {};

  const updated = {
    ...existing,
    property: property ? { ...existing.property, ...property } : existing.property,
    data: data ? data : existing.data,
    updatedAt: new Date().toISOString(),
  };

  db.certificates[idx] = updated;
  saveDB(db);
  res.json({ certificate: updated });
});

// ---- HEALTH ----
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`✅ DB file: ${DB_PATH}`);
});
