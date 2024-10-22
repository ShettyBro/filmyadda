// Function to show modal
function showModal(message, redirectUrl = null) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    if (modalMessage) {
        modalMessage.textContent = message;
    }
    modal.style.display = 'block';

    // Automatically redirect after 3 seconds if a redirect URL is provided
    if (redirectUrl) {
        setTimeout(() => {
            window.location.href = redirectUrl; // Redirect to the specified URL
        }, 3000); // Wait 3 seconds before redirecting
    }
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Add event listener to close the modal when the user clicks on <span> (x)
const closeSpan = document.getElementsByClassName('close')[0];
if (closeSpan) {
    closeSpan.addEventListener('click', closeModal);
}

// Close the modal when clicking outside of the modal
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Logout button functionality
// Add this code to a shared script or include it in each page's script
document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); // Clear the token from localStorage
            showModal('Successfully logged out. Thank you!', 'index.html');
        });
    }
});

// Checking Token on Page Load (only on protected pages, not the login, register, or index pages)
document.addEventListener('DOMContentLoaded', function () {
    const protectedPaths = ['/home.html', '/player.html', '/about.html']; // Add your protected pages here
    const currentPath = window.location.pathname;

    // Check if current path is a protected page
    if (protectedPaths.includes(currentPath)) {
        const token = localStorage.getItem('token');

        console.log('Current pathname:', currentPath);
        console.log('Token exists:', !!token);

        // If no token is found, redirect to login page
        if (!token) {
            console.log('No token found, redirecting to login...');
            window.location.href = 'login.html'; // Redirect to login if no token is found
        } else {
            console.log('Token is valid, proceeding to load the protected content.');
            // Proceed with loading the protected content
        }
    } else {
        console.log('This is a public page, no token check needed.');
    }
});



// Register new user
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from submitting the traditional way

        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullname, email, username, password }),
            });

            // Check the response
            if (response.ok) {
                // Show success modal
                showModal('Registration successful! Redirecting to login...', 'login.html');
            } else {
                const error = await response.text(); // Get the error message directly
                // Show error modal with server response
                showModal(`Registration failed: ${error}`);
            }
        } catch (error) {
            console.error('Error during registration:', error); // Log the error for debugging
            // Show modal for generic error
            showModal('Server Down !! Try Again Later.');
        }
    });
}


// Login existing user
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from submitting the traditional way

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // Store token in localStorage
                showModal('Login successful! Redirecting to home...', 'home.html');
            } else {
                showModal('Invalid username or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showModal('An error occurred. Please try again later.');
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeSpan = document.getElementsByClassName('close')[0];

    // Close the modal when the close button is clicked
    if (closeSpan) {
        closeSpan.onclick = function () {
            modal.style.display = 'none';
        }
    }

    // Close the modal when clicking outside of the modal
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});

// Function to fetch the movie details from the backend
async function fetchMovieDetails() {
    const movieId = localStorage.getItem('selectedMovieId'); // Get the movie ID from localStorage

    if (!movieId) {
        showModal('No movie selected.'); // Show an error if no movie is selected
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/movies/${movieId}`); // Use the movieId in the URL
        const data = await response.json();

        if (response.ok) {
            // Update the title and video source in the player
            document.getElementById('movieTitle').textContent = data.title;
            document.getElementById('videoSource').src = data.source; // Change 'videoSource' to 'source'
            document.getElementById('videoPlayer').load();
        } else {
            showModal(data.message || "Error loading movie");
        }
    } catch (error) {
        showModal('Failed to load movie. Please try again.');
    }
}

// Function to handle selecting a movie (called when clicking on a movie)
function selectMovie(movieId) {
    localStorage.setItem('selectedMovieId', movieId); // Store the movie ID in localStorage
    window.location.href = 'player.html'; // Redirect to the player page
}

// Automatically fetch and play the movie when player.html loads
if (window.location.pathname.includes('player.html')) {
    window.onload = fetchMovieDetails; // Call fetchMovieDetails on page load
}

// Helper function to show modal (you'll need to implement this)
// This function is already defined at the beginning of the file, so no need to redefine it here.


// Function to get the URL parameter (movie ID)
function getMovieId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Get 'id' from ?id=value in URL
}

// Title bar auto heading
document.addEventListener('DOMContentLoaded', function () {
    var movieTitleElement = document.getElementById('movieTitle');
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                document.title = movieTitleElement.innerText;
            }
        });
    });
    observer.observe(movieTitleElement, { childList: true });
});

// Video player functionality
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('videoPlayer');
    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const controls = document.querySelector('.controls');
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    const seekBar = document.getElementById('seekBar');
    const volumeControl = document.getElementById('volumeControl');
    let controlsTimeout;

    function showControls() {
        controls.style.visibility = 'visible';
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
        controlsTimeout = setTimeout(() => {
            controls.style.visibility = 'hidden';
        }, 4000);
    }

    video.addEventListener('play', () => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
    });

    video.addEventListener('pause', () => {
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
    });

    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    playPauseButton.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    video.addEventListener('mousemove', showControls);
    controls.addEventListener('mousemove', showControls);

    fullScreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            video.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Update the seek bar as the video plays
    video.addEventListener('timeupdate', () => {
        const percentage = (video.currentTime / video.duration) * 100;
        seekBar.value = percentage || 0;
    });

    // Seek the video when the seek bar value changes
    seekBar.addEventListener('input', () => {
        const seekTime = (seekBar.value / 100) * video.duration;
        video.currentTime = seekTime;
    });

    // Handle volume control
    volumeControl.addEventListener('input', () => {
        video.volume = volumeControl.value / 100; // Set volume as a percentage
    });

    showControls(); // Show controls when the page loads

    // Automatically fetch and play the movie when player.html loads
    if (window.location.pathname.includes('player.html')) {
        fetchMovieDetails();
    }
});
