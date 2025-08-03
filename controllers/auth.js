const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcript = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      res.status(400).json({
        ok: false,
        msg: "Un usuario ya existe con ese correo",
      });
    }

    usuario = new Usuario(req.body);

    // Encriptar
    const salt = bcript.genSaltSync();
    usuario.password = bcript.hashSync(password, salt);

    await usuario.save();
    // JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el admin",
    });
  }
};

const LoginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    // Confirmar las contraseñas
    const validPassword = bcript.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el admin",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const uid = req.uid
  const name = req.name

    const token = await generarJWT(uid,name);


  res.json({
    ok: true,
    uid,name,
    token
  });
};

module.exports = {
  crearUsuario,
  LoginUsuario,
  revalidarToken,
};
