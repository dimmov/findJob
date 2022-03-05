const { isUser, isGuest, isOwner } = require('../middleware/guards');
const preload = require('../middleware/preload');
const { createAd, updateAdById, deleteById, joinCompany } = require('../services/ad');
const mapErrors = require('../util/mappers');

const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Page', data: {} })
})

router.post('/create', isUser(), async (req, res) => {

    const ad = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        owner: req.session.user._id
    }

    try {
        await createAd(ad);
        res.redirect('/ads')
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Page', errors, data: ad });
    }
})

router.get('/edit/:id', preload(), isOwner(), (req, res) => {
    res.render('edit', { title: 'Edit Offer' })
})


router.post('/edit/:id', preload(), isOwner(), async (req, res) => {
    const id = req.params.id;

    const ad = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
    };



    try {
        await updateAdById(id, ad);
        res.redirect('/ads/' + id);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        ad._id = id;
        res.render('edit', { title: 'Edit Page', errors, ad })
    }
})

router.get('/delete/:id', preload(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/ads');
})

router.get('/join/:id', isUser(), async (req, res) => {
    const id = req.params.id;

    try {

        await joinCompany(id, req.session.user._id);

    } catch (err) {
        console.error(err);

    } finally {
        res.redirect('/ads/' + id);
    }
})


module.exports = router;


