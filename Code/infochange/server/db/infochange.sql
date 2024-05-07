create schema infochange;

use infochange;

create
or
replace
table usuario (
    ID int auto_increment primary key, name varchar(32) not null, surname varchar(64) not null, username varchar(32) not null, email varchar(64) not null, address varchar(128) not null, postalCode int not null, country varchar(3) not null, phone varchar(16) not null, document varchar(10) not null, password varchar(64) not null, balance double
);

create
or
replace
table cartera (
    ID int auto_increment primary key, user int not null, coin varchar(4) not null, quantity double not null, constraint cartera_usuario_fk foreign key (user) references usuario (ID)
);