const express = require('express');
const app = express();
const port = 5000;
const bcrypt = require('bcrypt');
const cors = require('cors');
const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',        // Database host
  user: 'root',             // Your database username
  password: '*MySQL01Girija',     // Your database password
  database: 'RS_ManagementSystem',  // The name of your database
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
});

// Export db connection to use it in other files
module.exports = db;

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for specific origin (React app at localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',  // Only allow requests from this origin (React app)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these HTTP methods
  credentials: true  // Allow credentials like cookies, headers to be sent
}));


// Sample in-memory users array (In a real app, you would use a database)
let users = [];

// Sign up route to handle user creation
app.post('/signup', (req, res) => {
  const { username, password, email, role, full_name, phone_number } = req.body;

  // Validate if all fields are provided
  if (!username || !password || !email || !role || !full_name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the username already exists
  const userCheckQuery = 'SELECT * FROM Users WHERE username = ? OR email = ?';
  db.query(userCheckQuery, [username, email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing password' });
      }

      // Insert new user into the Users table
      const insertQuery = `INSERT INTO Users (username, password_hash, email, role, full_name, phone_number)
                           VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(insertQuery, [username, hashedPassword, email, role, full_name, phone_number], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating user' });
        }

        // Respond with success
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the user exists
  const query = 'SELECT * FROM Users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    // Check if the username exists
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    // Compare the password with the stored hashed password
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing password' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Return user data (omit password for security)
      res.status(200).json({
        message: 'Login successful',
        user: { username: user.username, role: user.role},
      });
    });
  });
});

// Get users route
app.get('/get-users', (req, res) => {
  const query = 'SELECT * FROM Users';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching users' });
    }
    console.log("Fetched users:", results); // Log the fetched users
    res.json({ users: results });
  });
});

// Get properties route
app.get('/get-properties', (req, res) => {
  const username = req.query.username;  // Get username from request

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const query = 'CALL GetUserProperties(?)';  // Call stored procedure
  
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching properties:", err);
      return res.status(500).json({ message: 'Error fetching properties' });
    }

    res.json({ properties: results[0] }); // Stored procedures return an array, so use results[0]
  });
});

app.post('/add-property', async (req, res) => {
  const { username, title, description, address, price, property_type, manager_id } = req.body;

  if (!username || !title || !description || !address || !price || !property_type) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      // Get user role and manager_id (if manager)
      const userQuery = 'SELECT user_id, role FROM Users WHERE username = ?';
      db.query(userQuery, [username], (err, userResults) => {
          if (err) {
              console.error("Error fetching user:", err);
              return res.status(500).json({ message: "Error fetching user details" });
          }

          if (userResults.length === 0) {
              return res.status(404).json({ message: "User not found" });
          }

          const user = userResults[0];

          let finalManagerId = manager_id; // Use provided manager_id if admin
          if (user.role === 'manager') {
              finalManagerId = user.user_id; // Set manager's own ID
          } else if (user.role !== 'admin' && !finalManagerId) {
              return res.status(403).json({ message: "Unauthorized to assign manager_id" });
          }

          // Insert property
          const insertQuery = `
              INSERT INTO Properties (manager_id, title, description, address, price, property_type, status) 
              VALUES (?, ?, ?, ?, ?, ?, 'available')`;

          db.query(insertQuery, [finalManagerId, title, description, address, price, property_type], (err, result) => {
              if (err) {
                  console.error("Error inserting property:", err);
                  return res.status(500).json({ message: "Error adding property" });
              }
              res.json({ message: "Property added successfully", propertyId: result.insertId });
          });
      });
  } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user route
app.delete('/delete-user/:id', (req, res) => {
  const userId = req.params.id;

  const deleteQuery = 'DELETE FROM Users WHERE user_id = ?';
  db.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Error deleting user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  });
});

// Get dashboard counts (users, properties, pending maintenance requests)
app.get('/api/dashboard/counts', (req, res) => {
  const queries = [
    // Count total users excluding tenants
    'SELECT COUNT(*) AS count FROM Users',
    
    // Count total properties
    'SELECT COUNT(*) AS count FROM Properties',
    
    // Count pending maintenance requests (status = 'open')
    'SELECT COUNT(*) AS count FROM MaintenanceRequests WHERE status = "open"'
  ];

  // Execute all queries simultaneously using Promise.all
  Promise.all(queries.map(query => new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", query, err); // Log error for debugging
        reject(err);
      } else {
        console.log("Query results for", query, results); // Log query results for debugging
        resolve(results[0].count);
      }
    });
  })))
  .then((results) => {
    console.log("Dashboard counts:", results); // Log final counts
    res.status(200).json({
      totalUsers: results[0],            // Total users (admin, manager)
      propertiesManaged: results[1],     // Total properties
      pendingApprovals: results[2]       // Pending maintenance requests
    });
  })
  .catch((err) => {
    console.error("Error fetching counts:", err); // Log error for debugging
    res.status(500).json({ message: 'Error fetching dashboard counts', error: err });
  });
});

// Get tenants assigned to manager's properties
app.get('/get-tenants', (req, res) => {
  const username = req.query.username; // Get manager's username from request

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const query = 'CALL GetManagerTenants(?)';  // Call stored procedure

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching tenants:", err);
      return res.status(500).json({ message: 'Error fetching tenants' });
    }

    res.json({ tenants: results[0] }); // Stored procedures return an array, so use results[0]
  });
});

// Get maintenance requests assigned to the manager
app.get('/get-maintenance-requests', (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const query = 'CALL GetManagerMaintenanceRequests(?)';  // Call stored procedure

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching maintenance requests:", err);
      return res.status(500).json({ message: 'Error fetching maintenance requests' });
    }

    res.json({ maintenanceRequests: results[0] });
  });
});

// Get Tenant Rent
app.get("/get-rent", (req, res) => {
  const username = req.query.username;
  const sql = "SELECT rent FROM tenants WHERE username = ?";
  
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Error fetching rent:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length > 0) {
      res.json({ rent: result[0].rent });
    } else {
      res.json({ rent: 0 });  // Default if no rent found
    }
  });
});

// Get Lease Details
app.get("/get-lease", (req, res) => {
  const username = req.query.username;
  const sql = `
    SELECT p.property_name, l.start_date, l.end_date 
    FROM leases l 
    JOIN properties p ON l.property_id = p.id 
    JOIN tenants t ON l.tenant_id = t.id 
    WHERE t.username = ?`;

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Error fetching lease details:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length > 0) {
      res.json({
        property: result[0].property_name,
        start_date: result[0].start_date,
        end_date: result[0].end_date,
      });
    } else {
      res.json({});
    }
  });
});

// Get Maintenance Requests
app.get("/get-maintenance", (req, res) => {
  const username = req.query.username;
  const sql = `
    SELECT request, status 
    FROM maintenance_requests 
    WHERE tenant_username = ? 
    ORDER BY created_at DESC`;

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Error fetching maintenance requests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ requests: result });
  });
});

// Add New Maintenance Request
app.post("/add-maintenance", (req, res) => {
  const { username, request } = req.body;
  const sql = "INSERT INTO maintenance_requests (tenant_username, request, status) VALUES (?, ?, 'Pending')";

  db.query(sql, [username, request], (err, result) => {
    if (err) {
      console.error("Error adding maintenance request:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Request added successfully" });
  });
});

app.put("/update-property/:property_id", (req, res) => {
  const { property_id } = req.params;
  const { title, description, address, price, property_type } = req.body;

  const sql = `
    UPDATE Properties 
    SET title = ?, description = ?, address = ?, price = ?, property_type = ?, updated_at = NOW() 
    WHERE property_id = ?
  `;

  db.query(sql, [title, description, address, price, property_type, property_id], (err, result) => {
    if (err) {
      console.error("Error updating property:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    if (result.affectedRows > 0) {
      res.json({ message: "Property updated successfully" });
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  });
});

// Root route for testing (GET request)
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});