import multer from "multer";
import path from "path";
// create a constant to access the directory path of the temp folder
// the temp folder will hold the images that are uploaded but not yet setnt to the server for datavse persistence
const tempPath = path.join("tmp");

// create a multer config to set the desitnation and file name of the files being uploaded
// ccepts two parameters: first is the destination of the file uploaded
// second is the filename creator function which accpts 3 parameters (req, file, cb)
const multerConfig = multer.diskStorage({
    destination: tempPath,

    filename: (_req, file, cb) => {
        // this refers to the file naming convention
        //multer package gives us an access to this call back function for the filename creator function
        // takes two parameters: first is the error which is se to null by default
        // second is the desired filename for the uploaded file
        cb(null, file.originalname);
    }
})

// declare or create the actual middleware function
const upload = multer({
    storage: multerConfig,
});

export { upload };