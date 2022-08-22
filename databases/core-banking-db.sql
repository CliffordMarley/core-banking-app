-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: localhost    Database: core-banking-db
-- ------------------------------------------------------
-- Server version	8.0.27-0ubuntu0.21.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_accounts`
--

DROP TABLE IF EXISTS `tbl_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `account_number` varchar(20) NOT NULL,
  `account_name` varchar(200) NOT NULL,
  `account_type` varchar(5) NOT NULL,
  `branch` varchar(5) NOT NULL,
  `default_currency` int NOT NULL,
  `account_status` enum('ACTIVE','CLOSED','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `account_number` (`account_number`),
  KEY `account_type` (`account_type`),
  KEY `default_currency` (`default_currency`),
  KEY `branch` (`branch`),
  CONSTRAINT `tbl_accounts_ibfk_3` FOREIGN KEY (`account_type`) REFERENCES `tbl_chart_of_accounts` (`account_type`),
  CONSTRAINT `tbl_accounts_ibfk_4` FOREIGN KEY (`default_currency`) REFERENCES `tbl_currencies` (`id`),
  CONSTRAINT `tbl_accounts_ibfk_5` FOREIGN KEY (`branch`) REFERENCES `tbl_branches` (`branch_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_accounts`
--

LOCK TABLES `tbl_accounts` WRITE;
/*!40000 ALTER TABLE `tbl_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_activity_logs`
--

DROP TABLE IF EXISTS `tbl_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_activity_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `reference_id` varchar(50) NOT NULL,
  `activity` varchar(100) NOT NULL,
  `outcome` enum('PROCESS.SUCCESS','PROCESS.ERROR','PROCESS.FAILED') NOT NULL DEFAULT 'PROCESS.SUCCESS',
  `object` enum('USER.MEMBER','USER.GROUP','USER.PARTNER','USER.STAFF') NOT NULL COMMENT 'This is the type of system user who is associated with the reference_id.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_activity_logs`
--

LOCK TABLES `tbl_activity_logs` WRITE;
/*!40000 ALTER TABLE `tbl_activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_branches`
--

DROP TABLE IF EXISTS `tbl_branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_code` varchar(5) NOT NULL,
  `branch_name` varchar(255) NOT NULL,
  `address_line_1` varchar(100) NOT NULL,
  `address_line_2` varchar(100) NOT NULL,
  `city` int NOT NULL,
  `country` int NOT NULL,
  `contact_phone` varchar(15) NOT NULL,
  `contact_email` varchar(100) NOT NULL,
  `status` enum('BRANCH.ACTIVE','BRANCH.CLOSED','BRANCH.DELETED') NOT NULL DEFAULT 'BRANCH.ACTIVE',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `branch_code` (`branch_code`),
  KEY `city` (`city`),
  CONSTRAINT `tbl_branches_ibfk_1` FOREIGN KEY (`city`) REFERENCES `tbl_cities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_branches`
--

LOCK TABLES `tbl_branches` WRITE;
/*!40000 ALTER TABLE `tbl_branches` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_charges`
--

DROP TABLE IF EXISTS `tbl_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_charges` (
  `charge_id` int NOT NULL AUTO_INCREMENT,
  `charge_name` varchar(200) NOT NULL,
  `metric` enum('PERCENTAGE','FIXED_AMOUNT') NOT NULL,
  `value` decimal(18,2) NOT NULL,
  `status` enum('AWAITING.APPROVAL','AWAITING.AUTHORIZATION','ACTIVE','SUSPENDED') NOT NULL DEFAULT 'AWAITING.APPROVAL',
  `applied_to` enum('ITEM.ACCOUNT','ITEM.PRODUCT','ITEM.SERVICE','ITEM.UNDEFINED') NOT NULL,
  `point_in_time` enum('ON.CREATION','ON.APPROVAL','ON.AUTHORIZATION','ON.FIRST_USE','ON.TIME_DAILY','ON.TIME_WEEKLY','ON.TIME_MONTHLY','ON.TIME_ANNUALY','ON.TIME_FIXED_DATE') NOT NULL,
  `fixed_charge_date` date DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`charge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_charges`
--

LOCK TABLES `tbl_charges` WRITE;
/*!40000 ALTER TABLE `tbl_charges` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_chart_of_accounts`
--

DROP TABLE IF EXISTS `tbl_chart_of_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_chart_of_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_type` varchar(5) NOT NULL,
  `account_type_name` varchar(100) NOT NULL,
  `class_group` enum('INTERNAL','EXTERNAL') NOT NULL,
  `parent` varchar(5) NOT NULL,
  `description` varchar(255) DEFAULT 'No Description',
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_type_name` (`account_type_name`),
  UNIQUE KEY `account_type` (`account_type`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1 COMMENT='Account Types';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_chart_of_accounts`
--

LOCK TABLES `tbl_chart_of_accounts` WRITE;
/*!40000 ALTER TABLE `tbl_chart_of_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_chart_of_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_cities`
--

DROP TABLE IF EXISTS `tbl_cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_cities` (
  `id` int NOT NULL,
  `city_name` varchar(20) NOT NULL,
  `code` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_cities`
--

LOCK TABLES `tbl_cities` WRITE;
/*!40000 ALTER TABLE `tbl_cities` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_classes`
--

DROP TABLE IF EXISTS `tbl_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_classes` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `class_name` text,
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_classes`
--

LOCK TABLES `tbl_classes` WRITE;
/*!40000 ALTER TABLE `tbl_classes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_contacts`
--

DROP TABLE IF EXISTS `tbl_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_contacts` (
  `contact_id` int NOT NULL AUTO_INCREMENT,
  `member_id` varchar(10) NOT NULL,
  `contact_type` enum('EMAIL_ADDRESS','PHONE_NUMBER','PHYSICAL_ADDRESS') NOT NULL,
  `contact` varchar(100) NOT NULL,
  `status` enum('AVAILABLE','DELETED') NOT NULL DEFAULT 'AVAILABLE',
  `stamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contact_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `tbl_contacts_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `tbl_members` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_contacts`
--

LOCK TABLES `tbl_contacts` WRITE;
/*!40000 ALTER TABLE `tbl_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_countries`
--

DROP TABLE IF EXISTS `tbl_countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_countries` (
  `id` int NOT NULL DEFAULT '0',
  `country` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_countries`
--

LOCK TABLES `tbl_countries` WRITE;
/*!40000 ALTER TABLE `tbl_countries` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_currencies`
--

DROP TABLE IF EXISTS `tbl_currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_currencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country` int NOT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `symbol` varchar(255) DEFAULT NULL,
  `thousand_separator` varchar(10) DEFAULT NULL,
  `decimal_separator` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `thousand_separate` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_currencies`
--

LOCK TABLES `tbl_currencies` WRITE;
/*!40000 ALTER TABLE `tbl_currencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_exchange_rates`
--

DROP TABLE IF EXISTS `tbl_exchange_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_exchange_rates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `default_currency` int NOT NULL,
  `foreign_currency` int NOT NULL,
  `exchange_input_amount` decimal(18,7) NOT NULL,
  `exchange_output_amount` decimal(18,7) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_exchange_rates`
--

LOCK TABLES `tbl_exchange_rates` WRITE;
/*!40000 ALTER TABLE `tbl_exchange_rates` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_exchange_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_fund_managers`
--

DROP TABLE IF EXISTS `tbl_fund_managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_fund_managers` (
  `organisation_id` int NOT NULL AUTO_INCREMENT,
  `organisation_name` varchar(250) NOT NULL,
  `address_line_1` varchar(200) NOT NULL,
  `address_line_2` varchar(200) NOT NULL,
  `country` int NOT NULL,
  `city` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_fund_managers`
--

LOCK TABLES `tbl_fund_managers` WRITE;
/*!40000 ALTER TABLE `tbl_fund_managers` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_fund_managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_group_acc_link`
--

DROP TABLE IF EXISTS `tbl_group_acc_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_group_acc_link` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_code` varchar(10) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_number` (`account_number`),
  KEY `group_code` (`group_code`),
  CONSTRAINT `tbl_group_acc_link_ibfk_1` FOREIGN KEY (`account_number`) REFERENCES `tbl_accounts` (`account_number`),
  CONSTRAINT `tbl_group_acc_link_ibfk_2` FOREIGN KEY (`group_code`) REFERENCES `tbl_groups` (`group_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_group_acc_link`
--

LOCK TABLES `tbl_group_acc_link` WRITE;
/*!40000 ALTER TABLE `tbl_group_acc_link` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_group_acc_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_group_member_list`
--

DROP TABLE IF EXISTS `tbl_group_member_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_group_member_list` (
  `assoc_id` int NOT NULL AUTO_INCREMENT,
  `member_id` varchar(10) NOT NULL,
  `group_id` varchar(10) NOT NULL,
  PRIMARY KEY (`assoc_id`),
  UNIQUE KEY `member_id` (`member_id`,`group_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `tbl_group_member_list_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `tbl_groups` (`group_code`),
  CONSTRAINT `tbl_group_member_list_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `tbl_members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_group_member_list`
--

LOCK TABLES `tbl_group_member_list` WRITE;
/*!40000 ALTER TABLE `tbl_group_member_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_group_member_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_groups`
--

DROP TABLE IF EXISTS `tbl_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_groups` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `group_code` varchar(10) NOT NULL,
  `group_name` varchar(200) NOT NULL,
  `group_status` enum('ACTIVE','SUSPENDED','DELETED','CLOSED') NOT NULL DEFAULT 'ACTIVE',
  `member_count` int NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`group_id`),
  UNIQUE KEY `group_code` (`group_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_groups`
--

LOCK TABLES `tbl_groups` WRITE;
/*!40000 ALTER TABLE `tbl_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_i18n_locales`
--

DROP TABLE IF EXISTS `tbl_i18n_locales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_i18n_locales` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tbl_i18n_locales_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_i18n_locales`
--

LOCK TABLES `tbl_i18n_locales` WRITE;
/*!40000 ALTER TABLE `tbl_i18n_locales` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_i18n_locales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_identification_types`
--

DROP TABLE IF EXISTS `tbl_identification_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_identification_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(150) NOT NULL,
  `issuing_authority` varchar(250) NOT NULL,
  `in_use` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_identification_types`
--

LOCK TABLES `tbl_identification_types` WRITE;
/*!40000 ALTER TABLE `tbl_identification_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_identification_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_kyc_docs`
--

DROP TABLE IF EXISTS `tbl_kyc_docs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_kyc_docs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` varchar(10) NOT NULL,
  `doc_type` int NOT NULL,
  `id_number` varchar(100) DEFAULT NULL,
  `document_name` varchar(250) NOT NULL,
  `document_issuer` varchar(250) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `primary_id` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doc_type` (`doc_type`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `tbl_kyc_docs_ibfk_1` FOREIGN KEY (`doc_type`) REFERENCES `tbl_identification_types` (`id`),
  CONSTRAINT `tbl_kyc_docs_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `tbl_members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_kyc_docs`
--

LOCK TABLES `tbl_kyc_docs` WRITE;
/*!40000 ALTER TABLE `tbl_kyc_docs` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_kyc_docs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_loan_products`
--

DROP TABLE IF EXISTS `tbl_loan_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_loan_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` varchar(5) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `interest_rate` decimal(3,2) NOT NULL,
  `status` enum('ACTIVE','REVOKED') NOT NULL DEFAULT 'ACTIVE',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_loan_products`
--

LOCK TABLES `tbl_loan_products` WRITE;
/*!40000 ALTER TABLE `tbl_loan_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_loan_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_loans`
--

DROP TABLE IF EXISTS `tbl_loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_loans` (
  `loan_id` int NOT NULL AUTO_INCREMENT,
  `product_id` varchar(5) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `total_repayment_amount` decimal(18,2) NOT NULL,
  `rate` decimal(3,2) NOT NULL DEFAULT '0.00',
  `capture_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `default_date` date NOT NULL,
  `status` enum('AWAITING.APPROVAL','DISBURSED','DEFAULTED','DENIED','AWAITING.DISBURSEMENT','CANCELLED') NOT NULL DEFAULT 'AWAITING.APPROVAL',
  `repayed` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`loan_id`),
  KEY `product_id` (`product_id`),
  KEY `account_number` (`account_number`),
  CONSTRAINT `tbl_loans_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `tbl_loan_products` (`product_id`),
  CONSTRAINT `tbl_loans_ibfk_2` FOREIGN KEY (`account_number`) REFERENCES `tbl_accounts` (`account_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_loans`
--

LOCK TABLES `tbl_loans` WRITE;
/*!40000 ALTER TABLE `tbl_loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_loans` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `calculate_loan_repayment_amount` AFTER INSERT ON `tbl_loans` FOR EACH ROW UPDATE tbl_loans SET NEW.total_repayment_amount = NEW.amount + ((NEW.amount * NEW.rate) / 100) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_member_acc_link`
--

DROP TABLE IF EXISTS `tbl_member_acc_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_member_acc_link` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` varchar(10) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_number` (`account_number`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `tbl_member_acc_link_ibfk_1` FOREIGN KEY (`account_number`) REFERENCES `tbl_accounts` (`account_number`),
  CONSTRAINT `tbl_member_acc_link_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `tbl_members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_member_acc_link`
--

LOCK TABLES `tbl_member_acc_link` WRITE;
/*!40000 ALTER TABLE `tbl_member_acc_link` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_member_acc_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_member_occupation`
--

DROP TABLE IF EXISTS `tbl_member_occupation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_member_occupation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` varchar(10) NOT NULL,
  `employer_name` varchar(200) NOT NULL,
  `employment_number` varchar(50) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `net_monthly_income` decimal(18,2) NOT NULL,
  `employer_address` varchar(255) NOT NULL,
  `employer_phone` varchar(15) NOT NULL,
  `employer_email` varchar(50) NOT NULL,
  `type_of_business` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `tbl_member_occupation_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `tbl_members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_member_occupation`
--

LOCK TABLES `tbl_member_occupation` WRITE;
/*!40000 ALTER TABLE `tbl_member_occupation` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_member_occupation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_members`
--

DROP TABLE IF EXISTS `tbl_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_members` (
  `member_id` varchar(10) NOT NULL,
  `title` varchar(10) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `othernames` varchar(255) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL,
  `dob` varchar(20) DEFAULT NULL,
  `nationality` int NOT NULL,
  `residency` enum('RESIDENT','NON-RESIDENT','REFUGEE') DEFAULT NULL,
  `marital_status` enum('SINGLE','MARRIED','DIVORCED','SEPARATED') DEFAULT 'SINGLE',
  `branch` varchar(5) DEFAULT NULL,
  `employment_status` enum('EMPLOYED','SELF-EMPLOYED','NOT-EMPLOYED','STUDENT') NOT NULL,
  `employer_name` varchar(250) DEFAULT NULL,
  `employer_address` varchar(250) DEFAULT NULL,
  `employer_phone` varchar(50) DEFAULT NULL,
  `designation` varchar(200) DEFAULT NULL,
  `net_monthly_income` decimal(18,2) DEFAULT '0.00',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','DELETED','AWAITING.APPROVAL') NOT NULL DEFAULT 'AWAITING.APPROVAL',
  `image` varchar(255) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_id`),
  KEY `branch` (`branch`),
  CONSTRAINT `tbl_members_ibfk_1` FOREIGN KEY (`branch`) REFERENCES `tbl_branches` (`branch_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_members`
--

LOCK TABLES `tbl_members` WRITE;
/*!40000 ALTER TABLE `tbl_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_menus`
--

DROP TABLE IF EXISTS `tbl_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `privilege_title` varchar(100) NOT NULL,
  `parent` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `view` varchar(255) NOT NULL,
  `sort_order` int NOT NULL,
  `status` enum('Active','Suspended') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `privilege_title` (`privilege_title`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_menus`
--

LOCK TABLES `tbl_menus` WRITE;
/*!40000 ALTER TABLE `tbl_menus` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_next_of_kin`
--

DROP TABLE IF EXISTS `tbl_next_of_kin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_next_of_kin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` varchar(10) NOT NULL,
  `nok_fullname` varchar(200) NOT NULL,
  `nok_phone` varchar(50) NOT NULL,
  `nok_physical_address` varchar(255) NOT NULL,
  `nok_relationship` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_next_of_kin`
--

LOCK TABLES `tbl_next_of_kin` WRITE;
/*!40000 ALTER TABLE `tbl_next_of_kin` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_next_of_kin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_partner_acc_link`
--

DROP TABLE IF EXISTS `tbl_partner_acc_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_partner_acc_link` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organisation_id` int NOT NULL,
  `account_number` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_number` (`account_number`),
  KEY `group_code` (`organisation_id`),
  CONSTRAINT `tbl_partner_acc_link_ibfk_1` FOREIGN KEY (`account_number`) REFERENCES `tbl_accounts` (`account_number`),
  CONSTRAINT `tbl_partner_acc_link_ibfk_2` FOREIGN KEY (`organisation_id`) REFERENCES `tbl_fund_managers` (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_partner_acc_link`
--

LOCK TABLES `tbl_partner_acc_link` WRITE;
/*!40000 ALTER TABLE `tbl_partner_acc_link` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_partner_acc_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_partner_contacts`
--

DROP TABLE IF EXISTS `tbl_partner_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_partner_contacts` (
  `contact_id` int NOT NULL AUTO_INCREMENT,
  `organisation_id` int NOT NULL,
  `contact_type` enum('EMAIL_ADDRESS','PHONE_NUMBER') NOT NULL,
  `contact_value` varchar(100) NOT NULL,
  `contact_name` varchar(200) NOT NULL,
  `contact_status` enum('ACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contact_id`),
  KEY `organisation_id` (`organisation_id`),
  CONSTRAINT `tbl_partner_contacts_ibfk_1` FOREIGN KEY (`organisation_id`) REFERENCES `tbl_fund_managers` (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_partner_contacts`
--

LOCK TABLES `tbl_partner_contacts` WRITE;
/*!40000 ALTER TABLE `tbl_partner_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_partner_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_privileges`
--

DROP TABLE IF EXISTS `tbl_privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_privileges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `privilege_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `privilege_name` (`privilege_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_privileges`
--

LOCK TABLES `tbl_privileges` WRITE;
/*!40000 ALTER TABLE `tbl_privileges` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_relationships`
--

DROP TABLE IF EXISTS `tbl_relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_relationships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `relationship_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `relationship_name` (`relationship_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_relationships`
--

LOCK TABLES `tbl_relationships` WRITE;
/*!40000 ALTER TABLE `tbl_relationships` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_relationships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_role_privilege_assignment`
--

DROP TABLE IF EXISTS `tbl_role_privilege_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_role_privilege_assignment` (
  `role_id` int NOT NULL,
  `provilege_id` int NOT NULL,
  KEY `provilege_id` (`provilege_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `tbl_role_privilege_assignment_ibfk_1` FOREIGN KEY (`provilege_id`) REFERENCES `tbl_privileges` (`id`),
  CONSTRAINT `tbl_role_privilege_assignment_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `tbl_roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_role_privilege_assignment`
--

LOCK TABLES `tbl_role_privilege_assignment` WRITE;
/*!40000 ALTER TABLE `tbl_role_privilege_assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_role_privilege_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_roles`
--

DROP TABLE IF EXISTS `tbl_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(200) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_roles`
--

LOCK TABLES `tbl_roles` WRITE;
/*!40000 ALTER TABLE `tbl_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_savings_products`
--

DROP TABLE IF EXISTS `tbl_savings_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_savings_products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `min_amount` decimal(18,2) NOT NULL,
  `interest_percentage` decimal(3,2) NOT NULL,
  `fund_manager` int NOT NULL,
  `product_status` enum('ON_OFFER','SUSPENDED','DELETED') NOT NULL DEFAULT 'ON_OFFER',
  `day_to_lock_period` int NOT NULL,
  `days_to_dormant` int NOT NULL,
  `days_to_escheat` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `fund_managers` (`fund_manager`),
  CONSTRAINT `tbl_savings_products_ibfk_1` FOREIGN KEY (`fund_manager`) REFERENCES `tbl_fund_managers` (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_savings_products`
--

LOCK TABLES `tbl_savings_products` WRITE;
/*!40000 ALTER TABLE `tbl_savings_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_savings_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_staff`
--

DROP TABLE IF EXISTS `tbl_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_staff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL,
  `dob` date NOT NULL,
  `address_line_1` varchar(200) NOT NULL,
  `address_line_2` varchar(200) NOT NULL,
  `city` int NOT NULL,
  `country` int NOT NULL,
  `email_address` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL,
  `failed_auth_attempts` int NOT NULL DEFAULT '0',
  `status` enum('AWAITING.APPROVAL','AWAITING.AUTHORIZATION','ACTIVE','SUSPENDED','DELETED','LOCKED') NOT NULL DEFAULT 'AWAITING.APPROVAL',
  `posted_by` varchar(50) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `email_address` (`email_address`),
  KEY `role` (`role`),
  KEY `country` (`country`),
  KEY `city` (`city`),
  CONSTRAINT `tbl_staff_ibfk_1` FOREIGN KEY (`role`) REFERENCES `tbl_roles` (`role_id`),
  CONSTRAINT `tbl_staff_ibfk_2` FOREIGN KEY (`country`) REFERENCES `tbl_countries` (`id`),
  CONSTRAINT `tbl_staff_ibfk_3` FOREIGN KEY (`city`) REFERENCES `tbl_cities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_staff`
--

LOCK TABLES `tbl_staff` WRITE;
/*!40000 ALTER TABLE `tbl_staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_staff_branch_assignment`
--

DROP TABLE IF EXISTS `tbl_staff_branch_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_staff_branch_assignment` (
  `staff_id` int NOT NULL,
  `branch_id` varchar(5) NOT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`staff_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  KEY `role` (`role`),
  CONSTRAINT `tbl_staff_branch_assignment_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `tbl_branches` (`branch_code`),
  CONSTRAINT `tbl_staff_branch_assignment_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `tbl_staff` (`staff_id`),
  CONSTRAINT `tbl_staff_branch_assignment_ibfk_3` FOREIGN KEY (`role`) REFERENCES `tbl_roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_staff_branch_assignment`
--

LOCK TABLES `tbl_staff_branch_assignment` WRITE;
/*!40000 ALTER TABLE `tbl_staff_branch_assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_staff_branch_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_transaction_types`
--

DROP TABLE IF EXISTS `tbl_transaction_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_transaction_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_transaction_types`
--

LOCK TABLES `tbl_transaction_types` WRITE;
/*!40000 ALTER TABLE `tbl_transaction_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_transaction_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_transactions`
--

DROP TABLE IF EXISTS `tbl_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_transactions` (
  `txn_id` int NOT NULL AUTO_INCREMENT,
  `txn_reference` varchar(50) NOT NULL,
  `txn_type` int NOT NULL,
  `txn_amount` decimal(18,2) NOT NULL DEFAULT '0.00',
  `txn_account_number` varchar(10) NOT NULL,
  `txn_description` varchar(255) NOT NULL,
  `txn_currency` varchar(10) NOT NULL,
  `txn_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `txn_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`txn_id`),
  UNIQUE KEY `txn_reference` (`txn_reference`),
  KEY `txn_account_number` (`txn_account_number`),
  KEY `txn_type` (`txn_type`),
  CONSTRAINT `tbl_transactions_ibfk_1` FOREIGN KEY (`txn_account_number`) REFERENCES `tbl_accounts` (`account_number`),
  CONSTRAINT `tbl_transactions_ibfk_2` FOREIGN KEY (`txn_type`) REFERENCES `tbl_transaction_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_transactions`
--

LOCK TABLES `tbl_transactions` WRITE;
/*!40000 ALTER TABLE `tbl_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `create_txn_hash` AFTER INSERT ON `tbl_transactions` FOR EACH ROW INSERT INTO tbl_txn_signature (hash_value, txn_reference) VALUES (AES_ENCRYPT(CONCAT(NEW.txn_reference, NEW.txn_created_at, NEW.txn_updated_at, NEW.txn_amount),'Angelsdie1997@1997'), NEW.txn_reference) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_txn_signature`
--

DROP TABLE IF EXISTS `tbl_txn_signature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_txn_signature` (
  `hash_id` int NOT NULL AUTO_INCREMENT,
  `txn_reference` varchar(50) NOT NULL,
  `hash_value` text NOT NULL,
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hash_id`),
  UNIQUE KEY `hash_value` (`hash_value`(255)),
  KEY `txn_reference` (`txn_reference`),
  CONSTRAINT `tbl_txn_signature_ibfk_1` FOREIGN KEY (`txn_reference`) REFERENCES `tbl_transactions` (`txn_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_txn_signature`
--

LOCK TABLES `tbl_txn_signature` WRITE;
/*!40000 ALTER TABLE `tbl_txn_signature` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_txn_signature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_uncommitted_changes`
--

DROP TABLE IF EXISTS `tbl_uncommitted_changes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_uncommitted_changes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_by` varchar(50) NOT NULL,
  `checked_by` varchar(50) DEFAULT NULL,
  `serialized_values` text NOT NULL,
  `target` varchar(50) NOT NULL,
  `action` enum('UPDATE','CREATE','READ','DELETED') NOT NULL DEFAULT 'UPDATE',
  `status` enum('AWAITING.APPROVAL','COMMITTED','REJECTED') NOT NULL DEFAULT 'AWAITING.APPROVAL',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_uncommitted_changes`
--

LOCK TABLES `tbl_uncommitted_changes` WRITE;
/*!40000 ALTER TABLE `tbl_uncommitted_changes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_uncommitted_changes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ussd_logs`
--

DROP TABLE IF EXISTS `tbl_ussd_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ussd_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(100) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `app_values` text NOT NULL,
  `stage` varchar(50) NOT NULL,
  `status` enum('INPROGRESS','COMPLETE','FAILED') NOT NULL DEFAULT 'INPROGRESS',
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ussd_logs`
--

LOCK TABLES `tbl_ussd_logs` WRITE;
/*!40000 ALTER TABLE `tbl_ussd_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_ussd_logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-14 17:48:08
