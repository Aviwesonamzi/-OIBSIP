const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const PORT = 3000;

// In-memory user storage (for simplicity)
const users = [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

// CSS Styling
const styles = `
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
    .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        color: #444;
    }
    form {
        display: flex;
        flex-direction: column;
    }
    label {
        margin-bottom: 5px;
    }
    input {
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        padding: 10px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
    a {
        color: #007BFF;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
`;

app.get('/', (req, res) => {
    res.send(`
        <style>${styles}</style>
        <div class="container">
            <h1>Welcome</h1>
            <p><a href="/register">Register</a></p>
            <p><a href="/login">Login</a></p>
        </div>
    `);
});

// Registration Route
app.get('/register', (req, res) => {
    res.send(`
        <style>${styles}</style>
        <div class="container">
            <h1>Register</h1>
            <form action="/register" method="post">
                <label for="username">Username:</label>
                <input type="text" name="username" required><br>
                <label for="password">Password:</label>
                <input type="password" name="password" required><br>
                <button type="submit">Register</button>
            </form>
        </div>
    `);
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    users.push({ username, password: hashedPassword });
    res.redirect('/login');
});

// Login Route
app.get('/login', (req, res) => {
    res.send(`
        <style>${styles}</style>
        <div class="container">
            <h1>Login</h1>
            <form action="/login" method="post">
                <label for="username">Username:</label>
                <input type="text" name="username" required><br>
                <label for="password">Password:</label>
                <input type="password" name="password" required><br>
                <button type="submit">Login</button>
            </form>
        </div>
    `);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.username;
        res.redirect('/dashboard');
    } else {
        res.send(`
            <style>${styles}</style>
            <div class="container">
                <h1>Login</h1>
                <p>Invalid username or password</p>
                <a href="/login">Try Again</a>
            </div>
        `);
    }
});

// Secured Route
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    
    res.send(`
        <style>${styles}</style>
        <div class="container">
            <h1>Dashboard</h1>
            <p>Welcome, ${req.session.userId}!</p>
            <p><a href="/logout">Logout</a></p>
        </div>
    `);
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
