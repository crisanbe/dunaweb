CREATE DATABASE Duna;

use Duna;

CREATE TABLE `duna`.`productos` (
  `idproductos` INT NOT NULL AUTO_INCREMENT,
  `nombrepro` VARCHAR(45) NOT NULL,
  `codproducto` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `precio` INT NOT NULL,
  PRIMARY KEY (`idproductos`));


select * from productos;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '3209198407velez';

CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar';

USE `duna`;
DROP procedure IF EXISTS `cliente_procedure`;

DELIMITER $$
USE `duna`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `cliente_procedure`(
IN _idproductos INT,
IN _nomprepro VARCHAR(45),
IN _codproducto VARCHAR(45),
IN _descripcion VARCHAR(45),
IN _precio INT
)
BEGIN
    IF _idproductos = 0 THEN
		INSERT INTO prodcutos(codproducto,nomprepro,descripcion,precio)
        VALUES (_codproducto,_nomprepro,_descripcion,_precio);
        
        SET _idproductos = LAST_INSERT_ID();
	ELSE 
		UPDATE prodcutos
		SET
        codproducto = _codproducto,
        nomprepro = _nomprepro,
        descripcion = _descripcion,
        precio = _precio
        WHERE idproductos = _idproductos;
        END IF;
        
        SELECT _idproductos AS 'idproductos';

END$$

DELIMITER ;

