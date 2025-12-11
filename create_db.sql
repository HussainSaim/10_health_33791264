-- create_db.sql

CREATE DATABASE IF NOT EXISTS health;
USE health;

-- Users table
 CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT,
    username        VARCHAR(50) NOT NULL UNIQUE,
    firstName       VARCHAR(50) NOT NULL,
    lastName        VARCHAR(50) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    hashedPassword  VARCHAR(255) NOT NULL,
    PRIMARY KEY(id));

-- Classes table
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,      
    level VARCHAR(20) NOT NULL,         
    location VARCHAR(100) NOT NULL,
    class_datetime DATETIME NOT NULL,
    capacity INT NOT NULL
  
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_class
      FOREIGN KEY (class_id) REFERENCES classes(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_bookings_user
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
);


CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';