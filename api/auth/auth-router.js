const router = require('express').Router();
const Users = require('../users/users-model');
const mw = require('./auth-middleware');
const bcrypt = require('bcryptjs');

router.post('/register', mw.checkUsernameFree, mw.checkPasswordLength, (req, res, next) => {  
  const newUser = req.body;

  const hash = bcrypt.hashSync(newUser.password, 8);
  newUser.password = hash;

  Users.add(newUser)
    .then((createdUser) => res.status(201).json(createdUser))
    .catch(next);

})


router.post('/login', mw.checkUsernameExists, (req, res, next) => {
  const creds = req.body
  const storedUser = req.user;

	if (req.user && bcrypt.compareSync(creds.password, storedUser.password)) {
		res.status(200).json({ message: `Welcome ${storedUser.username}!` });
	} else {
		res.status(401).json({ message: 'Invalid credentials' });
	}

});

router.get('/logout', (req, res, next) => {
  
});
/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

module.exports = router;