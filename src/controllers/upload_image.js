const Datauri = require('datauri');
const path = require('path');
const dUri = new Datauri;
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
const cloudinary = require('cloudinary');

exports.uploadImages = function (req, res){

	if(req.file) {
		const file = dataUri(req).content;
		return cloudinary.uploader.upload(file).then((result) => {
			const image = result.url;
			return res.status(200).json({
				messge: 'Your image has been uploded successfully to cloudinary',
				data: {image}
			})
        })
        .catch((err) => res.status(400).json({
			message: 'someting went wrong while processing your request',
			data: {err}
		}))
	}
	// res.send({file: req.file})
}