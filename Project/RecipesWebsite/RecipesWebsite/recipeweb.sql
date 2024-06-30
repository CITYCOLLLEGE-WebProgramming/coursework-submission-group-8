-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2024 at 10:46 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recipeweb`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
(1, 'Italian'),
(2, 'French'),
(3, 'Greek'),
(4, 'Albanian'),
(5, 'Indian');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `recipe_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment_text` text NOT NULL,
  `rating` smallint(6) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `recipe_id`, `user_id`, `comment_text`, `rating`, `created_at`) VALUES
(1, 1, 1, 'Loved this appetizer!', 5, '2024-06-17 02:27:35'),
(2, 2, 2, 'Great main course!', 4, '2024-06-17 02:37:35'),
(3, 3, 3, 'Best dessert ever!', 5, '2024-06-17 02:47:35'),
(4, 4, 4, 'So refreshing!', 4, '2024-06-17 02:57:35'),
(5, 5, 5, 'Healthy and tasty', 5, '2024-06-17 03:07:35');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `ingredients` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `average_rating` decimal(3,2) DEFAULT 0.00,
  `rating` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `user_id`, `category_id`, `image_url`, `title`, `description`, `ingredients`, `created_at`, `average_rating`, `rating`) VALUES
(1, 1, 1, 'image1.jpg', 'Bruschetta', 'Delicious tomato bruschetta', 'Tomatoes, basil, bread, olive oil, garlic', '2024-06-17 02:27:35', 5.00, 5),
(2, 2, 2, 'image2.jpg', 'Grilled Chicken', 'Juicy grilled chicken breast', 'Chicken breast, olive oil, spices', '2024-06-17 02:27:35', 4.00, 5),
(3, 3, 3, NULL, 'Chocolate Cake', 'Rich chocolate cake', 'Flour, cocoa powder, sugar, eggs, butter', '2024-06-17 02:27:35', 5.00, 4),
(4, 4, 4, NULL, 'Lemonade', 'Refreshing homemade lemonade', 'Lemons, water, sugar', '2024-06-17 02:27:35', 4.00, 5),
(5, 5, 5, NULL, 'Caesar Salad', 'Classic Caesar salad', 'Romaine lettuce, croutons, Caesar dressing, parmesan', '2024-06-17 02:27:35', 5.00, 4),
(6, NULL, 2, 'https://search.brave.com/images?q=image', 'sadadasd', 'sdsds', 'dsdsds', '2024-06-16 23:54:15', 0.00, 4),
(7, NULL, 2, 'https://search.brave.com/images?q=image', 'sadasd', 'sfafsafd', 'fdfdsfsf', '2024-06-17 00:42:50', 0.00, 3),
(8, NULL, 2, 'https://search.brave.com/images?q=image', 'ALLAHI', 'dkjsalkdjalkwjdlaskj', 'lskjdlakjdslkajldkjsa', '2024-06-17 05:17:08', 0.00, 0);

-- --------------------------------------------------------

--
-- Stand-in structure for view `recipes_with_ratings`
-- (See below for the actual view)
--
CREATE TABLE `recipes_with_ratings` (
`recipe_id` int(11)
,`user_id` int(11)
,`category_id` int(11)
,`image_url` varchar(255)
,`title` varchar(255)
,`description` text
,`ingredients` text
,`created_at` datetime
,`average_rating` decimal(9,4)
);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `created_at`) VALUES
(1, 'john_doe', 'john@example.com', 'hashed_password1', '2024-06-17 02:27:35'),
(2, 'jane_smith', 'jane@example.com', 'hashed_password2', '2024-06-17 02:27:35'),
(3, 'alice_jones', 'alice@example.com', 'hashed_password3', '2024-06-17 02:27:35'),
(4, 'bob_brown', 'bob@example.com', 'hashed_password4', '2024-06-17 02:27:35'),
(5, 'carol_white', 'carol@example.com', 'hashed_password5', '2024-06-17 02:27:35'),
(8, 'gerti', 'gerti@gmail.com', '$2b$10$UGk6RWOUskC8av1fHLsXqem3/1MqQ.h7Z1kpNk6Rmn/Quo/qahap6', '2024-06-17 17:47:27');

-- --------------------------------------------------------

--
-- Structure for view `recipes_with_ratings`
--
DROP TABLE IF EXISTS `recipes_with_ratings`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `recipes_with_ratings`  AS SELECT `r`.`recipe_id` AS `recipe_id`, `r`.`user_id` AS `user_id`, `r`.`category_id` AS `category_id`, `r`.`image_url` AS `image_url`, `r`.`title` AS `title`, `r`.`description` AS `description`, `r`.`ingredients` AS `ingredients`, `r`.`created_at` AS `created_at`, coalesce(avg(`c`.`rating`),0) AS `average_rating` FROM (`recipes` `r` left join `comments` `c` on(`r`.`recipe_id` = `c`.`recipe_id`)) GROUP BY `r`.`recipe_id`, `r`.`user_id`, `r`.`category_id`, `r`.`image_url`, `r`.`title`, `r`.`description`, `r`.`ingredients`, `r`.`created_at` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
