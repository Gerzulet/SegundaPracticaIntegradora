import { Router } from "express";
import usersDao from '../dao/UsersDao.js'
import { comparePassword } from "../utils/CryptUtil.js";
import jwt from "jsonwebtoken";
import passport from 'passport'
import passportCall from "../utils/passportCall.js";
import authorization from "../utils/autorization.js";
const router = Router();


router.get('/login', async (req,res) => {
  res.render('login')
})


router.get('/current',passportCall('jwt'),  authorization(['admin']),passport.authenticate('jwt', {session:false}),async (req,res) => {
  res.send(req.user)
})
router.get('/register', (req,res) => {
  res.render('register')
})

router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister', session:false }), async (req, res) => {
  res.send({ status: 'success', message: 'Usuario Registrado' })
})

router.get('/failregister', (req,res) => {
  console.log('Ha ocurrido un problema en el registro ')
  res.send({status:'failure', message:"Ha ocurrido un problema en la registracion"})
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  const user = await usersDao.getByEmail(email);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (!comparePassword(user, password)) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  // Sacar password
  const token = jwt.sign({ email, role:user.role }, 'coderSecret', { expiresIn: '20m' }, {withCredentials: true});
  res.cookie('coderCokieToken', token, { maxAge: 60*60*60, httpOnly: false, withCredentials:false });
  res.redirect('/session/current')
})

export default router;
