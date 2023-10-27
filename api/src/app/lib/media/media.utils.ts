import multer from 'multer';

export const uploadImage = (limitMb?: number) => {
    const storage = multer.memoryStorage();
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: (limitMb ?? 2) * 1024 * 1024
        },
        fileFilter: (_, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        }
    });

    return upload.single('image');
};
