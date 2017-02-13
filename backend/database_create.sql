-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Uzytkownicy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Uzytkownicy` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(20) NOT NULL,
  `haslo` VARCHAR(50) NOT NULL,
  `token` VARCHAR(50) NOT NULL,
  `rola` VARCHAR(12) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`Dane_kontaktowe`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Dane_kontaktowe` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `imie` VARCHAR(45) NOT NULL,
  `nazwisko` VARCHAR(45) NOT NULL,
  `telefon` VARCHAR(9) NOT NULL,
  `miejscowosc` VARCHAR(24) NOT NULL,
  `Uzytkownicy_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `telefon_UNIQUE` (`telefon` ASC),
  INDEX `fk_Dane_kontaktowe_Uzytkownicy1_idx` (`Uzytkownicy_id` ASC),
  CONSTRAINT `fk_Dane_kontaktowe_Uzytkownicy1`
    FOREIGN KEY (`Uzytkownicy_id`)
    REFERENCES `mydb`.`Uzytkownicy` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`Kategorie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Kategorie` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nazwa_kategoria` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`Produkt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Produkt` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nazwa` VARCHAR(45) NOT NULL,
  `ilosc` INT(45) NOT NULL,
  `cena` DECIMAL(18,2) NOT NULL,
  `Kategorie_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Produkt_Kategorie1_idx` (`Kategorie_id` ASC),
  CONSTRAINT `fk_Produkt_Kategorie1`
    FOREIGN KEY (`Kategorie_id`)
    REFERENCES `mydb`.`Kategorie` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`Statusy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Statusy` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nazwa` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`Zamowienie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Zamowienie` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Statusy_id` INT(11) NULL DEFAULT '1',
  `Uzytkownicy_id` INT(11) NOT NULL,
  `data` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_Zamowienie_Statusy1_idx` (`Statusy_id` ASC),
  INDEX `fk_Zamowienie_Uzytkownicy1_idx` (`Uzytkownicy_id` ASC),
  CONSTRAINT `fk_Zamowienie_Statusy1`
    FOREIGN KEY (`Statusy_id`)
    REFERENCES `mydb`.`Statusy` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Zamowienie_Uzytkownicy1`
    FOREIGN KEY (`Uzytkownicy_id`)
    REFERENCES `mydb`.`Uzytkownicy` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 53
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`Zamowienie_Produkt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Zamowienie_Produkt` (
  `Zamowienie_id` INT(11) NOT NULL,
  `Produkt_id` INT(11) NOT NULL,
  `ilosc` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Zamowienie_id`, `Produkt_id`),
  INDEX `fk_Zamowienie_has_Produkt_Produkt1_idx` (`Produkt_id` ASC),
  INDEX `fk_Zamowienie_has_Produkt_Zamowienie1_idx` (`Zamowienie_id` ASC),
  CONSTRAINT `fk_Zamowienie_has_Produkt_Produkt1`
    FOREIGN KEY (`Produkt_id`)
    REFERENCES `mydb`.`Produkt` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Zamowienie_has_Produkt_Zamowienie1`
    FOREIGN KEY (`Zamowienie_id`)
    REFERENCES `mydb`.`Zamowienie` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
