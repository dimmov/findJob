const Ad = require('../models/Ad');
const User = require('../models/User');

async function getAllAds() {
    return Ad.find({}).lean();
}

async function getLastThreeAds() {
    return Ad.find({}).sort({ createdAt: -1 }).limit(3).lean();
}

async function createAd(ad) {
    const result = new Ad(ad);
    await result.save();

    const user = await User.findById(result.owner);
    user.ads.push(result._id);
    await user.save();
}

async function getAdById(id) {
    return Ad.findById(id).lean();
}

async function getAdAndApplicants(id) {
    return Ad.findById(id).populate('owner').populate('applicants', 'email skills').lean();
}

async function updateAdById(id, ad) {

    const existing = await Ad.findById(id);

    console.log(existing)

    existing.headline = ad.headline;
    existing.location = ad.location;
    existing.companyName = ad.companyName;
    existing.companyDescription = ad.companyDescription;

    await existing.save()
}
async function deleteById(id) {
    return Ad.findByIdAndDelete(id);
}


async function joinCompany(adId, userId) {
    const ad = await Ad.findById(adId);
    // console.log(ad)
    if (ad.applicants.includes(userId)) {
        throw new Error('User is already applied for the job')
    };

    ad.applicants.push(userId);
    ad.save();
}

async function searchEmail(searchEmail) {
    // return User.find({}).where({'owner.email': 'peter@abv.bg'}).lean()
    // return User.find({ email: searchEmail }).populate('ads', 'headline companyName').lean()
    return User.find({ email: { $regex: new RegExp(`^${searchEmail}$`, 'i') } }).populate('email').populate('ads', 'headline companyName').lean()
}

module.exports = {
    getAllAds,
    createAd,
    getAdById,
    getAdAndApplicants,
    deleteById,
    updateAdById,
    joinCompany,
    getLastThreeAds,
    searchEmail
};
