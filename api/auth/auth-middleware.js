const Users = require('../users/users-model');

function restricted(req, res, next) {
  if (req?.session?.user) {
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
}

function checkUsernameFree(req, res, next) {
  const { username } = req.body;

  Users.findBy({username}).first()
    .then((user) => {
      if (user) {
        res.status(422).json({ message: "Username taken" })
      } else {
        next();
      }
    })

}

function checkUsernameExists(req, res, next) {
  const { username } = req.body;

  Users.findBy({username}).first()
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'Invalid credentials'})
      }
    })
}

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length <= 3) {
    res.status(422).json({message: "Password must be longer than 3 chars" })
  } else {
    next();
  }
}


module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}