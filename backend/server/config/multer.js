import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

import path from 'path';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chatapp/profile',
        public_id: (req, file) => path.parse(file.originalname).name + '-' + Date.now(),
    },
});

const storage2 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chatapp/group',
        public_id: (req, file) => path.parse(file.originalname).name + '-' + Date.now(),
    },
});

export const uploadAvatar = multer({storage});
export const uploadGroupPict = multer({storage: storage2});