const express = require('express');
const {handleGenerateNewShortURL,handleGetAnalytics, handleGetAllUrls,handleDeleteUrl} = require('../controllers/url')
const router = express.Router();

router.post('/', handleGenerateNewShortURL)
router.post('/all', handleGetAllUrls)
router.post('/delete', handleDeleteUrl)

router.get('/analytics/:shortId',handleGetAnalytics) 

module.exports = router;