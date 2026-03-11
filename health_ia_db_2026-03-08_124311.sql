-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: health_ia_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `allergies`
--

DROP TABLE IF EXISTS `allergies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allergies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `daily_food_categories`
--

DROP TABLE IF EXISTS `daily_food_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_food_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `daily_foods`
--

DROP TABLE IF EXISTS `daily_foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_foods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `calories_kcal` smallint(6) DEFAULT NULL,
  `protein_g` float DEFAULT NULL,
  `carbs_g` float DEFAULT NULL,
  `fat_g` float DEFAULT NULL,
  `fiber_g` float DEFAULT NULL,
  `sugar_g` float DEFAULT NULL,
  `sodium` smallint(6) DEFAULT NULL,
  `cholesterol` smallint(6) DEFAULT NULL,
  `meal_type` int(11) DEFAULT NULL,
  `water_intake_ml` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  KEY `meal_type` (`meal_type`),
  CONSTRAINT `daily_foods_ibfk_1` FOREIGN KEY (`category`) REFERENCES `daily_food_categories` (`id`),
  CONSTRAINT `daily_foods_ibfk_2` FOREIGN KEY (`meal_type`) REFERENCES `meal_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `diet_recommandation_types`
--

DROP TABLE IF EXISTS `diet_recommandation_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diet_recommandation_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `diet_recommendations`
--

DROP TABLE IF EXISTS `diet_recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diet_recommendations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `age` tinyint(4) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `height_cm` smallint(6) DEFAULT NULL,
  `current_weight_kg` float DEFAULT NULL,
  `BMI` float DEFAULT NULL,
  `disease_type` int(11) DEFAULT NULL,
  `severity` int(11) DEFAULT NULL,
  `diet_recommandation` int(11) DEFAULT NULL,
  `daily_caloric_target` smallint(6) DEFAULT NULL,
  `activity_level` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cholesterol_mg` float DEFAULT NULL,
  `blood_preassure_mmhg` smallint(6) DEFAULT NULL,
  `glucose_mg_dl` float DEFAULT NULL,
  `dietary_restrictions` int(11) DEFAULT NULL,
  `allergie` int(11) DEFAULT NULL,
  `preferred_cuisine` int(11) DEFAULT NULL,
  `weekly_exercice_hours` float DEFAULT NULL,
  `adherence_to_diet_plan` float DEFAULT NULL,
  `dietary_nutrinent_imbalance_score` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gender` (`gender`),
  KEY `disease_type` (`disease_type`),
  KEY `severity` (`severity`),
  KEY `diet_recommandation` (`diet_recommandation`),
  KEY `activity_level` (`activity_level`),
  KEY `dietary_restrictions` (`dietary_restrictions`),
  KEY `allergie` (`allergie`),
  KEY `preferred_cuisine` (`preferred_cuisine`),
  CONSTRAINT `diet_recommendations_ibfk_1` FOREIGN KEY (`gender`) REFERENCES `genders` (`id`),
  CONSTRAINT `diet_recommendations_ibfk_2` FOREIGN KEY (`disease_type`) REFERENCES `disease_types` (`id`),
  CONSTRAINT `diet_recommendations_ibfk_3` FOREIGN KEY (`severity`) REFERENCES `severity_types` (`id`),
  CONSTRAINT `diet_recommendations_ibfk_4` FOREIGN KEY (`diet_recommandation`) REFERENCES `diet_recommandation_types` (`id`),
  CONSTRAINT `diet_recommendations_ibfk_5` FOREIGN KEY (`activity_level`) REFERENCES `physical_activity_levels` (`id`),
  CONSTRAINT `diet_recommendations_ibfk_6` FOREIGN KEY (`dietary_restrictions`) REFERENCES `dietary_restrictions` (`id`),
  CONSTRAINT `diet_recommendations_ibfk_7` FOREIGN KEY (`allergie`) REFERENCES `allergies` (`id`),
  CONSTRAINT `diet_recommendations_ibfk_8` FOREIGN KEY (`preferred_cuisine`) REFERENCES `preferred_cuisine_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dietary_restrictions`
--

DROP TABLE IF EXISTS `dietary_restrictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dietary_restrictions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `disease_types`
--

DROP TABLE IF EXISTS `disease_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disease_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exercice_sessions`
--

DROP TABLE IF EXISTS `exercice_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercice_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `age` tinyint(4) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `weight_kg` smallint(6) DEFAULT NULL,
  `height_cm` smallint(6) DEFAULT NULL,
  `Max_BPM` smallint(6) DEFAULT NULL,
  `Avg_bpm` smallint(6) DEFAULT NULL,
  `Resting_BPM` smallint(6) DEFAULT NULL,
  `Session_Duration_hours` tinyint(4) DEFAULT NULL,
  `Calories_Burned` smallint(6) DEFAULT NULL,
  `Workout_Type` int(11) DEFAULT NULL,
  `Fat_Percentage` float DEFAULT NULL,
  `Water_Intake_liters` float DEFAULT NULL,
  `Workout_Frequency` tinyint(4) DEFAULT NULL,
  `Experience_Level` tinyint(4) DEFAULT NULL,
  `BMI` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gender` (`gender`),
  KEY `Workout_Type` (`Workout_Type`),
  CONSTRAINT `exercice_sessions_ibfk_1` FOREIGN KEY (`gender`) REFERENCES `genders` (`id`),
  CONSTRAINT `exercice_sessions_ibfk_2` FOREIGN KEY (`Workout_Type`) REFERENCES `workout_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `genders`
--

DROP TABLE IF EXISTS `genders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meal_types`
--

DROP TABLE IF EXISTS `meal_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `physical_activity_levels`
--

DROP TABLE IF EXISTS `physical_activity_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `physical_activity_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `preferred_cuisine_types`
--

DROP TABLE IF EXISTS `preferred_cuisine_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preferred_cuisine_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `severity_types`
--

DROP TABLE IF EXISTS `severity_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `severity_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `workout_types`
--

DROP TABLE IF EXISTS `workout_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'health_ia_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-08 12:43:15
