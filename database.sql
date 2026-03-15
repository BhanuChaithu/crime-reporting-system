CREATE DATABASE IF NOT EXISTS `crime_reporting_system`;

USE `crime_reporting_system`;

-- Users Table
CREATE TABLE IF NOT EXISTS `Users` (
    `id` INTEGER NOT NULL auto_increment,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('citizen', 'police', 'admin') DEFAULT 'citizen',
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
);

-- CrimeReports Table
CREATE TABLE IF NOT EXISTS `CrimeReports` (
    `id` INTEGER NOT NULL auto_increment,
    `type` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `date` VARCHAR(255) NOT NULL,
    `time` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `evidence` VARCHAR(255),
    `status` ENUM(
        'Pending',
        'Under Investigation',
        'Closed'
    ) DEFAULT 'Pending',
    `remarks` TEXT,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    `reporterId` INTEGER,
    `assignedToId` INTEGER,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`reporterId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`assignedToId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);