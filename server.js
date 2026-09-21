const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { sql, connectToDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Login API
app.post("/api/login", async (req, res) => {

    const { username, password } = req.body;

    try {

        const pool = await connectToDatabase();

        const result = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .query(`
                SELECT Id, Username, PasswordHash
                FROM Users
                WHERE Username = @username
            `);

        // User does not exist
        if (result.recordset.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });

        }

        const user = result.recordset[0];

        // Compare entered password with the stored bcrypt hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.PasswordHash
        );

        // Password is incorrect
        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });

        }

        // Username and password are correct
        return res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {

        console.error("Login error:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Database error"
        });

    }
});

// Start server
app.listen(PORT, () => {
    console.log(`EFG Web App is running on http://localhost:${PORT}`);
});

