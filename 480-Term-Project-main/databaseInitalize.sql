DROP DATABASE IF EXISTS ENSF480;
CREATE DATABASE ENSF480; 
USE ENSF480;

drop user IF EXISTS 'springuser'@'localhost'; 
create user 'springuser'@'localhost' identified by 'ThePassword';
grant all on ENSF480.* to 'springuser'@'localhost';