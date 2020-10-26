-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ict
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ict
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ict` DEFAULT CHARACTER SET utf8 ;
USE `ict` ;

-- -----------------------------------------------------
-- Table `ict`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`User` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `userPW` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `birth` DATE NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `gender` TINYINT NOT NULL,
  `lawyer` TINYINT NOT NULL,
  `userID` VARCHAR(45) NOT NULL,
  `photo` TEXT NULL,
  `phone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Post` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `boardCategory` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `content` TEXT NOT NULL,
  `writtenDate` DATETIME NOT NULL,
  `views` INT NOT NULL,
  `reports` INT NOT NULL,
  `User_ID` INT NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_Board_User1_idx` (`User_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Board_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Lawyer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Lawyer` (
  `companyName` VARCHAR(45) NULL,
  `companyPhone` VARCHAR(45) NULL,
  `introduction` TEXT NULL,
  `address1` VARCHAR(45) NULL,
  `address2` VARCHAR(45) NULL,
  `ID` INT NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `fk_Lawyer_User`
    FOREIGN KEY (`ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Reply`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Reply` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(45) NOT NULL,
  `writtenDate` DATETIME NOT NULL,
  `reports` INT NOT NULL,
  `Post_ID` INT NOT NULL,
  `User_ID` INT NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_Reply_Post1_idx` (`Post_ID` ASC) VISIBLE,
  INDEX `fk_Reply_User1_idx` (`User_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Reply_Post1`
    FOREIGN KEY (`Post_ID`)
    REFERENCES `ict`.`Post` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Reply_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Precedent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Precedent` (
  `ID` INT NOT NULL,
  `caseName` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`FavCase`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`FavCase` (
  `User_ID` INT NOT NULL,
  `Precedent_ID` INT NOT NULL,
  PRIMARY KEY (`User_ID`, `Precedent_ID`),
  INDEX `fk_FavCase_User1_idx` (`User_ID` ASC) VISIBLE,
  INDEX `fk_FavCase_Precedent1_idx` (`Precedent_ID` ASC) VISIBLE,
  CONSTRAINT `fk_FavCase_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FavCase_Precedent1`
    FOREIGN KEY (`Precedent_ID`)
    REFERENCES `ict`.`Precedent` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`FavLawyer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`FavLawyer` (
  `User_ID` INT NOT NULL,
  `Lawyer_ID` INT NOT NULL,
  PRIMARY KEY (`User_ID`, `Lawyer_ID`),
  INDEX `fk_FavLawyer_User1_idx` (`User_ID` ASC) VISIBLE,
  INDEX `fk_FavLawyer_Lawyer1_idx` (`Lawyer_ID` ASC) VISIBLE,
  CONSTRAINT `fk_FavLawyer_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FavLawyer_Lawyer1`
    FOREIGN KEY (`Lawyer_ID`)
    REFERENCES `ict`.`Lawyer` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`FavPost`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`FavPost` (
  `User_ID` INT NOT NULL,
  `Board_ID` INT NOT NULL,
  PRIMARY KEY (`User_ID`, `Board_ID`),
  INDEX `fk_FavPost_User1_idx` (`User_ID` ASC) VISIBLE,
  INDEX `fk_FavPost_Board1_idx` (`Board_ID` ASC) VISIBLE,
  CONSTRAINT `fk_FavPost_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FavPost_Board1`
    FOREIGN KEY (`Board_ID`)
    REFERENCES `ict`.`Post` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Category` (
  `ID` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `refCount` INT NOT NULL COMMENT '참조 횟수\n',
  `majorBool` TINYINT NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`LawyerField`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`LawyerField` (
  `Lawyer_ID` INT NOT NULL,
  `Category_ID` INT NOT NULL,
  PRIMARY KEY (`Lawyer_ID`, `Category_ID`),
  INDEX `fk_LawyerField_Category1_idx` (`Category_ID` ASC) VISIBLE,
  CONSTRAINT `fk_LawyerField_Lawyer1`
    FOREIGN KEY (`Lawyer_ID`)
    REFERENCES `ict`.`Lawyer` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_LawyerField_Category1`
    FOREIGN KEY (`Category_ID`)
    REFERENCES `ict`.`Category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Career`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Career` (
  `detail` VARCHAR(45) NOT NULL,
  `Lawyer_ID` INT NOT NULL,
  `startYear` INT NOT NULL,
  `endYear` INT NULL,
  PRIMARY KEY (`detail`, `Lawyer_ID`),
  INDEX `fk_Career_Lawyer1_idx` (`Lawyer_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Career_Lawyer1`
    FOREIGN KEY (`Lawyer_ID`)
    REFERENCES `ict`.`Lawyer` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Qualification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Qualification` (
  `detail` VARCHAR(45) NOT NULL,
  `Lawyer_ID` INT NOT NULL,
  `startYear` INT NOT NULL,
  `endYear` INT NULL,
  PRIMARY KEY (`detail`, `Lawyer_ID`),
  INDEX `fk_Qualification_Lawyer1_idx` (`Lawyer_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Qualification_Lawyer1`
    FOREIGN KEY (`Lawyer_ID`)
    REFERENCES `ict`.`Lawyer` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`LawyerReview`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`LawyerReview` (
  `rate` INT NOT NULL,
  `recommend` TINYINT NOT NULL,
  `Lawyer_ID` INT NOT NULL,
  `User_ID` INT NOT NULL,
  `title` VARCHAR(45) NULL,
  `content` TEXT NULL,
  `writtenDate` DATETIME NOT NULL,
  PRIMARY KEY (`Lawyer_ID`, `User_ID`),
  INDEX `fk_LawyerReview_User1_idx` (`User_ID` ASC) VISIBLE,
  CONSTRAINT `fk_LawyerReview_Lawyer1`
    FOREIGN KEY (`Lawyer_ID`)
    REFERENCES `ict`.`Lawyer` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_LawyerReview_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Activity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Activity` (
  `detail` VARCHAR(45) NOT NULL,
  `Lawyer_ID` INT NOT NULL,
  `url` TEXT NULL,
  PRIMARY KEY (`detail`, `Lawyer_ID`),
  INDEX `fk_Activity_Lawyer1_idx` (`Lawyer_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Activity_Lawyer1`
    FOREIGN KEY (`Lawyer_ID`)
    REFERENCES `ict`.`Lawyer` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Education`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Education` (
  `detail` VARCHAR(45) NOT NULL,
  `Lawyer_ID` INT NOT NULL,
  `startYear` INT NOT NULL,
  `endYear` INT NULL,
  PRIMARY KEY (`detail`, `Lawyer_ID`),
  INDEX `fk_Education_Lawyer1_idx` (`Lawyer_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Education_Lawyer1`
    FOREIGN KEY (`Lawyer_ID`)
    REFERENCES `ict`.`Lawyer` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Summary`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Summary` (
  `keyIndex` INT NOT NULL,
  `keyWeight` DOUBLE(18,17) NOT NULL,
  `Precedent_ID` INT NOT NULL,
  PRIMARY KEY (`keyIndex`, `Precedent_ID`),
  INDEX `fk_Summary_Precedent1_idx` (`Precedent_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Summary_Precedent1`
    FOREIGN KEY (`Precedent_ID`)
    REFERENCES `ict`.`Precedent` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Judgement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Judgement` (
  `keyIndex` INT NOT NULL,
  `keyWeight` DOUBLE(18,17) NOT NULL,
  `Precedent_ID` INT NOT NULL,
  PRIMARY KEY (`keyIndex`, `Precedent_ID`),
  INDEX `fk_Judgement_Precedent1_idx` (`Precedent_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Judgement_Precedent1`
    FOREIGN KEY (`Precedent_ID`)
    REFERENCES `ict`.`Precedent` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Content`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Content` (
  `keyIndex` INT NOT NULL,
  `keyWeight` DOUBLE(18,17) NOT NULL,
  `Precedent_ID` INT NOT NULL,
  PRIMARY KEY (`keyIndex`, `Precedent_ID`),
  INDEX `fk_Content_Precedent1_idx` (`Precedent_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Content_Precedent1`
    FOREIGN KEY (`Precedent_ID`)
    REFERENCES `ict`.`Precedent` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`UserInterestCategory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`UserInterestCategory` (
  `User_ID` INT NOT NULL,
  `Category_ID` INT NOT NULL,
  PRIMARY KEY (`User_ID`, `Category_ID`),
  INDEX `fk_User_has_Category_Category1_idx` (`Category_ID` ASC) VISIBLE,
  INDEX `fk_User_has_Category_User1_idx` (`User_ID` ASC) VISIBLE,
  CONSTRAINT `fk_User_has_Category_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_Category_Category1`
    FOREIGN KEY (`Category_ID`)
    REFERENCES `ict`.`Category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Question` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `content` VARCHAR(45) NOT NULL,
  `User_ID` INT NOT NULL,
  `writtenDate` DATETIME NOT NULL,
  `views` INT NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_Question_User1_idx` (`User_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Question_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`FavQA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`FavQA` (
  `User_ID` INT NOT NULL,
  `Question_ID` INT NOT NULL,
  PRIMARY KEY (`User_ID`, `Question_ID`),
  INDEX `fk_FavQA_User1_idx` (`User_ID` ASC) VISIBLE,
  INDEX `fk_FavQA_Question1_idx` (`Question_ID` ASC) VISIBLE,
  CONSTRAINT `fk_FavQA_User1`
    FOREIGN KEY (`User_ID`)
    REFERENCES `ict`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FavQA_Question1`
    FOREIGN KEY (`Question_ID`)
    REFERENCES `ict`.`Question` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Answer` (
  `ID` INT NOT NULL,
  `content` TEXT NOT NULL,
  `Question_ID` INT NOT NULL,
  `Lawyer_ID` INT NOT NULL,
  PRIMARY KEY (`ID`, `Question_ID`, `Lawyer_ID`),
  INDEX `fk_Answer_Question1_idx` (`Question_ID` ASC) VISIBLE,
  INDEX `fk_Answer_Lawyer1_idx` (`Lawyer_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Answer_Question1`
    FOREIGN KEY (`Question_ID`)
    REFERENCES `ict`.`Question` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Answer_Lawyer1`
    FOREIGN KEY (`Lawyer_ID`)
    REFERENCES `ict`.`Lawyer` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`LawyerReview_has_Category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`LawyerReview_has_Category` (
  `LawyerReview_Lawyer_ID` INT NOT NULL,
  `LawyerReview_User_ID` INT NOT NULL,
  `Category_ID` INT NOT NULL,
  PRIMARY KEY (`LawyerReview_Lawyer_ID`, `LawyerReview_User_ID`, `Category_ID`),
  INDEX `fk_LawyerReview_has_Category_Category1_idx` (`Category_ID` ASC) VISIBLE,
  INDEX `fk_LawyerReview_has_Category_LawyerReview1_idx` (`LawyerReview_Lawyer_ID` ASC, `LawyerReview_User_ID` ASC) VISIBLE,
  CONSTRAINT `fk_LawyerReview_has_Category_LawyerReview1`
    FOREIGN KEY (`LawyerReview_Lawyer_ID` , `LawyerReview_User_ID`)
    REFERENCES `ict`.`LawyerReview` (`Lawyer_ID` , `User_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_LawyerReview_has_Category_Category1`
    FOREIGN KEY (`Category_ID`)
    REFERENCES `ict`.`Category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ict`.`Question_has_Category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ict`.`Question_has_Category` (
  `Question_ID` INT NOT NULL,
  `Category_ID` INT NOT NULL,
  PRIMARY KEY (`Question_ID`, `Category_ID`),
  INDEX `fk_Question_has_Category_Category1_idx` (`Category_ID` ASC) VISIBLE,
  INDEX `fk_Question_has_Category_Question1_idx` (`Question_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Question_has_Category_Question1`
    FOREIGN KEY (`Question_ID`)
    REFERENCES `ict`.`Question` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Question_has_Category_Category1`
    FOREIGN KEY (`Category_ID`)
    REFERENCES `ict`.`Category` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
