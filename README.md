# Gallo – Cross-platform Workout Tracking Service

Gallo is a multi-client fitness tracking system that helps users log and review their bodyweight or gym exercises across devices. It consists of:
A central Express.js server exposing a REST API.

- An express backend server using MariaDB to store and retrieve data.


- A browser client as the primary user interface.


- An Electron desktop client for enhanced desktop use.


- An Android mobile client for on-the-go workout logging.


The system allows users to browse a structured catalog of exercises and record the workouts they complete (exercise, sets, reps). All clients communicate with the same Express backend using JSON APIs, ensuring that a user’s workout history is synced across desktop, web, and mobile.

