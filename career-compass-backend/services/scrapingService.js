// backend/services/scrapingService.js
const puppeteer = require('puppeteer');
const User = require('../models/User');

/*
================================================================================
IMPORTANT: LinkedIn Scraping
================================================================================
LinkedIn heavily blocks scrapers. To make this work, you MUST provide
a valid, logged-in session cookie.

1. Log in to LinkedIn on your browser.
2. Open Developer Tools (F12) -> Application -> Cookies -> https://www.linkedin.com
3. Find the cookie named "li_at".
4. Copy its value.
5. Set it as an environment variable (e.g., in a .env file) named LINKEDIN_SESSION_COOKIE
================================================================================
*/
const LINKEDIN_SESSION_COOKIE = process.env.LINKEDIN_SESSION_COOKIE;

// --- GitHub Scraper ---
const scrapeGitHub = async (githubUrl) => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(githubUrl, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const username = document.querySelector('span.p-nickname.vcard-username.d-block')?.innerText;
            const bio = document.querySelector('div.p-note.user-profile-bio.mb-3.js-user-profile-bio.f4 > div')?.innerText;
            const followers = document.querySelector('a[href*="tab=followers"] span.text-bold.color-fg-default')?.innerText || '0';
            const publicRepos = document.querySelector('a[href*="tab=repositories"] span.Counter')?.innerText || '0';

            const pinnedRepos = [];
            document.querySelectorAll('div.pinned-item-list-item-content').forEach(el => {
                pinnedRepos.push({
                    title: el.querySelector('span.repo.text-bold')?.innerText,
                    description: el.querySelector('p.pinned-item-desc.color-fg-muted.text-small.d-block.mt-2.mb-3')?.innerText,
                    link: el.querySelector('a')?.href,
                });
            });

            return { username, bio, followers, publicRepos, pinnedRepos };
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error(`Error scraping GitHub: ${error.message}`);
        if (browser) await browser.close();
        throw new Error('Failed to scrape GitHub profile.');
    }
};

// --- LinkedIn Scraper (Proof of Concept) ---
const scrapeLinkedIn = async (linkedinUrl) => {
    if (!LINKEDIN_SESSION_COOKIE) {
        console.warn('LINKEDIN_SESSION_COOKIE not set. Skipping LinkedIn scrape.');
        return {
            profileUrl: linkedinUrl,
            headline: 'LinkedIn scraping disabled: Session cookie not provided.',
            summary: 'Please set the LINKEDIN_SESSION_COOKIE environment variable on the server to enable this feature.',
            experience: [],
        };
    }

    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        
        // Set the session cookie
        await page.setCookie({
            name: 'li_at',
            value: LINKEDIN_SESSION_COOKIE,
            domain: '.linkedin.com',
            secure: true,
            httpOnly: true,
        });

        await page.goto(linkedinUrl, { waitUntil: 'networkidle2' });

        // Wait for a key element to ensure the page is loaded
        await page.waitForSelector('h1', { timeout: 10000 });

        const data = await page.evaluate(() => {
            const headline = document.querySelector('div.pv-text-details__left-panel > span.text-body-medium.break-words')?.innerText;
            const summary = document.querySelector('section[data-field="summary"] div.display-flex.ph5.pv3 > div > div > span[aria-hidden="true"]')?.innerText;
            
            // This selector is complex and changes often
            const experience = [];
            // Example selector - THIS WILL LIKELY BE OUTDATED
            document.querySelectorAll('section[data-field="experience"] li.artdeco-list__item').forEach(el => {
                const title = el.querySelector('span[aria-hidden="true"]')?.innerText;
                const company = el.querySelector('span.t-14.t-normal')?.innerText;
                const duration = el.querySelector('span.t-14.t-normal.t-black--light > span[aria-hidden="true"]')?.innerText;
                if (title && company) {
                    experience.push({ title, company, duration });
                }
            });

            return { headline, summary, experience: experience.slice(0, 3) }; // Get top 3
        });

        await browser.close();
        return { ...data, profileUrl: linkedinUrl };
    } catch (error) {
        console.error(`Error scraping LinkedIn: ${error.message}`);
        if (browser) await browser.close();
        throw new Error('Failed to scrape LinkedIn profile. The site structure may have changed or your session cookie is invalid.');
    }
};

// --- Main Service Function ---
// This runs in the background and updates the DB when done
exports.scrapeAndSave = async (userId, githubUrl, linkedinUrl) => {
    let githubData = null;
    let linkedinData = null;
    let errorMessages = [];

    // Scrape GitHub
    if (githubUrl) {
        try {
            githubData = await scrapeGitHub(githubUrl);
        } catch (error) {
            errorMessages.push(error.message);
        }
    }

    // Scrape LinkedIn
    if (linkedinUrl) {
        try {
            linkedinData = await scrapeLinkedIn(linkedinUrl);
        } catch (error) {
            errorMessages.push(error.message);
        }
    }

    // Update the User model in MongoDB
    try {
        const user = await User.findById(userId);
        if (!user) return;

        user.reportCard = {
            github: githubData ? { ...githubData, lastGenerated: new Date() } : user.reportCard.github,
            linkedin: linkedinData ? { ...linkedinData, lastGenerated: new Date() } : user.reportCard.linkedin,
            status: errorMessages.length > 0 ? 'failed' : 'completed',
            lastError: errorMessages.join('; '),
        };

        await user.save();
        console.log(`Report card generation complete for user ${userId}.`);

    } catch (dbError) {
        console.error(`DB Error saving report card: ${dbError.message}`);
    }
};