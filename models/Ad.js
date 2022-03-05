const { Schema, model, Types: { ObjectId } } = require('mongoose');




const adSchema = new Schema({
    headline: { type: String, required: true, minlength: [4, 'The Headline should be a minimum of 4 characters long'] },
    location: { type: String, required: true, minlength: [8, 'The Location should be a minimum of 8 characters long'] },
    companyName: { type: String, required: true, minlength: [3, 'The Compnay Name should be a minimum of 8 characters long'] },
    companyDescription: { type: String, required: true, maxlength: [40, 'The Compnay Description should be a maximum of 40 characters long'] },
    owner: { type: ObjectId, ref: 'User', required: true },
    applicants: { type: [ObjectId], ref: 'User', default: [] },
}, {timestamps: true});

adSchema.methods.numberApplicants = function () {
    return this.applicants.length;
}

const Ad = model('Ad', adSchema);

module.exports = Ad;