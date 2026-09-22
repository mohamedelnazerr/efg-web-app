const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { sql, connectToDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// LOGIN
app.post("/api/login", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    try {

        const pool = await connectToDatabase();

        const result = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .query(
                "SELECT Id, Username, PasswordHash " +
                "FROM Users " +
                "WHERE Username = @username"
            );

        if (result.recordset.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const user = result.recordset[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.PasswordHash
        );

        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

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


// REGISTER
app.post("/api/register", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    try {

        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const pool = await connectToDatabase();

        const existingUser = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .query(
                "SELECT Id " +
                "FROM Users " +
                "WHERE Username = @username"
            );

        if (existingUser.recordset.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool
            .request()
            .input("username", sql.NVarChar, username)
            .input("passwordHash", sql.NVarChar, passwordHash)
            .query(
                "INSERT INTO Users (Username, PasswordHash) " +
                "VALUES (@username, @passwordHash)"
            );

        return res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {

        console.error("Registration error:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
});


// START SERVER
app.listen(PORT, () => {

    console.log(
        "EFG Web App is running on http://localhost:" + PORT
    );

});

