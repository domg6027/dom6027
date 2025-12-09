// news.js
const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');

// Node-fetch v3 compatibility wrapper for CommonJS:
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const parser = new Parser();

// --- CONFIG ---
const GITHUB_TOKEN = process.env.NewsWarningsBot; // Use secret from environment
if (!GITHUB_TOKEN) {
  console.error('Error: GitHub token not found in environment variable NewsWarningsBot.');
  process.exit(1);
}

const REPO_OWNER = 'domg6027';
const REPO_NAME = 'dom6027';
const DISCUSSION_NUMBER = 5;

const newsFile = path.join(__dirname, 'news.json');
let newsData = JSON.parse(fs.readFileSync(newsFile, 'utf8'));
const lastPosted = new Date(newsData.last_posted.gregorian);

// --- HELPER: Fetch RSS Feed ---
async function fetchFeed(feed) {
  try {
    const feedData = await parser.parseURL(feed.url);
    let newItems = [];

    feedData.items.forEach(item => {
      const itemDate = item.pubDate ? new Date(item.pubDate) : new Date();
      if (itemDate > lastPosted) {
        newItems.push({
          title: item.title,
          link: item.link,
          date: item.pubDate,
          source: feed.name
        });
      }
    });

    return newItems;
  } catch (err) {
    console.error(`Error fetching ${feed.name}:`, err.message || err);
    return [];
  }
}

// --- HELPER: Post to GitHub Discussion ---
async function postToGitHub(post) {
  const body = `**[${post.source}] ${post.title}**\n\n${post.link}\n\n*Published: ${post.date}*`;
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/discussions/${DISCUSSION_NUMBER}/comments`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json'
    },
    body: JSON.stringify({ body })
  });

  if (!response.ok) {
    console.error(`Failed to post: ${response.status} ${response.statusText}`);
  } else {
    console.log(`Posted to GitHub Discussion: ${post.title}`);
  }
}

// --- MAIN FUNCTION ---
async function run() {
  let allNewPosts = [];

  for (const feed of newsData.sources) {
    if (feed.type === 'rss') {
      const newItems = await fetchFeed(feed);
      allNewPosts.push(...newItems);
    }
  }

  if (allNewPosts.length === 0) {
    console.log('No new posts found.');
    return;
  }

  // Sort by date ascending
  allNewPosts.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Post each new item to GitHub
  for (const post of allNewPosts) {
    await postToGitHub(post);
  }

  // Update last_posted timestamp
  newsData.last_posted.gregorian = new Date().toISOString();
  fs.writeFileSync(newsFile, JSON.stringify(newsData, null, 2));

  console.log('news.json updated with new last_posted timestamp.');
}

// --- RUN SCRIPT ---
run();
