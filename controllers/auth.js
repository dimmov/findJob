const { isUser, isGuest } = require('../middleware/guards');
const { register, login } = require('../services/user');
const mapErrors = require('../util/mappers');

const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('register');
});


router.post('/register', isGuest(), async (req, res) => {

    try {
        if (req.body.password.trim().length < 5) {
            throw new Error('Password must be at least 5 char long')
        } 
	if (req.body.password != req.body.repass) {
            throw new Error('Passowrd don\'t march');
        }
        const user = await register(req.body.email, req.body.password, req.body.skills);
        req.session.user = user;

        res.redirect('/')


    } catch (err) {
        console.log(err)

        const errors = mapErrors(err)
        res.render('register', { data: { email: req.body.email, skills: req.body.skills }, errors })
    }

});


router.get('/login', isGuest(), (req, res) => {
    res.render('login');
})


router.post('/login', isGuest(), async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);

        req.session.user = user;
        res.redirect('/')

    } catch (err) {
        console.log(err)
        const errors = mapErrors(err)
        res.render('login', { data: { email: req.body.email }, errors })
    }
})

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/')
})

module.exports = router;