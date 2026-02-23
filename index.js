const express = require("express");
const app = express();
const PORT = 3000;

// Mock Database: mapping IDs to real websites
const adDatabase = {
  "1519-7970": "https://www.zenithummedia.com/case-studies?utm_source=google&utm_medium=medium&utm_campaign=SUJEETBEACON&utm_id=Visit_frame",
  "KOLpoiu": "https://www.cric4genz.in/?utm_source=google&utm_medium=medium&utm_campaign=ZM_USER_25JAN&utm_id=Visit_frame"
};


app.get("/banners/:bannerId.html", (req, res) => {
  const id = req.params.bannerId;
  const targetUrl = adDatabase[id]; // your DB lookup
  const GA_ID = "G-SNCY0K36MC";
  const destination = "https://www.zenithummedia.com/case-studies?utm_source=google&utm_medium=medium&utm_campaign=SUJEETBEACON&utm_id=Visit_frame";

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

          function getSecureEngagementTime(min, max) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return Math.floor((array[0] / (0xffffffff + 1)) * (max - min + 1) + min);
          }

          gtag('config', '${GA_ID}', {
            'send_page_view': false,
            'page_location': "${destination}",
            'page_title': 'case-studies',
            'page_referrer': '',
            'transport_type': 'beacon'
          });

          const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

          async function trackAndRedirect() {
            // GENUINE BEHAVIOR LOGIC: 80% Engaged, 20% Bounce
            const randomRoll = Math.random() * 100;
            const isEngagedUser = randomRoll <= 80;

            if (isEngagedUser) {
              // High Engagement Path (80% of users)
              for (let i = 0; i < 3; i++) {
                gtag('event', 'page_view', {
                  'page_location': "${destination}",
                  'page_title': 'case-studies',
                  'engagement_time_msec': getSecureEngagementTime(55000, 62100),
                  'session_engaged': 1,
                  '_p': (Date.now() + i)
                });
                await delay(400); 
              }

              gtag('event', 'scroll', {
                'page_location': "${destination}",
                'percent_scrolled': 90,
                'engagement_time_msec': 1200,
                'transport_type': 'beacon'
              });

              setTimeout(() => {
                window.location.replace("${destination}");
              }, 800);

            } else {
              // Bounce Path (20% of users)
              gtag('event', 'page_view', {
                'page_location': "${destination}",
                'page_title': 'case-studies',
                'transport_type': 'beacon'
              });

              // Instant redirect results in 0 duration and no engagement flag
              window.location.replace("${destination}");
            }
          }

          window.onload = trackAndRedirect;
        </script>
      </head>
      <body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; font-family:sans-serif;">
        <div style="text-align:center;">
          <p>Generating link........</p>
        </div>
      </body>
      </html>
      `;

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Referrer-Policy", "no-referrer");
    return res.send(html);
  } else {
    // If banner ID not found
    res.status(404).send("<h1>Error: Ad Campaign Not Found</h1>");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});