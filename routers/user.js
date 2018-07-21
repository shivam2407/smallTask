const express = require('express');
const userRouter = express.Router();
const Users = require('../modals/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
/**
 * @augments: {
 *  username: value,
 *  password: value,
 *  firstName: value,
 *  lastName: vale,
 * }
 * @returns: User
 */
userRouter.post('/register',function(req,res, next){
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    const user = new Users(req.body);
    user.save(function(err,doc){
        if (err) next(err);
        const token = jwt.sign({id: doc._id}, process.env.HMACSECRET,{
            expiresIn: 8640
        }); 
        res.json({auth: true, token});
    });
})

/**
 * @argument: Access token
 * @returns: Object of user without password
 */
userRouter.get('/',function(req,res, next){
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({auth: false, message: 'Token not provided'});
    }

    jwt.verify(token, process.env.HMACSECRET, function(err, decoded) {
        if (err) res.status(401).json({auth: false, message:'Can not verify token'});
        Users.findById(decoded.id,
            {password: 0},
            function(err, result) {
            if (err) res.status(500).send('There was problem finding a user');
            if (!result) {
                res.send(500).send("Could not find the user");
            }
            res.json(result);
        })
    })
})

/**
 * @argument: email and password
 */
userRouter.get('/login', function(req,res,next) {
    Users.findOne({email: req.body.email},function(err,user) {
        if (err) res.status(500).send("There was a problem fetching user");
        if (!user) {
            res.send(401).send('You have not registered');
        }
        const isPasswordValid = bcrypt.compareSync(req.body.password,
        user.password);
        if (!isPasswordValid) {
            res.status(401).json({auth: false, token:null});
        }
        const token = jwt.sign({ id: user._id }, process.env.HMACSECRET, {
            expiresIn: 8640 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    })
})

/**
 * @argument: _id of a User
 */
userRouter.delete('/:id', function(req,res) {
    Users.deleteOne({
        _id: req.params.id,
    }, function(err) {
        if (err) throw err;
    });
    res.status(200).send();
});

/**
 * @argument: {op: ['update','remove'],
 *             key:"field in Users",
 *             value: "New value of above field"}
 */
userRouter.patch('/:id', function(req,res) {
    const field = req.body.field;
    const value = req.body.value;
    const changeObj = {}
    changeObj[field] = value;
    Users.findOneAndUpdate({
        _id: req.params.id}, {
            $set : changeObj
        },{new: true}, function(err, result) {
            if (err) throw err;
            res.json(result);
        });
});

module.exports = userRouter;