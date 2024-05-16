create schema infochange;

use infochange;

CREATE TABLE IF NOT EXISTS usuario (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    sexo VARCHAR(10) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    secureQuestionText VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    postalCode VARCHAR(10) NOT NULL,
    country VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
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