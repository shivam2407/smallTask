const express = require('express');
const userRouter = express.Router();

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
    res.send({_id: 1});
})

/**
 * @returns: Array of all USERS.
 */
userRouter.get('/',function(req,res){
    res.json([]);
})

module.exports = userRouter;