const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var data = {
  id: 4
}

var hash = SHA256(JSON.stringify(data) + 'my secret').toString();

var token = {
  data,
  hash
}

if (SHA256(JSON.stringify(token.data) + 'my secret').toString() === token.hash) {
  console.log('You are authorized');
} else {
  console.log('Data is manipulated');
}


var jwtToken = jwt.sign(data, 'mysecret1234');
var decoded = jwt.verify(jwtToken, 'mysecret1234');

console.log(decoded);



var password = 'abc123!';

var genHash = new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    console.log('salt:', salt);
    bcrypt.hash(password, salt, (err, hash) => {
      console.log('hash:', hash);
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
});

genHash.then((hashedPassword) => {
  bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
  });

});
