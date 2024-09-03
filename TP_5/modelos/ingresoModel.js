//codigo encargado de gestionar los datos con la base de datos de los ingresos
require('rootpath')();

const mysql = require("mysql");
const configuracion = require("config.json");

const { query } = require('express');
// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log("BD conectada");
    }
});

var metodos = {}

//--> ingresoBD.metodos.crearIngreso(req.body, (err, exito) => {});

metodos.crearIngreso = function (datosIngreso, callback) {
    const ingreso = [
        datosIngreso.id_ingreso,
        datosIngreso.fecha_ingreso,
        datosIngreso.numero_habitacion,
        datosIngreso.numero_cama,
        datosIngreso.observaciones,
        datosIngreso.numero_historial_paciente,
        datosIngreso.matricula_medico,
    ];

    const consulta = `
        INSERT INTO INGRESO (id_ingreso, fecha_ingreso, numero_habitacion, numero_cama, observaciones, numero_historial_paciente, matricula_medico)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(consulta, ingreso, (err, rows) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                callback({
                    message: "Ya existe un ingreso con el numero_historial_paciente " + datosPaciente.numero_historial_clinico,
                    detail: err.sqlMessage
                });
            } else {
                callback({
                    message: "Ocurrió un error al intentar agregar ingreso nuevo",
                    detail: err.sqlMessage
                });
            }
        } else {
            callback(null, {
                message: "Ingreso " + datosIngreso.id_ingreso + " " + datosIngreso.numero_historial_paciente + " se registró correctamente",
                detail: rows,
            });
        }
    });
};


// Definir el método getAll
var metodos = {
    getAll: function (callback) {
        const consulta = "SELECT * FROM ingreso";
        connection.query(consulta, (err, resultados) => {
            if (err) {
                callback(err);
            } else {
                callback(null, {
                    message: "Resultados de la consulta",
                    detail: resultados,
                });
            }
        });
    }
};
// --> app.get('/:numero_historial_paciente', obtenerIngreso);  -->  ingresoBD.getIngreso(numero_historial_clinico, () => {})
metodos.getIngreso = function (numero_historial_paciente, callback) {
        consulta = "select * from ingreso where numero_historial_paciente = ?";
    
        connection.query(consulta, numero_historial_paciente, function (err, resultados, fields) {
            if (err) {
                callback(err);
            } else {
                if (resultados.length == 0) {
                    callback(undefined, "no se encontro un ingreso con numero_historial_paciente:" + numero_historial_paciente)
                } else {
                    callback(undefined, {
                        messaje: "Resultados de la consulta",
                        detail: resultados,
                    });
                }
            }
    
        });
    
    }


module.exports = { metodos }