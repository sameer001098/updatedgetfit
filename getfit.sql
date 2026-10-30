-- GetFit database schema for phpMyAdmin
-- Import: phpMyAdmin → Import → choose this file
-- Database name matches backend/db/db.js and the getfitapi PHP backend

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `getfit` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `getfit`;

-- --------------------------------------------------------
-- Users (app users, trainers, superadmin)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `firstname` varchar(100) NOT NULL DEFAULT '',
  `lastname` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `dateofbirth` varchar(50) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `bodyweight` varchar(50) DEFAULT NULL,
  `targetweight` varchar(50) DEFAULT NULL,
  `profileimage` varchar(255) DEFAULT NULL,
  `oftenworkout` text DEFAULT NULL,
  `length` varchar(50) DEFAULT NULL,
  `training` text DEFAULT NULL,
  `traininglink` text DEFAULT NULL,
  `testimonials` text DEFAULT NULL,
  `socialmedia` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `commitment` text DEFAULT NULL,
  `sponsoredcompany` text DEFAULT NULL,
  `companyname` varchar(255) DEFAULT NULL,
  `crossfitinstructor` varchar(50) DEFAULT NULL,
  `bobybuilderinstructor` varchar(50) DEFAULT NULL,
  `muscleinstructor` varchar(50) DEFAULT NULL,
  `height` varchar(50) DEFAULT NULL,
  `schedule` text DEFAULT NULL,
  `testimonialimages` text DEFAULT NULL,
  `profilevisibility` varchar(50) DEFAULT 'public',
  `exercises` text DEFAULT NULL,
  `referral` varchar(100) DEFAULT NULL,
  `points` varchar(50) DEFAULT '0',
  `sendconnectionreq` text DEFAULT NULL,
  `receiveconnectionreq` text DEFAULT NULL,
  `calories` varchar(50) DEFAULT '0',
  `visibility` varchar(50) DEFAULT 'Public',
  `paidtraining` varchar(50) DEFAULT NULL,
  `billingtype` varchar(50) DEFAULT NULL,
  `charges` varchar(50) DEFAULT NULL,
  `accountstatus` varchar(50) DEFAULT 'activate',
  `paidtrainer` varchar(20) DEFAULT 'false',
  `hiringcharges` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Categories (calories + workout types)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryname` varchar(150) NOT NULL,
  `categoryimage` varchar(255) DEFAULT NULL,
  `categorytype` varchar(100) NOT NULL DEFAULT 'calories',
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Calorie food items
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemname` varchar(150) NOT NULL,
  `categoryid` int(11) NOT NULL,
  `categoryname` varchar(150) DEFAULT NULL,
  `itemcalories` varchar(50) NOT NULL DEFAULT '0',
  `itemimage` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `categoryid` (`categoryid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Exercises / workouts
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `exercises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `category` varchar(150) DEFAULT NULL,
  `categoryid` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `day` varchar(20) DEFAULT '1',
  `calories` varchar(50) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `categoryid` (`categoryid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Challenges (API spelling: challanges)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `challanges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `entryFee` varchar(50) DEFAULT NULL,
  `reward` varchar(50) DEFAULT NULL,
  `bool` varchar(10) DEFAULT '0',
  `videopath` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `userid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Completed challenge submissions
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `completechallanges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `challangeId` int(11) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `userEmail` varchar(150) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `challangeId` (`challangeId`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Seed: superadmin (login for admin panel)
-- email: superadmin@gmail.com | password: superadmin1234
-- --------------------------------------------------------

INSERT INTO `users` (
  `role`, `firstname`, `lastname`, `email`, `password`, `profilevisibility`, `visibility`, `accountstatus`, `calories`, `paidtrainer`
) VALUES (
  'superadmin', 'superadmin', 'superadmin', 'superadmin@gmail.com', 'superadmin1234', 'Public', 'Public', 'activate', '0', 'false'
);

-- --------------------------------------------------------
-- Seed: categories (calories + workout types)
-- --------------------------------------------------------

INSERT INTO `categories` (`id`, `categoryname`, `categoryimage`, `categorytype`) VALUES
(1, 'Fruit', '', 'calories'),
(2, 'Vegetable', '', 'calories'),
(3, 'Juices', '', 'calories'),
(4, 'Proteins', '', 'calories'),
(5, 'Abs', '', 'Gym Workout'),
(6, 'Arms', '', 'Gym Workout'),
(7, 'Back', '', 'Gym Workout'),
(8, 'Full Body', '', 'Gym Workout'),
(9, 'Legs', '', 'Gym Workout'),
(10, 'Shoulders', '', 'Gym Workout'),
(13, 'Full Body', '', 'Yoga Workout'),
(14, 'Abs', '', 'Yoga Workout'),
(15, 'Streching', '', 'Yoga Workout'),
(16, 'Relaxing', '', 'Yoga Workout'),
(17, 'Focus', '', 'Yoga Workout'),
(18, 'Strength', '', 'Yoga Workout'),
(19, 'HIIT (High Intensity Interval Training)', '', 'Intense Workout'),
(20, 'Cardio Blast', '', 'Intense Workout'),
(21, 'Tabata', '', 'Intense Workout'),
(22, 'Core & Abs', '', 'Intense Workout'),
(23, 'Fat Destroyer', '', 'Intense Workout'),
(24, 'Core & Abs', '', 'Intense Workout'),
(25, 'Fat Destroyer', '', 'Intense Workout'),
(26, 'Endurance Challenge', '', 'Intense Workout'),
(27, 'Full Body', '', 'Home Workout'),
(28, 'Upper Body', '', 'Home Workout'),
(29, 'Lower Body', '', 'Home Workout'),
(30, 'Abs', '', 'Home Workout'),
(31, 'Fat Burn', '', 'Home Workout'),
(32, 'Stretch', '', 'Home Workout');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
