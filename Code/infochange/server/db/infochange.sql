create schema infochange;

use infochange;

create
or
replace
table usuario (
    ID int auto_increment primary key, Nombre varchar(32) not null, Apellidos varchar(64) not null, Usuario varchar(32) not null, Email varchar(64) not null, Direccion varchar(128) not null, Codigo_Postal int not null, Pais varchar(3) not null, Telefono varchar(16) not null, Documento_Identidad varchar(10) not null, Clave varchar(64) not null
);

create
or
replace
table cartera (
    ID int auto_increment primary key, Usuario int not null, Moneda varchar(4) not null, Cantidad double not null, constraint cartera_usuario_fk foreign key (Usuario) references usuario (ID)
);