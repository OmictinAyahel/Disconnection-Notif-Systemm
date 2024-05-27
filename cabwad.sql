-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2024 at 08:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cabwad`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_history`
--

CREATE TABLE `tbl_history` (
  `history_id` int(11) NOT NULL,
  `acc_num` varchar(20) NOT NULL,
  `customer_name` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `meter_num` int(11) NOT NULL,
  `unpaid_bills` int(11) NOT NULL,
  `months_arrears` int(11) NOT NULL,
  `message_type` varchar(15) NOT NULL,
  `message` text NOT NULL,
  `contact_num` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_history`
--

INSERT INTO `tbl_history` (`history_id`, `acc_num`, `customer_name`, `address`, `meter_num`, `unpaid_bills`, `months_arrears`, `message_type`, `message`, `contact_num`) VALUES
(1, '111-12-19', 'Joy Balsomo', 'Southville 1', 835495, 826, 2, 'reminder', 'Reminder: Conserve Water!\n\nFix leaks, use water wisely, and save our precious resource. Thank you!', '09913411690'),
(2, '111-12-19', 'Joy Balsomo', 'Southville 1', 835495, 826, 2, 'notice', 'Notice: Planned Water Shutdown \n\nPlease be advised of a planned water shutdown in your area for essential maintenance. Kindly make necessary arrangements. We apologize for any inconvenience.\n\nThank you for your understanding.', '09913411690'),
(3, '111-13-23', 'Aaron Jay Diaz', 'PULO', 25478, 900, 2, 'notice', 'Notice: Planned Water Shutdown \n\nPlease be advised of a planned water shutdown in your area for essential maintenance. Kindly make necessary arrangements. We apologize for any inconvenience.\n\nThank you for your understanding.', '09916001579'),
(4, '111-13-23', 'Aaron Jay Diaz', 'PULO', 25478, 900, 2, 'disconnection', 'Good Day! Mr./Mrs. Aaron Jay Diaz,\n\nWe want to inform you that your water bill is due on May 05, 2024, with an outstanding balance of 900.25.\n\nPlease settle your account to avoid disconnection. Your disconnection date is on May 15, 2024.\n\nPlease disregard this message if your water service connection is newly installed or payment has been made. Thank you.', '09916001579'),
(5, '111-12-19', 'Joy Balsomo', 'Southville 1', 835495, 826, 2, 'disconnection', 'Good Day! Mr./Mrs. Joy Balsomo,\n\nPlease disregard this message if your water service connection is newly installed or payment has been made. Thank you.', '09913411690'),
(6, '111-13-23', 'Aaron Jay Diaz', 'PULO', 25478, 900, 2, 'disconnection', 'Good Day! Mr./Mrs. Aaron Jay Diaz,\n\nPlease disregard this message if your water service connection is newly installed or payment has been made. Thank you.', '09916001579'),
(7, '111-12-19', 'Joy Balsomo', 'Southville 1', 835495, 826, 2, 'disconnection', 'Good Day! Mr./Mrs. Joy Balsomo,\n\nPlease disregard this message if your water service connection is newly installed or payment has been made. Thank you.', '09913411690'),
(8, '111-12-19', 'Joy Balsomo', 'Southville 1', 835495, 826, 2, 'reminder', 'Reminder: Conserve Water!\n\nFix leaks, use water wisely, and save our precious resource. Thank you!', '09913411690');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_message`
--

CREATE TABLE `tbl_message` (
  `messageID` int(11) NOT NULL,
  `messageType` varchar(15) NOT NULL,
  `messageContent` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tbl_message`
--

INSERT INTO `tbl_message` (`messageID`, `messageType`, `messageContent`) VALUES
(1, 'announcement', 'Upcoming Water District Maintenance \n\n Good Day! \n\nPlease be informed that our water district will be conducting routine maintenance in your area. During this time, you may experience temporary interruptions in water supply. \n\nWe apologize for any inconvenience this may cause and appreciate your understanding as we work to ensure the reliability of our water infrastructure.\n\nThank you for your cooperation.'),
(2, 'reminder', 'Reminder: Conserve Water!\n\nFix leaks, use water wisely, and save our precious resource. Thank you!'),
(3, 'notice', 'Notice: Planned Water Shutdown \n\nPlease be advised of a planned water shutdown in your area for essential maintenance. Kindly make necessary arrangements. We apologize for any inconvenience.\n\nThank you for your understanding.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_history`
--
ALTER TABLE `tbl_history`
  ADD PRIMARY KEY (`history_id`);

--
-- Indexes for table `tbl_message`
--
ALTER TABLE `tbl_message`
  ADD PRIMARY KEY (`messageID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_history`
--
ALTER TABLE `tbl_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_message`
--
ALTER TABLE `tbl_message`
  MODIFY `messageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
