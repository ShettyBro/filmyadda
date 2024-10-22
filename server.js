const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// Generate a secure secret key
const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Replace with a secure secret key
const JWT_SECRET = generateSecretKey();


// Azure SQL database configuration
const dbConfig = {
  user: 'Filmyadda-admin',
  password: 'Sudeepjs#&123',
  server: 'filmyadda.database.windows.net',
  database: 'Filmyadda',
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to the database
sql.connect(dbConfig)
  .then(pool => {
    if (pool.connecting) {
      console.log('Connecting to Azure SQL database...');
    }
    if (pool.connected) {
      console.log('Connected to Azure SQL database');
    }
  })
  .catch(err => {
    console.error('Database Connection Error:', err);
  });

// Registration route
app.post('/register', async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (!fullname || !email || !username || !password) {
      return res.status(400).send('All fields are required');
  }

  try {
      const pool = await sql.connect(dbConfig);

      // Check if the username, fullname, or email already exists
      const existingUserResult = await pool.request()
          .input('username', sql.VarChar, username)
          .input('fullname', sql.VarChar, fullname)
          .input('email', sql.VarChar, email)
          .query('SELECT * FROM Users WHERE username = @username OR fullname = @fullname OR email = @email');

      if (existingUserResult.recordset.length > 0) {
          return res.status(409).send('Username, fullname, or email already exists. Please use different credentials.');
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user data in the order matching the table schema: username, password, fullname, email
      await pool.request()
          .input('username', sql.VarChar, username)
          .input('password', sql.VarChar, hashedPassword)
          .input('fullname', sql.VarChar, fullname)
          .input('email', sql.VarChar, email)
          .query('INSERT INTO Users (username, password, fullname, email) VALUES (@username, @password, @fullname, @email)');

      res.status(201).send('User registered successfully');
  } catch (err) {
      console.error('Registration Error:', err); // Log detailed error
      res.status(500).send('Error registering user');
  }
});






// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            // Compare the password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Generate JWT token
                const token = jwt.sign(
                    { id: user.id, username: user.username },
                    JWT_SECRET,
                    { expiresIn: '5h' } // Token expires in 1 hour
                );

                // Send token to client
                return res.status(200).json({ message: 'Login successful', token });
            } else {
                return res.status(401).send('Invalid username or password');
            }
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).send('Error during login');
    }
});

// Middleware to verify token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).send('Access Denied: No Token Provided');

    try {
        const verified = jwt.verify(token.split(' ')[1], JWT_SECRET); // 'Bearer <token>'
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).send('Invalid Token');
    }
}

// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});



// Middleware
app.use(bodyParser.json());

// Route to get video details by movie ID
app.post('/getVideoDetails', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Movie ID is required' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const query = 'SELECT title, source FROM movies WHERE id = @id';
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length > 0) {
            return res.json(result.recordset[0]); // Return the first result
        } else {
            return res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error('Error fetching video details:', err);
        return res.status(500).json({ error: 'Database query error' });
    }
});

// Fetch movie details by ID
app.get('/movies/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, movieId) // Specify the input type
            .query('SELECT title, source FROM movies WHERE id = @id');

        if (result.recordset.length > 0) {
            const movie = result.recordset[0];
            res.status(200).json(movie); // Respond with movie details
        } else {
            res.status(404).json({ message: 'Movie not found' }); // Movie not found
        }
    } catch (err) {
        console.error('Error fetching movie details:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});





// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});