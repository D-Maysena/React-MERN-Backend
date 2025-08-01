// Event routes
// api/events

const { check } = require("express-validator");
const {
  getEventos,
  crearEvento,
  eliminarEvento,
  actualizarEvento,
} = require("../controllers/events");
const { validarJWT } = require("../middlewares/validar-jwt");
const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");
const router = Router();

// Todas las rutas pasan por validarToken, sin la necesidad de pasarla c/u
router.use(validarJWT);

// Obtener eventos
router.get("/", getEventos);
//Crear evento
router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    ,
    validarCampos,
  ],
  crearEvento
);

//Actualizar evento
router.put("/:id", actualizarEvento);

//Actualizar evento
router.delete("/:id", eliminarEvento);

module.exports = router;
