const express = require('express');
const app = express();
const PORT = 3000;


// Mock Database: mapping IDs to real websites
const adDatabase = {
    "1519-7970": "https://www.zenithummedia.com",
    
};

app.get('/banners/:bannerId.html', (req, res) => {
    const id = req.params.bannerId;
    const targetUrl = adDatabase[id];

    if (targetUrl) {
        console.log(`Log: User clicked ID ${id}. Redirecting to ${targetUrl}`);
        
        // HTTP 302 is a "Found/Temporary" redirect
        res.redirect(targetUrl); 
    } else {
        // If the ID doesn't exist in our "database"
        res.status(404).send('<h1>Error: Ad Campaign Not Found</h1>');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});