const { isUser } = require('../middleware/guards');
const { getAllAds, getLastThreeAds, searchEmail } = require('../services/ad');
const preload = require('../middleware/preload');

const router = require('express').Router();

router.get('/', preload(), async (req, res) => {
    const lastThree = await getLastThreeAds();
    res.render('home', { lastThree })
})

router.get('/ads', async (req, res) => {
    const ads = await getAllAds();
    res.render('catalog', { title: 'All-Ads Page', ads })
})

router.get('/ads/:id', preload(true), async (req, res) => {

    const ad = res.locals.ad
    ad.freePositions = ad.applicants.length;
    ad.applicantsListEmail = ad.applicants.map(b => b.email)

    console.log(ad.applicants)

    if (req.session.user) {
        ad.hasUser = true
        ad.isOwner = req.session.user._id == ad.owner._id;

        if (ad.applicants.some(a => a._id == req.session.user._id)) {
            ad.isJoined = true;
        }
    }

    res.render('details', { title: 'Details Page', ad })
})

router.get('/search', isUser(), async (req, res) => {

    const searchResults = await searchEmail(req.query.email);

    let finalResult = []
    if (searchResults[0] != undefined) {
        console.log(searchResults[0].email)
        console.log(searchResults[0].ads)
        finalResult = searchResults[0].ads.map(r => {
            return { ...r, email: searchResults[0].email }
        })
        console.log(finalResult)
    }

    res.render('search', { title: 'Seach Ad', result: finalResult });
})

module.exports = router;