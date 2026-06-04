const { models } = require('../db');
const { uploadToCloudinary } = require('./cloudinaryUpload');
const { ValidationError } = require('./errors/errorTypes');

const getCloudinaryResourceType = (mimetype) => {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('image/')) return 'image';
  return 'raw';
};

async function uploadTaskFiles(roadmapTaskId, uploadedBy, files = []) {
  for (const file of files) {
    try {
      const resourceType = getCloudinaryResourceType(file.mimetype);
      const result = await uploadToCloudinary(
        file.buffer,
        `pathment/tasks/${roadmapTaskId}`,
        resourceType
      );

      await models.TaskFile.create({
        roadmapTaskId,
        uploadedBy,
        fileName: file.originalname,
        fileUrl: result.secure_url,
        fileType: file.mimetype,
        fileSizeBytes: file.size
      });
    } catch (error) {
      console.error('Error uploading task file:', error);
      throw new ValidationError(`Failed to upload file: ${file.originalname}`);
    }
  }
}

module.exports = {
  uploadTaskFiles
};