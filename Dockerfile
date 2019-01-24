FROM php:5.6.23-apache
ADD php.ini /usr/local/etc/php/
 
RUN apt-get update
RUN docker-php-ext-install pdo_mysql
