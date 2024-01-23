create table profile.user
(
    id       int auto_increment
        primary key,
    username varchar(20) not null,
    password varchar(32) not null,
    qq       int         not null
);

