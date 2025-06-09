-- SQL Server - Estructura y datos del sistema de ventas
CREATE DATABASE SistemaVentas;
GO

USE SistemaVentas;
GO

-- Tabla Vendedor
CREATE TABLE Vendedor (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL,
    correo NVARCHAR(100)
);

-- Tabla Producto
CREATE TABLE producto (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL
);

-- Tabla Venta
CREATE TABLE venta (
    id INT PRIMARY KEY IDENTITY(1,1),
    idProducto INT NOT NULL,
    idVendedor INT NOT NULL,
    cantidad INT NOT NULL,
    CONSTRAINT FK_Venta_Producto FOREIGN KEY (ProductoId) REFERENCES Producto(Id),
    CONSTRAINT FK_Venta_Vendedor FOREIGN KEY (VendedorId) REFERENCES Vendedor(Id)
);
