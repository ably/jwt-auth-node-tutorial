const jwt = require("jsonwebtoken")
require('dotenv').config()

const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
const ttlSeconds = 3600

const jwtPayload = {
    'x-ably-capability': JSON.stringify({ '*': ['publish', 'subscribe'] }),
    'x-ably-clientId': 'OPTIONAL_CLIENT_ID'
}

const jwtOptions = {
    expiresIn: ttlSeconds,
    keyid: `${apiKey}`
}

const express = require('express'),
    app = express();
app.use('/', express.static(__dirname))

app.get('/auth', (req, res) => {
    console.log('Sucessfully connected to the server auth endpoint')
    jwt.sign(jwtPayload, apiSecret, jwtOptions, (err, tokenId) => {
        console.log('JSON Web Token signed by auth server')
        if (err) {
            console.trace()
            return
        }
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
        res.setHeader('Content-Type', 'application/json')
        console.log('Sending signed JWT token back to client')
        res.send(JSON.stringify(tokenId));
    })
})

app.listen(3000, () => {
    console.log('Web server listening on port 3000');
});

