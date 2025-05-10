const uploadImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    res.json({ imageUrl: req.file.path }); // Return Cloudinary image URL
  };
  
  module.exports = { uploadImage };
  