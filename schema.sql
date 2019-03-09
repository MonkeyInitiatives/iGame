-- Drops the gamelist if it exists currently --
DROP DATABASE IF EXISTS gamelist;
-- Creates the "gamelist" database --
CREATE DATABASE gamelist;

CREATE TABLE Users
(
	id int NOT NULL AUTO_INCREMENT,
	burger_name varchar(255) NOT NULL,
	devoured BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
);
