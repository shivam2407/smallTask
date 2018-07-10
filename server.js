const express = require('express');

const app = express();

/**
 * @augments: {
 *  username: value,
 *  password: value,
 *  firstName: value,
 *  lastName: vale,
 * }
 * @returns: Boolean
 */
app.post('/user',function(req,res){

});
// start server on port 3000
app.listen(3000, function(){
    console.log('server istening on port 3000');
}); 