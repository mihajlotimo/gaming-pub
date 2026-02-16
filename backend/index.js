require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const pool = require("./database");
//const port = 3000;
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

app.use(cors());
app.use(express.json());
app.use(
  "/images/games",
  express.static(path.join(__dirname, "public/images/games")),
);
app.use(
  "/images/setups",
  express.static(path.join(__dirname, "public/images/setups")),
);

//ROUTES//

// Register User
app.post("/users", async (req, res) => {
  try {
    const { username, fname, lname, mail, password } = req.body;
    const result = await pool.query(
      "INSERT INTO users (username, fname, lname, mail, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, fname, lname, mail, password],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { mail, username, password } = req.body;
    const loginField = mail || username;

    const result = await pool.query(
      "SELECT * FROM users WHERE (username = $1 OR mail = $1) AND password = $2",
      [loginField, password],
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update User Firstname
app.put("/users/:userId/firstname", async (req, res) => {
  try {
    const { userId } = req.params;
    const { fname } = req.body;

    if (!fname) {
      return res.status(400).json({ error: "Ime je obavezno" });
    }

    const result = await pool.query(
      "UPDATE users SET fname = $1 WHERE user_id = $2 RETURNING *",
      [fname, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Korisnik nije pronađen" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update User Lastname
app.put("/users/:userId/lastname", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lname } = req.body;

    if (!lname) {
      return res.status(400).json({ error: "Prezime je obavezno" });
    }

    const result = await pool.query(
      "UPDATE users SET lname = $1 WHERE user_id = $2 RETURNING *",
      [lname, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Korisnik nije pronađen" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update User Password
app.put("/users/:userId/password", async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Lozinka je obavezna" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Lozinka mora imati najmanje 6 karaktera" });
    }

    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *",
      [password, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Korisnik nije pronađen" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update Username
app.put("/users/:userId/username", async (req, res) => {
  try {
    const { userId } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Korisničko ime je obavezno" });
    }

    // Proverava da li je username već u upotrebi
    const checkUsername = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND user_id != $2",
      [username, userId],
    );

    if (checkUsername.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Korisničko ime je već u upotrebi" });
    }

    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE user_id = $2 RETURNING *",
      [username, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Korisnik nije pronađen" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update User Mail
app.put("/users/:userId/mail", async (req, res) => {
  try {
    const { userId } = req.params;
    const { mail } = req.body;

    if (!mail) {
      return res.status(400).json({ error: "Email je obavezan" });
    }

    // Validacija email-a
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mailRegex.test(mail)) {
      return res.status(400).json({ error: "Unesite validan email" });
    }

    // Proverava da li je email već u upotrebi
    const checkMail = await pool.query(
      "SELECT * FROM users WHERE mail = $1 AND user_id != $2",
      [mail, userId],
    );

    if (checkMail.rows.length > 0) {
      return res.status(400).json({ error: "Email je već u upotrebi" });
    }

    const result = await pool.query(
      "UPDATE users SET mail = $1 WHERE user_id = $2 RETURNING *",
      [mail, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Korisnik nije pronađen" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get All Games
app.get("/games", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT g.game_id, g.game_name, g.image_filename, d.game_description FROM games g LEFT JOIN descriptions d ON g.game_id = d.game_id",
    );
    const gamesWithDesc = result.rows.map((game) => ({
      game_id: game.game_id,
      name: game.game_name,
      image: game.image_filename
        ? `${BASE_URL}/images/games/${game.image_filename}`
        : null,
      description: game.game_description,
    }));
    res.json(gamesWithDesc);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Setups by Type (pc, sony, moto)
app.get("/setups/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ["pc", "sony", "moto"];

    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({ error: "Invalid setup type" });
    }

    const result = await pool.query(`SELECT * FROM ${type.toLowerCase()}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get All Setups
app.get("/setups", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM setups ORDER BY id");

    const setupImages = {
      1: `${BASE_URL}/images/setups/setup_1.jpg`,
      2: `${BASE_URL}/images/setups/setup_2.jpg`,
      3: `${BASE_URL}/images/setups/setup_3.jpg`,
    };

    const formattedSetups = result.rows.map((setup) => ({
      id: setup.id,
      name: setup.setup_name,
      description: setup.description || "",
      basePrice: setup.setup_price,
      available: setup.setup_count,
      image: setupImages[setup.id] || null,
    }));

    res.json(formattedSetups);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get All Promotions with Setup Info
app.get("/promotions", async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT s.id, s.setup_name, s.setup_price, p.duration_hours, p.price 
            FROM setups s
            LEFT JOIN promotions p ON s.id = p.setup_id
            ORDER BY s.id, p.duration_hours
        `);

    const setupImages = {
      1: `${BASE_URL}/images/setups/setup_1.jpg`,
      2: `${BASE_URL}/images/setups/setup_2.jpg`,
      3: `${BASE_URL}/images/setups/setup_3.jpg`,
    };

    const promotionsGrouped = {};
    result.rows.forEach((row) => {
      if (!promotionsGrouped[row.id]) {
        promotionsGrouped[row.id] = {
          id: row.id,
          name: row.setup_name,
          basePrice: row.setup_price,
          image: setupImages[row.id] || null,
          promotions: [],
        };
      }
      if (row.duration_hours) {
        let durationText;
        if (row.duration_hours === 3) {
          durationText = "3 sata";
        } else if (row.duration_hours === 5) {
          durationText = "5 sati";
        } else if (row.duration_hours === 8) {
          durationText = "Ceo dan";
        } else {
          durationText = `${row.duration_hours} ${row.duration_hours === 1 ? "sat" : "sati"}`;
        }

        promotionsGrouped[row.id].promotions.push({
          hours: row.duration_hours,
          duration: durationText,
          price: row.price,
        });
      }
    });

    res.json(Object.values(promotionsGrouped));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create Reservation
app.post("/reservations", async (req, res) => {
  try {
    const {
      user_id,
      setup_id,
      device_type,
      device_id,
      reservation_date,
      start_time,
      duration_hours,
      total_price,
    } = req.body;

    // Validacija
    const validDeviceTypes = ["pc", "sony", "moto"];
    if (!validDeviceTypes.includes(device_type)) {
      return res.status(400).json({ error: "Invalid device type" });
    }

    const result = await pool.query(
      `INSERT INTO reservations 
            (user_id, setup_id, device_type, device_id, reservation_date, start_time, duration_hours, total_price) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
      [
        user_id,
        setup_id,
        device_type,
        device_id,
        reservation_date,
        start_time,
        duration_hours,
        total_price,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.message.includes("već rezervisan")) {
      res.status(409).json({ error: "Uređaj je već rezervisan u tom terminu" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get User Reservations
app.get("/reservations/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT r.*, s.setup_name, s.setup_price
            FROM reservations r
            JOIN setups s ON r.setup_id = s.id
            WHERE r.user_id = $1
            ORDER BY r.reservation_date DESC, r.start_time DESC`,
      [userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Available Devices
app.post("/devices/available", async (req, res) => {
  try {
    const { device_type, reservation_date, start_time, duration_hours } =
      req.body;

    const validDeviceTypes = ["pc", "sony", "moto"];
    if (!validDeviceTypes.includes(device_type)) {
      return res.status(400).json({ error: "Invalid device type" });
    }

    // Pronađi sve uređaje tog tipa
    const allDevices = await pool.query(`SELECT * FROM ${device_type}`);

    // Pronađi rezervisane uređaje u tom terminu
    const reservedDevices = await pool.query(
      `SELECT device_id FROM reservations
            WHERE device_type = $1
            AND reservation_date = $2
            AND status = 'active'
            AND (
                (start_time, start_time + (duration_hours || ' hours')::INTERVAL) 
                OVERLAPS 
                ($3::TIME, $3::TIME + ($4 || ' hours')::INTERVAL)
            )`,
      [device_type, reservation_date, start_time, duration_hours],
    );

    const reservedIds = reservedDevices.rows.map((r) => r.device_id);
    const availableDevices = allDevices.rows.filter((device) => {
      const idField = `${device_type}_id`;
      return !reservedIds.includes(device[idField]);
    });

    res.json(availableDevices);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get All Reservations (for admin)
app.get("/reservations", async (req, res) => {
  try {
    const { date, status } = req.query;
    let query = `
            SELECT r.*, s.setup_name, u.username, u.fname, u.lname
            FROM reservations r
            JOIN setups s ON r.setup_id = s.id
            JOIN users u ON r.user_id = u.user_id
        `;
    const params = [];
    const conditions = [];

    if (date) {
      params.push(date);
      conditions.push(`r.reservation_date = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`r.status = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY r.reservation_date DESC, r.start_time DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update Reservation
app.put("/reservations/:reservationId", async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { reservation_date, start_time, duration_hours } = req.body;
    const result = await pool.query(
      `UPDATE reservations 
            SET reservation_date = $1, start_time = $2, duration_hours = $3 
            WHERE reservation_id = $4 
            RETURNING *`,
      [reservation_date, start_time, duration_hours, reservationId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.message.includes("već rezervisan")) {
      res.status(409).json({ error: "Uređaj je već rezervisan u tom terminu" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Cancel Reservation
app.patch("/reservations/:reservationId/cancel", async (req, res) => {
  try {
    const { reservationId } = req.params;
    const result = await pool.query(
      `UPDATE reservations 
            SET status = 'cancelled' 
            WHERE reservation_id = $1 
            RETURNING *`,
      [reservationId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete Reservation
app.delete("/reservations/:reservationId", async (req, res) => {
  try {
    const { reservationId } = req.params;
    const result = await pool.query(
      "DELETE FROM reservations WHERE reservation_id = $1 RETURNING *",
      [reservationId],
    );
    if (result.rows.length > 0) {
      res.json({ message: "Reservation deleted successfully" });
    } else {
      res.status(404).json({ error: "Reservation not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Available Time Slots
app.post("/available-slots", async (req, res) => {
  try {
    const { device_type, reservation_date, duration_hours } = req.body;

    const validDeviceTypes = ["pc", "sony", "moto"];
    if (!validDeviceTypes.includes(device_type)) {
      return res.status(400).json({ error: "Invalid device type" });
    }

    if (!reservation_date || !duration_hours) {
      return res
        .status(400)
        .json({ error: "reservation_date and duration_hours are required" });
    }

    const durationInt = parseInt(duration_hours);
    if (isNaN(durationInt) || durationInt < 1) {
      return res
        .status(400)
        .json({ error: "duration_hours must be a valid number" });
    }

    const date = new Date(reservation_date);
    if (isNaN(date.getTime())) {
      return res
        .status(400)
        .json({ error: "reservation_date must be a valid date (YYYY-MM-DD)" });
    }

    const dayOfWeek = date.getDay();

    // Radno vreme na osnovu dana
    let workingHours = { start: 12, end: 22 }; // Ponedeljak-Petak
    if (dayOfWeek === 6) {
      // Subota
      workingHours = { start: 10, end: 23 };
    }
    if (dayOfWeek === 0) {
      // Nedelja
      return res.status(400).json({ error: "Ne radimo nedeljom" });
    }
    // Pronađi sve uređaje tog tipa
    const tableName = device_type.toLowerCase();
    let allDevices;
    try {
      allDevices = await pool.query(`SELECT * FROM ${tableName}`);
    } catch (tableErr) {
      console.error(`Error querying ${tableName}:`, tableErr.message);
      return res
        .status(400)
        .json({ error: `Tabela za ${device_type} ne postoji` });
    }

    const totalDevices = allDevices.rows.length;

    const availableSlots = [];

    // Za svaki sat radnog vremena
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const startTime = `${String(hour).padStart(2, "0")}:00:00`;
      const endHour = hour + durationInt;

      // Provera da li termin zadovoljava radno vreme
      if (endHour > workingHours.end) {
        break;
      }

      // Pronađi rezervisane uređaje u tom terminu
      const reservedDevices = await pool.query(
        `SELECT device_id FROM reservations
                WHERE device_type = $1
                AND reservation_date = $2
                AND status = 'active'
                AND (
                    (start_time, start_time + ($4::INTEGER || ' hours')::INTERVAL) 
                    OVERLAPS 
                    ($3::TIME, $3::TIME + ($4::INTEGER || ' hours')::INTERVAL)
                )`,
        [device_type, reservation_date, startTime, durationInt],
      );

      const reservedIds = new Set(reservedDevices.rows.map((r) => r.device_id));

      // Izračunaj raspoložive uređaje (ukupno - rezervisano)
      const availableCount = Math.max(0, totalDevices - reservedIds.size);

      if (availableCount > 0) {
        availableSlots.push({
          start_time: startTime,
          end_time: `${String(endHour).padStart(2, "0")}:00:00`,
          available_devices: availableCount,
          total_devices: totalDevices,
        });
      }
    }

    res.json(availableSlots);
  } catch (err) {
    console.error("Error in /available-slots:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${BASE_URL}`);
});
