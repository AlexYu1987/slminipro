/*
* Order System database initializing SQL.
* Author: Alex.Y
* Created: 2018/6/18
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `users` (`openId` VARCHAR(100) , `balance` FLOAT DEFAULT 0, `discount` FLOAT DEFAULT 1, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`openId`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `orders` 
  (
    `id` CHAR(36) BINARY , `status` ENUM('waitting', 'processing', 'completing') NOT NULL DEFAULT 'waitting', 
    `isSF` TINYINT(1) DEFAULT false, `note` TEXT, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
    `userId` CHAR(36) BINARY, PRIMARY KEY (`id`), 
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `addresses` 
(
  `id` CHAR(36) BINARY , `name` VARCHAR(255) NOT NULL, `gender` ENUM('male', 'female') NOT NULL, 
  `province` VARCHAR(255) NOT NULL, `city` VARCHAR(255) NOT NULL, `street` VARCHAR(255) NOT NULL, 
  `phone` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
  `userId` CHAR(36) BINARY, `orderId` CHAR(36) BINARY, PRIMARY KEY (`id`), 
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE, 
  FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Expresses` 
(
  `id` CHAR(36) BINARY , `company` VARCHAR(255) NOT NULL, `number` VARCHAR(255) NOT NULL, `fee` FLOAT NOT NULL, 
  `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `orderId` CHAR(36) BINARY, PRIMARY KEY (`id`), 
  FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `details` 
(
  `id` CHAR(36) BINARY , `count` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL,
  `orderId` CHAR(36) BINARY, PRIMARY KEY (`id`), 
  FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `commodities` 
(
  `id` CHAR(36) BINARY , `bigPic` VARCHAR(255), `smallPic` VARCHAR(255), `name` VARCHAR(255) NOT NULL, 
  `discription` TEXT, `param` TEXT, `ensure` TEXT, `price` FLOAT NOT NULL, `createdAt` DATETIME NOT NULL, 
  `updatedAt` DATETIME NOT NULL, `detailId` CHAR(36) BINARY, PRIMARY KEY (`id`), FOREIGN KEY (`detailId`) REFERENCES        `details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;