import express from 'express';
import asyncHandler from 'express-async-handler';

// Define errors
import errors from './../errors/index.js';

// Create express router
const router = express.Router();

// Handle 404 and 505
// The 404 Route (ALWAYS Keep this as the last route)
router.use(
  asyncHandler((req, res) => {
    // Due awesome error handler we can just throw custom 404 error object.
    // next(new Error(errorDescriptor(errors.ERROR_PAGE_NOT_FOUND)));
    throw new Error(errors.ERROR_PAGE_NOT_FOUND);
  })
);

export default router;
