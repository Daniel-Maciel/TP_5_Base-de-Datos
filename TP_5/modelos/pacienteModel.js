//codigo encargado de gestionar los datos con la base de datos de los pacientes
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

// --> app.get("/", listarTodo());  --> paciente = pacienteBD.getAll((err, result) => {}
   
// Definir el método getAll
var metodos = {
    getAll: function (callback) {
        const consulta = "SELECT * FROM paciente";
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

// --> app.get('/:numero_historial_clinico', obtenerPaciente);  -->  pacientecoBD.getPaciente(numero_historial_clinico, () => {})
    metodos.getPaciente = function (numero_historial_clinico, callback) {
        consulta = "select * from paciente where numero_historial_clinico = ?";
    
        connection.query(consulta, numero_historial_clinico, function (err, resultados, fields) {
            if (err) {
                callback(err);
            } else {
                if (resultados.length == 0) {
                    callback(undefined, "no se encontro un paciente con numero_historial_clinico:" + numero_historial_clinico)
                } else {
                    callback(undefined, {
                        messaje: "Resultados de la consulta",
                        detail: resultados,
                    });
                }
            }
    
        });
    
    }


// La solicitud de pacientes por nss

var metodos = {
    getBynss: function (nss, callback) {
        const consulta = "SELECT * FROM paciente WHERE nss = ?";
        connection.query(consulta, [nss], (err, resultados) => {
            if (err) {
                callback(err);
            } else {
                if (resultados.length === 0) {
                    callback(null, { message: "No se encontró paciente con nss: " + nss });
                } else {
                    callback(null, {
                        message: "Resultados de la consulta por nss: " + nss,
                        detail: resultados,
                    });
                }
            }
        });
    }
};


//--> pacienteBD.metodos.crearPaciente(req.body, (err, exito) => {});

metodos.crearPaciente = function (datosPaciente, callback) {
    const paciente = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.numero_historial_clinico,
        datosPaciente.observaciones,
    ];

    const consulta = `
        INSERT INTO MEDICO (nss, nombre, apellido, domicilio, codigo_postal, telefono, numero_historial_clinico, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(consulta, paciente, (err, rows) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                callback({
                    message: "Ya existe un paciente con el número de historial clínico " + datosPaciente.numero_historial_clinico,
                    detail: err.sqlMessage
                });
            } else {
                callback({
                    message: "Ocurrió un error al intentar agregar el paciente",
                    detail: err.sqlMessage
                });
            }
        } else {
            callback(null, {
                message: "El paciente " + datosPaciente.nombre + " " + datosPaciente.apellido + " se registró correctamente",
                detail: rows,
            });
        }
    });
};

//--> app.put("/:numero_historial_clinico", modificarPaciente);  --> function modificarPaciente(req, res) {}

metodos.update = function (datosPaciente, deTalPaciente, callback) {

    datos = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.numero_historial_clinico,
        datosPaciente.observaciones,
        parseInt(deTalPaciente)
    ];
    consulta = "update paciente set  numero_historial_clinico = ?, nombre = ?, apellido = ?, domicilio = ?, codigo_postal = ?, telefono = ?, observaciones = ? WHERE numero_historial_clinico = ?";


    connection.query(consulta, datos, (err, rows) => {
        if (err) {
            callback(err);
        } else {

            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message:
                        `no se enocntro un medico con la matricula el medico ${deTalMedico}`,
                    detail: rows,
                })
            } else {
                callback(undefined, {
                    message:
                        `el medico ${datosMedico.nombre} se actualizo correctamente`,
                    detail: rows,
                })
            }

        }
    });


}

//--> app.delete("/:numero_historial_clinico", eliminarPaciente); --> pacienteBD.metodos.deletePaciente(req.params.numero_historial_clinico, (err, exito) => {}); 
metodos.deletePaciente = function (numero_historial_clinico, callback) {
    query = "delete from paciente where numero_historial_clinico = ?";
    connection.query(query, numero_historial_clinico, function (err, rows, fields) {
        if (err) {
            callback({
                message: "ha ocurrido un error",
                detail: err,
            });
        }

        if (rows.affectedRows == 0) {
            callback(undefined, "No se encontro un paciente con numero_historial_clinico " + numero_historial_clinico);
        } else {
            callback(undefined, "el paciente " + numero_historial_clinico + " fue eliminado de la Base de datos");
        }
    });
}




module.exports = { metodos }