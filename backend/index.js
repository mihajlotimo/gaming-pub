require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const pool = require("./database");
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));
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
        ? `http://localhost:3000/images/games/${game.image_filename}`
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
      1: "http://localhost:3000/images/setups/setup_1.jpg",
      2: "http://localhost:3000/images/setups/setup_2.jpg",
      3: "http://localhost:3000/images/setups/setup_3.jpg",
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
      1: "http://localhost:3000/images/setups/setup_1.jpg",
      2: "http://localhost:3000/images/setups/setup_2.jpg",
      3: "http://localhost:3000/images/setups/setup_3.jpg",
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
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
