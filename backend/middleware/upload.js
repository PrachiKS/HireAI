import multer from 'multer'

// Store the file in memory as a Buffer
const storage = multer.memoryStorage()

// Create the upload middleware
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
})