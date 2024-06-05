create schema infochange;

use infochange;

CREATE TABLE `usuario` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `sexo` varchar(10) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `secureQuestionText` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `postalCode` varchar(10) NOT NULL,
  `country` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `document` varchar(45) NOT NULL,
  `mode` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
);

CREATE TABLE `payment_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` int NOT NULL,
  `type` varchar(45) NOT NULL,
  `quantity` double NOT NULL,
  `date` datetime NOT NULL,
  `method` varchar(45) NOT NULL,
  `info` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_fk_idx` (`user`),
  CONSTRAINT `user_fk` FOREIGN KEY (`user`) REFERENCES `usuario` (`ID`)
);

CREATE TABLE IF NOT EXISTS cartera (
    ID int auto_increment primary key,
    user int not null,
    coin varchar(4) not null,
    quantity double not null,
    constraint cartera_usuario_fk foreign key (user) references usuario (ID)
);

CREATE TABLE IF NOT EXISTS trade_history (
  ID int NOT NULL AUTO_INCREMENT,
  user int NOT NULL,
  symbol varchar(64) NOT NULL,
  type varchar(32) NOT NULL,
  paid_amount double NOT NULL,
  amount_received double NOT NULL,
  comission double NOT NULL,
  date datetime NOT NULL,
  price double NOT NULL,
  PRIMARY KEY (ID),
  KEY userfk_idx (user),
  CONSTRAINT userfk FOREIGN KEY (user) REFERENCES usuario (ID)
);

CREATE TABLE `bizum_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  `quantity` double NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_fk_idx` (`sender`),
  KEY `receiver_fk_idx` (`receiver`),
  CONSTRAINT `receiver_fk` FOREIGN KEY (`receiver`) REFERENCES `usuario` (`ID`),
  CONSTRAINT `sender_fk` FOREIGN KEY (`sender`) REFERENCES `usuario` (`ID`)
);