import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  emails: [String],
  title: { type: String },
  description: { type: String }
});

const ExtractUrl = mongoose.models.ExtractUrl || mongoose.model('ExtractUrl', urlSchema);

export default ExtractUrl;
