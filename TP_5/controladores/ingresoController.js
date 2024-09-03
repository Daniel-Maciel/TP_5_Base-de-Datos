//--- requires ------------------------------------------
const express = require('express');

const router = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());
//app.use(bodyParser.json());

const ingresoBD = require("./../modelos/ingresoModel.js");
// -------------------------------------------------------- 
// --rutas de escucha (endpoint) dispoibles para Ingreso --- 
// --------------------------------------------------------

app.get('/ingreso', listarTodo);
//app.get('/ingreso', getBynss);
app.post('/ingreso', crearingreso);
app.get('/:ingreso', obtenerIngreso);
//app.delete("/:ingreso", eliminarIngreso);
//app.put("/:ingreso", modificarIngreso);


// función Crear Ingreso Nuevo

function crearingreso(req, res) {
    ingresoBD.metodos.crearingreso(req.body, (err, exito) => {
        if (err) {
            res.status(500).json(err); 
        } else {
            res.status(201).json(exito); 
        }
    });
}

// función listar Todo los ingresos

function listarTodo(req, res) {
    metodos.getAll((err, result) => {
        if (err) {
            res.status(500).send({ error: 'Error al obtener los ingresos', details: err });
        } else {
            res.json(result);
        }
    });
}

// función Obtener los Ingresos

function obtenerIngreso(req, res) {
    let numero_historial_paciente = req.params.numero_historial_paciente;
    ingresoBD.metodos.getIngreso(numero_historial_paciente, () => {
        (err, exito) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(exito)
            }
        }
    });
}


module.exports = app;