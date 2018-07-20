const express = require('express');
const userRouter = express.Router();
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
userRouter.post('/',function(req,res){
    const user = new Users(req.body);
    user.save(function(err,doc){
        if (err) throw err;
        res.json(doc);
    })
})

/**
 * @returns: Array of all USERS.
 */
userRouter.get('/',function(req,res){
    Users.find({},function(err,users) {
        if (err) throw err;
        res.json(users);
    });
})

/**
 * @augments: _id of User
 * @returns: User with specific id
 */
userRouter.get('/:id', function(req,res) {
    Users.findOne({
        _id: req.params.id
    }, function(err,result) {
            if (err) throw err;
            res.json(result);
        });
});

/**
 * @argument: _id of a User
 */
userRouter.delete('/:id', function(req,res) {
    Users.deleteOne({
        _id: req.params.id,
    });
    res.status(200).send();
});
module.exports = userRouter;