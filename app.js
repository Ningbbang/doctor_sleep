const path = require('path');
const express = require('express');
const app = express();
const nedb = require('nedb');
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const userDB = new nedb({
    filename : 'user.db',
    autoload : true
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const hashPassword = (password) => Buffer.from(password).toString('base64');

app.post('/signup', (req, res) => {
    const { id, password } = req.body;
    console.log('password :', password);

    if (!id || !password) {
        return res.status(400).send('ID and Password are required.')
    }
    userDB.findOne({id}, (err, user) => {
        if (user) {
            return res.status(400).send('ID already exists.')
        }

        const hashedPassword = hashPassword(password);
        userDB.insert({id: id, password: hashedPassword}, (err, newUser) => {
            if (err) {
                return res.status(400).send('Error creating user.')
            }
            res.status(201).send('User Registered Successfully.')
        })
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});