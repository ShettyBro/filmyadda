
# FilmyAdda

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://filmyadda-939.netlify.app)

FilmyAdda is an online OTT platform built to provide a Netflix-like experience for streaming movies. The platform allows users to browse movies, register an account, and enjoy a customized viewing experience.

## Features

- **User Registration & Login**: Users can register and log in securely using their email and password.
- **Profile Management**: Users can update their profiles and manage account information.
- **Password Reset & Email Confirmation**: Secure email confirmation for new users and password reset functionality.
- **Movie Streaming**: Browse movies, select a movie, and watch it with a seamless video player experience similar to OTT platforms.
- **Responsive Design**: A mobile-friendly interface with clean UI/UX.
- **Azure Integration**: Using Azure SQL for user and movie-related data management.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: Azure SQL
- **Hosting**: Netlify (Frontend), Azure Virtual Machine (Backend)
- **Version Control**: GitHub

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ShettyBro/filmyadda.git
   ```

2. Navigate to the project directory:

   ```bash
   cd filmyadda
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up your `.env` file with your database credentials, API keys, and other necessary environment variables:

   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

5. Start the server:

   ```bash
   node server.js
   ```

6. Visit the app at `http://localhost:3000`.

## Folder Structure

```bash
filmyadda/
├── public/
│   ├── assets/           # Images, fonts, etc.
│   ├── css/              # CSS files
│   ├── js/               # JavaScript files (e.g., auth.js, script.js)
│   └── index.html        # Main frontend page
├── api/
│   ├── login/            # API folder for login
│   ├── register/         # API folder for registration
│   ├── movies/           # API folder for movie-related operations
├── server.js             # Main server file
├── README.md             # Project documentation
├── package.json          # Node.js dependencies
└── .env                  # Environment variables (not included in repo)
```

## Live Demo

Check out the live version of the site [here](https://filmyadda-1.netlify.app).

## Contributions

Feel free to open issues or submit pull requests for any improvements, bug fixes, or additional features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
