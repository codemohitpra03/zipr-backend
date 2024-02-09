const {nanoid} = require('nanoid')
const URL = require('../models/url')
async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url){
        return res.status(400).json({message:"Please provide a url"})
    }
    const shortID = nanoid(8);
    console.log(body.userId);
    const url = await URL.create({
        userId:body.userId,
        shortId:shortID,
        redirectUrl:body.url,
        visitHistory:[]
    })
    console.log(url);
    return res.json({
        url
    })
}

async function handleGetAnalytics(req,res){
    const shortID = req.params.shortId
    const url = await URL.findOne({shortId:shortID})
    
    if(!url){
        return res.status(404).json({message:"URL not found"})
    }
    return res.json({totalClicks:url.visitHistory.length, analytics:url.visitHistory})
}

async function redirectURL(req,res){
    const shortId = req.params.shortId;
    const ipAddress = req.ip;
    const entry = await URL.findOneAndUpdate({shortId},{$push: {
        visitHistory: {
            timestamp: Date.now(),
            ipAddress: ipAddress
        }   
    }},{returnOriginal:false})
    console.log(entry.redirectUrl);
    res.redirect(entry.redirectUrl)
}

const handleDeleteUrl = async (req, res) => {
    try {
        const shortId = req.body.shortId;

        // Find the URL entry with the provided short ID and delete it
        const deletedUrl = await URL.findOneAndDelete({ shortId });

        console.log(deletedUrl);
        // If no URL is found for the given short ID, return appropriate response
        if (!deletedUrl) {
            return res.status(404).json({ error: 'URL not found for the provided short ID' });
        }
        // Return success response
        return res.json({ message: 'URL deleted successfully', deletedUrl });
    } catch (error) {
        // Handle any errors
        console.error('Error deleting URL:', error);
        return res.status(500).send('An error occurred while deleting URL');
    }
}


async function handleGetAllUrls(req,res){
    try {
        const userId = req.body.userId;

        // Find all URL entries associated with the provided userId
        const urls = await URL.find({ userId });

        // If no URLs are found for the given userId, return appropriate response
        if (!urls || urls.length === 0) {
            return res.json({status:404, error: 'No URLs found for the provided user ID' });
        }

        // If URLs are found, return them in the response
        return res.json(urls);
    } catch (error) {
        // Handle any errors
        console.error('Error fetching URLs:', error);
        return res.status(500).send('An error occurred while fetching URLs');
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    redirectURL,
    handleGetAllUrls,
    handleDeleteUrl
}