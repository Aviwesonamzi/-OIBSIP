User Registration: Users can register with a username and password, which is hashed using bcrypt and stored in an in-memory array.
User Login: The login form checks if the user exists and if the password matches the hashed password.
Secured Page: The dashboard is only accessible if the user is logged in (checked via session).
Session Management: express-session manages the user's session, keeping them logged in until they logout.
