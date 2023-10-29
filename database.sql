CREATE DATABASE IF NOT EXISTS `Silicon Misiones` DEFAULT CHARACTER SET utf8;
USE `Silicon Misiones`;

-- Crear la tabla `rol`
CREATE TABLE IF NOT EXISTS `rol` (
  `id_rol` INT auto_increment,
  `nombre_rol` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE INDEX `id_rol_UNIQUE` (`id_rol` ASC)
) ENGINE = InnoDB;

-- Crear la tabla `usuario`
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` INT auto_increment,
  `nickname` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `telefono` INT(50) NULL,
  `rol_id_rol` INT NOT NULL,
  PRIMARY KEY (`id_usuario`, `rol_id_rol`),
  INDEX `fk_usuario_rol1_idx` (`rol_id_rol` ASC),
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_usuario` ASC),
  CONSTRAINT `fk_usuario_rol1`
    FOREIGN KEY (`rol_id_rol`)
    REFERENCES `rol` (`id_rol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- Crear la tabla `casa`
CREATE TABLE IF NOT EXISTS `casa` (
  `id_casa` INT auto_increment,
  `descripcion` VARCHAR(1000) NOT NULL,
  `precio_compra` DECIMAL(50) NULL,
  `superficie` VARCHAR(100) NOT NULL,
  `precio_alquiler` VARCHAR(45) NULL,
  PRIMARY KEY (`id_casa`),
  UNIQUE INDEX `id_casa_UNIQUE` (`id_casa` ASC)
) ENGINE = InnoDB;

-- Crear la tabla `compra`
CREATE TABLE IF NOT EXISTS `compra` (
  `id_compra` INT auto_increment,
  `fecha_compra` DATE NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  `usuario_rol_id_rol` INT NOT NULL,
  `casa_id_casa` INT NOT NULL,
  PRIMARY KEY (`id_compra`, `usuario_id_usuario`, `usuario_rol_id_rol`, `casa_id_casa`),
  UNIQUE INDEX `id_compra_UNIQUE` (`id_compra` ASC),
  INDEX `fk_compra_usuario2_idx` (`usuario_id_usuario` ASC, `usuario_rol_id_rol` ASC),
  INDEX `fk_compra_casa2_idx` (`casa_id_casa` ASC),
  CONSTRAINT `fk_compra_usuario2`
    FOREIGN KEY (`usuario_id_usuario`, `usuario_rol_id_rol`)
    REFERENCES `usuario` (`id_usuario`, `rol_id_rol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compra_casa2`
    FOREIGN KEY (`casa_id_casa`)
    REFERENCES `casa` (`id_casa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- Crear la tabla `reserva`
CREATE TABLE IF NOT EXISTS `reserva` (
  `id_reserva` INT auto_increment,
  `fecha_reserva` DATE NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  `usuario_rol_id_rol` INT NOT NULL,
  `casa_id_casa` INT NOT NULL,
  PRIMARY KEY (`id_reserva`, `usuario_id_usuario`, `usuario_rol_id_rol`, `casa_id_casa`),
  UNIQUE INDEX `id_reserva_UNIQUE` (`id_reserva` ASC),
  INDEX `fk_reserva_usuario2_idx` (`usuario_id_usuario` ASC, `usuario_rol_id_rol` ASC),
  INDEX `fk_reserva_casa2_idx` (`casa_id_casa` ASC),
  CONSTRAINT `fk_reserva_usuario2`
    FOREIGN KEY (`usuario_id_usuario`, `usuario_rol_id_rol`)
    REFERENCES `usuario` (`id_usuario`, `rol_id_rol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reserva_casa2`
    FOREIGN KEY (`casa_id_casa`)
    REFERENCES `casa` (`id_casa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- Crear la tabla `imagenes`
CREATE TABLE IF NOT EXISTS `imagenes` (
  `id_imagenes` INT auto_increment,
  `url` VARCHAR(100) NOT NULL,
  `casa_id_casa` INT NOT NULL,
  PRIMARY KEY (`id_imagenes`, `casa_id_casa`),
  UNIQUE INDEX `id_imagenes_UNIQUE` (`id_imagenes` ASC),
  INDEX `fk_imagenes_casa1_idx` (`casa_id_casa` ASC),
  CONSTRAINT `fk_imagenes_casa1`
    FOREIGN KEY (`casa_id_casa`)
    REFERENCES `casa` (`id_casa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;



INSERT INTO `silicon misiones`.`rol` (`id_rol`, `nombre_rol`) VALUES ('1', 'administrador');
INSERT INTO `silicon misiones`.`rol` (`nombre_rol`) VALUES ('usuario');
INSERT INTO `silicon misiones`.`usuario` (`id_usuario`, `nickname`, `password`, `email`, `telefono`, `rol_id_rol`) VALUES ('1', 'fabricio', '1234', 'fabricio@gmail.com', '1144950525', '1');
INSERT INTO `silicon misiones`.`casa` (`id_casa`, `descripcion`, `precio_compra`, `superficie`, `precio_alquiler`) VALUES ('1', 'casa roja', '200.000', '200 metros cuadrados', '60.000');
INSERT INTO `silicon misiones`.`reserva` (`id_reserva`, `fecha_reserva`, `fecha_inicio`, `fecha_fin`, `usuario_id_usuario`, `usuario_rol_id_rol`, `casa_id_casa`) VALUES ('1', '2023-10-17', '2023-10-17', '2023-10-17', '1', '1', '1');
INSERT INTO `silicon misiones`.`imagenes` (`id_imagenes`, `url`, `casa_id_casa`) VALUES ('1', 'ninguno', '1');
INSERT INTO `silicon misiones`.`compra` (`id_compra`, `fecha_compra`, `usuario_id_usuario`, `usuario_rol_id_rol`, `casa_id_casa`) VALUES ('1', '2023-10-17', '1', '1', '1');
