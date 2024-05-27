export const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    console.log('Register request received:', req.body);
    if (!email || !name || !password) {
        console.log('Form submission is incorrect:', req.body);
        return res.status(400).json('incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            console.log('Login email:', loginEmail);
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    console.log('User registered:', user);
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.error('Registration error:', err);
        res.status(400).json('unable to register');
    });
};
