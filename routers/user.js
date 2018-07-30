/* eslint no-underscore-dangle: "off" */
const express = require('express');

const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../modals/user');
/**
 * @augments: {
 *  username: value,
 *  password: value,
 *  firstName: value,
 *  lastName: vale,
 * }
 * @returns: User
 */
userRouter.post('/register', (req, res, next) => {
  req.body.password = bcrypt.hashSync(req.body.password, 8);
  const user = new Users(req.body);
  user.save((err, doc) => {
    if (err) throw err;
    const token = jwt.sign({
      id: doc._id,
    }, process.env.HMACSECRET || 'secret', {
      expiresIn: 8640,
    });
    res.cookie('authToken', token, { expire: new Date() + 8640 })
      .json({ auth: true });
  });
});

/**
 * @argument: Access token
 * @returns: Object of user without password
 */
userRouter.get('/', (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie) {
    res.status(401).json({
      auth: false,
      message: 'Cookies not found',
    });
  }
  const token = cookie.authToken;
  jwt.verify(token, process.env.HMACSECRET || 'secret', (err, decoded) => {
    if (err) {
      res.status(401).json({
        auth: false,
        message: 'Can not verify token',
      });
    }
    Users.findById(decoded.id, {
      password: 0,
    },
    (err, result) => {
      if (err) res.status(500).send('There was problem finding a user');
      if (!result) {
        res.send(500).send('Could not find the user');
      }
      res.json(result);
    });
  });
});

/**
 * @argument: email and password
 */
userRouter.get('/login', (req, res, next) => {
  Users.findOne({
    email: req.body.email,
  }, (err, user) => {
    if (err) res.status(500).send('There was a problem fetching user');
    if (!user) {
      res.send(401).send('You have not registered');
    }
    const isPasswordValid = bcrypt.compareSync(req.body.password,
      user.password);
    if (!isPasswordValid) {
      res.status(401).send({
        auth: false,
        message: 'incorrect username or password',
      });
    } else {
      const token = jwt.sign({
        id: user._id,
      }, process.env.HMACSECRET || 'secret', {
        expiresIn: 8640,
      });
      res.cookie('authToken', token, { expire: new Date() + 8640 })
        .json({auth: true });
    }
  });
});

/**
 * @argument: _id of a User
 */
userRouter.delete('/', (req, res) => {
  const cookie = req.cookies;
  if (!cookie) {
    res.status(401).status({
      auth: false,
      message: 'Cookie not found',
    });
  }
  const token = cookie.authToken;
  jwt.verify(token, process.env.HMACSECRET || 'secret', (err, decoded) => {
    if (err) {
      res.status(401).json({
        auth: false,
        message: 'Can not verify token',
      });
    }
    Users.deleteOne({
      _id: decoded.id,
    }, (err) => {
      if (err) throw err;
    });
    res.status(200).send();
  });
});

/**
 * @argument: {op: ['update','remove'],
 *             key:"field in Users",
 *             value: "New value of above field"}
 */
userRouter.patch('/', (req, res) => {
  const cookie = req.cookies;
  if (!cookie) {
    res.status(401).status({
      auth: false,
      message: 'Cookie not found',
    });
  }
  const token = cookie.authToken;
  jwt.verify(token, process.env.HMACSECRET || 'secret', (err, decoded) => {
    if (err) {
      res.status(401).json({
        auth: false,
        message: 'Can not verify token',
      });
    }
    const { field } = req.body;
    const { value } = req.body;
    const changeObj = {};
    changeObj[field] = value;
    Users.findOneAndUpdate({
      _id: decoded.id,
    }, {
      $set: changeObj,
    }, {
      new: true,
    }, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
});

userRouter.get('/logout', (req, res, next) => {
  res.clearCookie('authToken');
  res.json({
    logout: true,
  });
});


userRouter.use((err,req,res,next) => {
  res.status(500).send(err);
});

module.exports = userRouter;
