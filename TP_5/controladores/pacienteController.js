//--- requires ------------------------------------------
const express = require('express');

const router = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());
//app.use(bodyParser.json());

const pacienteBD = require("./../modelos/pacienteModel.js");
// -------------------------------------------------------- 
// --rutas de escucha (endpoint) dispoibles para PACIENTE --- 
// --------------------------------------------------------

app.get('/pacientes', listarTodo);
app.get('/pacientes/nss', getBynss);
app.post('/pacientes', crearPaciente);
app.get('/:numero_historial_clinico', obtenerPaciente);
app.delete("/:numero_historial_clinico", eliminarPaciente);
app.put("/:numero_historial_clinico", modificarPaciente);

// --------------------------------------------------------
// ---------FUNCIONES UTILIZADAS EN ENDPOINTS -------------
// --------------------------------------------------------


// función listarTodo
function listarTodo(req, res) {
    metodos.getAll((err, result) => {
        if (err) {
            res.status(500).send({ error: 'Error al obtener los pacientes', details: err });
        } else {
            res.json(result);
        }
    });
}

// Función para manejar la solicitud de pacientes por nss

function getBynss(req, res) {
    const nss = req.query.nss; // Obtener el parámetro de la solicitud

    if (!nss) {
        return res.status(400).send({ error: 'El parámetro de nss es requerido' });
    }

    pacienteBD.metodos.getBynss(nss, (err, result) => { 
        if (err) {
            return res.status(500).send({ error: 'Error al obtener los pacientes', details: err });
        } else {
            res.json(result);
        }
    });
}

// función Crear Paciente

function crearPaciente(req, res) {
    pacienteBD.metodos.crearPaciente(req.body, (err, exito) => {
        if (err) {
            res.status(500).json(err); 
        } else {
            res.status(201).json(exito); 
        }
    });
}

// función Obtener Paciente

function obtenerPaciente(req, res) {
    let numero_historial_clinico = req.params.numero_historial_clinico;
    pacienteBD.metodos.getPaciente(numero_historial_clinico, () => {
        (err, exito) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(exito)
            }
        }
    });
}

//app.put("/:numero_historial_clinico", modificarPaciente);

function modificarPaciente(req, res) {
    datosPaciente = req.body;
    deEstePaciente = req.params.numero_historial_clinico;
    pacienteBD.metodos.update(datosPaciente, deEstePaciente, (err, exito) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(exito) //paciente modificado
        }
    });
}


function eliminarPaciente(req, res) {
    pacienteBDBD.metodos.deletePaciente(req.params.numero_historial_clinico, (err, exito) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.send(exito)
        }
    })
}

//exportamos app que es nuestro servidor express a la cual se le agregaron endpoinds de escucha
module.exports = app;