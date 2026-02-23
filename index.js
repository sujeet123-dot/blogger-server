const express = require('express');
const app = express();
const PORT = 3000;


// Mock Database: mapping IDs to real websites
const adDatabase = {
    "1519-7970": "https://www.zenithummedia.com",
    
};

app.get('/banners/:bannerId.html', (req, res) => {
    const id = req.params.bannerId;
    const targetUrl = adDatabase[id]; // your DB lookup
    const GA_ID = "G-SNCY0K36MC";

    if (targetUrl) {
        console.log(`Log: User clicked ID ${id}. Redirecting to ${targetUrl}`);

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Loading...</title>
            <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                // Crypto random engagement time
                function getCryptoRandom(min, max) {
                    const array = new Uint32Array(1);
                    window.crypto.getRandomValues(array);
                    return Math.floor((array[0] / (0xffffffff + 1)) * (max - min + 1) + min);
                }

                gtag('config', '${GA_ID}', {
                    'send_page_view': false,
                    'page_location': "Organicgoogle",
                    'page_title': 'banner-${id}',
                    'page_referrer': ''
                });

                function trackAndRedirect() {
                    // Fire multiple page_view events
                    for (let i = 0; i < 3; i++) {
                        gtag('event', 'page_view', {
                            'page_location': "Organicgoogle",
                            'page_title': 'banner-${id}',
                            'page_referrer': '',
                            'engagement_time_msec': getCryptoRandom(65000, 70000),
                            'session_engaged': 1,
                            'campaign_source': 'google',
                            'campaign_medium': 'medium',
                            'campaign_name': 'BANNER_${id}'
                        });
                    }

                    // Scroll event (activity simulation)
                    setTimeout(() => {
                        gtag('event', 'scroll', {
                            'page_location': "Organicgoogle",
                            'percent_scrolled': 90,
                            'engagement_time_msec': 1000
                        });
                    }, 400);

                    // Redirect after buffer time
                    setTimeout(() => {
                        window.location.replace("${targetUrl}");
                    }, 700);
                }

                window.onload = trackAndRedirect;
            </script>
            <style>
                body {
                    font-family: sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: #f9f9f9;
                }
                .loader {
                    text-align: center;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="loader">
                <p>Redirecting...</p>
            </div>
        </body>
        </html>
        `;

        res.setHeader("Content-Type", "text/html");
        res.setHeader("Referrer-Policy", "no-referrer");
        return res.send(html);

    } else {
        // If banner ID not found
        res.status(404).send('<h1>Error: Ad Campaign Not Found</h1>');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});