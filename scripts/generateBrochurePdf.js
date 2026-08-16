import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '../public/Equity_Arena_Official_Brochure.pdf');
const publicDir = path.join(__dirname, '../public');

// Image paths
const imgSpidermanHanging = path.join(publicDir, 'images/spiderman_hanging.png');
const imgSpidermanSide = path.join(publicDir, 'images/spiderman_side.png');
const imgPixelHead = path.join(publicDir, 'images/spidey_pixel_head_icon.png');
const imgPixelSpider = path.join(publicDir, 'images/spidey_pixel_spider_icon.png');
const imgBanner = path.join(publicDir, 'images/spidey_tracker_banner.png');

if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

// Initialize PDF Document (A4 format)
const doc = new PDFDocument({
  size: 'A4',
  margin: 0,
  info: {
    Title: 'Equity Arena — Official Game Brochure & Rulebook',
    Author: 'IGNITE 8.0 Team',
    Subject: 'How to Play Equity Arena Stock Market Simulation',
    Keywords: 'Equity Arena, Ignite 8.0, Stock Market, Rules, Neo-Brutalism'
  }
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const W = 595.28;
const H = 841.89;

// Page 1 — Neo-Brutalist White Mode Brochure
drawPage1();

// Page 2 — Neo-Brutalist White Mode Brochure
doc.addPage({ size: 'A4', margin: 0 });
drawPage2();

doc.end();

stream.on('finish', () => {
  console.log(`Neo-Brutalist White Mode Brochure PDF generated successfully at ${outputPath}`);
});

/** Helper: Draw a Neo-Brutalist Card with Hard Solid Offset Shadow */
function drawNeoCard(x, y, w, h, bg = '#ffffff', shadowColor = '#000000', borderRadius = 8, borderWidth = 3) {
  // Hard Offset Shadow Box
  doc.roundedRect(x + 5, y + 5, w, h, borderRadius).fill(shadowColor);
  // Main Card Body
  doc.roundedRect(x, y, w, h, borderRadius).fill(bg);
  // Thick Solid Outer Border
  doc.roundedRect(x, y, w, h, borderRadius).lineWidth(borderWidth).stroke('#000000');
}

/** Helper: Draw a Neo-Brutalist Badge Button */
function drawNeoBadge(x, y, w, h, text, bg = '#ffd200', textColor = '#000000', shadowColor = '#000000', fontSize = 8.5) {
  doc.roundedRect(x + 2, y + 2, w, h, 4).fill(shadowColor);
  doc.roundedRect(x, y, w, h, 4).fill(bg);
  doc.roundedRect(x, y, w, h, 4).lineWidth(2).stroke('#000000');
  doc.fillColor(textColor).fontSize(fontSize).font('Helvetica-Bold').text(text, x, y + (h - fontSize) / 2 - 0.5, { width: w, align: 'center' });
}

function drawPage1() {
  // Pure White Neo-Brutalist Background
  doc.rect(0, 0, W, H).fill('#ffffff');

  // Top Neo Hazard Bar (High-Contrast Color Stripes)
  const stripeW = W / 5;
  doc.rect(0, 0, stripeW, 8).fill('#ff0055');
  doc.rect(stripeW, 0, stripeW, 8).fill('#ffd200');
  doc.rect(stripeW * 2, 0, stripeW, 8).fill('#00f3ff');
  doc.rect(stripeW * 3, 0, stripeW, 8).fill('#10b981');
  doc.rect(stripeW * 4, 0, stripeW, 8).fill('#000000');

  // Header Banner Card Box
  drawNeoCard(30, 22, W - 60, 126, '#f8fafc', '#ff0055', 10, 3.5);

  // Embed Spider-Man Character Image hanging in Header
  if (fs.existsSync(imgSpidermanHanging)) {
    doc.image(imgSpidermanHanging, W - 145, 10, { width: 125 });
  }

  // Header Badge
  drawNeoBadge(46, 36, 175, 22, 'IGNITE 8.0 • OFFICIAL GAME GUIDE', '#ffd200', '#000000', '#000000', 8.5);

  // Main Neo Title
  doc.fillColor('#000000').fontSize(28).font('Helvetica-Bold').text('EQUITY', 46, 68, { continued: true });
  doc.fillColor('#ff0055').text(' ARENA');

  doc.fillColor('#00f3ff').fontSize(11).font('Helvetica-Bold');
  doc.rect(46, 100, 220, 18).fill('#000000');
  doc.fillColor('#00f3ff').fontSize(9.5).font('Helvetica-Bold').text('HOW TO PLAY & OFFICIAL RULEBOOK', 52, 104);

  doc.fillColor('#000000').fontSize(8.5).font('Helvetica-Bold').text('SVKM\'s Shri Bhagubhai Mafatlal Polytechnic • Vile Parle (West), Mumbai', 46, 126);

  // Section Title: 8 STEPS TO DOMINATE THE ARENA
  drawNeoBadge(30, 164, 270, 26, '⚡ 8 STEPS TO DOMINATE THE ARENA', '#ff0055', '#ffffff', '#000000', 10.5);

  // Steps 1 to 4 on Page 1
  const stepsPage1 = [
    {
      num: '01',
      title: 'REGISTER & GET 20,000 IC',
      color: '#ff0055',
      shadow: '#000000',
      badge: 'WELCOME BONUS',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      body: 'Create your account and receive 20,000 free Ignite Points (IC) to start the game. Your IC balance is your trading capital.'
    },
    {
      num: '02',
      title: 'START THE 3-HOUR GAME',
      color: '#0284c7',
      shadow: '#000000',
      badge: 'LIVE ARENA',
      badgeBg: '#00f3ff',
      badgeText: '#000000',
      body: 'The game runs for exactly 3 hours live. During the game, the market prices of the 15 available stocks keep changing in real-time.'
    },
    {
      num: '03',
      title: 'CHECK THE STOCKS',
      color: '#d97706',
      shadow: '#000000',
      badge: 'TELEMETRY & GRAPHS',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      body: 'Explore the 15 available stocks and check their live price, trend graph, sector telemetry, and order details before making your move.'
    },
    {
      num: '04',
      title: 'FOLLOW THE MARKET NEWS',
      color: '#059669',
      shadow: '#000000',
      badge: 'MARKET EVENTS',
      badgeBg: '#10b981',
      badgeText: '#ffffff',
      body: 'New breaking market news will appear during the game. The news can affect stock prices, so read the news and make your decisions carefully.'
    }
  ];

  let startY = 206;
  stepsPage1.forEach((step, idx) => {
    const cardY = startY + idx * 138;

    // Neo Card Body
    drawNeoCard(30, cardY, W - 60, 124, '#ffffff', step.num === '01' ? '#ff0055' : '#000000', 8, 3);

    // Color Left Accent Stripe
    doc.rect(30, cardY, 8, 124).fill(step.color);

    // Number Badge Box
    drawNeoBadge(48, cardY + 14, 38, 28, step.num, step.color, '#ffffff', '#000000', 14);

    // Step Title
    doc.fillColor('#000000').fontSize(13.5).font('Helvetica-Bold').text(step.title, 96, cardY + 18);

    // Badge Right
    drawNeoBadge(W - 170, cardY + 14, 125, 22, step.badge, step.badgeBg, step.badgeText, '#000000', 8);

    // Step Description Body
    doc.fillColor('#0f172a').fontSize(9.5).font('Helvetica-Bold').text(step.body, 96, cardY + 48, { width: W - 180, lineGap: 3.5 });

    // Character Pixel Graphics
    if (idx === 0 && fs.existsSync(imgPixelHead)) {
      doc.image(imgPixelHead, W - 72, cardY + 72, { width: 32 });
    } else if (idx === 2 && fs.existsSync(imgPixelSpider)) {
      doc.image(imgPixelSpider, W - 72, cardY + 72, { width: 32 });
    }
  });

  // Footer Page 1
  drawFooter(1);
}

function drawPage2() {
  // Pure White Neo-Brutalist Background
  doc.rect(0, 0, W, H).fill('#ffffff');

  // Top Light Mini Header Card Box
  drawNeoCard(30, 16, W - 60, 62, '#f8fafc', '#00f3ff', 8, 3);

  // Embed Spider-Man Side Character Image in Header
  if (fs.existsSync(imgSpidermanSide)) {
    doc.image(imgSpidermanSide, W - 110, 6, { width: 85 });
  }

  doc.fillColor('#000000').fontSize(17).font('Helvetica-Bold').text('EQUITY', 46, 26, { continued: true });
  doc.fillColor('#ff0055').text(' ARENA');

  doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold').text('OFFICIAL GAMEPLAY RULES & STRATEGY • PAGE 2 OF 2', 46, 50);

  // Steps 5 to 8 on Page 2
  const stepsPage2 = [
    {
      num: '05',
      title: 'BUY & SELL SHARES',
      color: '#0284c7',
      bg: '#ffffff',
      shadow: '#000000',
      badge: 'TRADING DESK',
      badgeBg: '#00f3ff',
      badgeText: '#000000',
      body: 'Use your Ignite Points to buy and sell shares.\nYou can:\n• Buy/Sell at Market Price — trade at the current stock price.\n• Place a Limit Order — set the price at which you want to buy or sell. The order will be completed when the stock reaches your chosen price.'
    },
    {
      num: '06',
      title: 'MANAGE YOUR IC',
      color: '#7c3aed',
      bg: '#ffffff',
      shadow: '#000000',
      badge: 'PORTFOLIO CONTROL',
      badgeBg: '#c084fc',
      badgeText: '#000000',
      body: 'Keep track of your Ignite Points, shares and profit/loss. Use your points wisely and decide when to buy, hold or sell.'
    },
    {
      num: '07',
      title: 'FINAL 5 MINUTES (LOCKOUT WARNING)',
      color: '#dc2626',
      bg: '#fff1f2',
      shadow: '#ff0055',
      badge: 'CRITICAL LOCKOUT',
      badgeBg: '#ff0055',
      badgeText: '#ffffff',
      body: 'When the game enters its last 5 minutes, no new trades can be placed. All the shares you still own will be automatically sold at the current market price.'
    },
    {
      num: '08',
      title: 'WIN THE GAME (CHAMPIONSHIP)',
      color: '#d97706',
      bg: '#fefce8',
      shadow: '#ffd200',
      badge: 'VICTORY GOAL',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      body: 'After the 3-hour game ends, the player with the highest amount of Ignite Points (IC) wins!'
    }
  ];

  let startY = 90;
  stepsPage2.forEach((step, idx) => {
    const cardY = startY + idx * 148;

    // Neo Card Box
    drawNeoCard(30, cardY, W - 60, 134, step.bg, step.shadow, 8, 3);

    // Accent Stripe
    doc.rect(30, cardY, 8, 134).fill(step.color);

    // Number Badge
    drawNeoBadge(48, cardY + 14, 38, 28, step.num, step.color, '#ffffff', '#000000', 14);

    // Step Title
    doc.fillColor('#000000').fontSize(13.5).font('Helvetica-Bold').text(step.title, 96, cardY + 18);

    // Badge Right
    drawNeoBadge(W - 170, cardY + 14, 125, 22, step.badge, step.badgeBg, step.badgeText, '#000000', 8);

    // Step Body Text
    doc.fillColor('#0f172a').fontSize(9.5).font('Helvetica-Bold').text(step.body, 96, cardY + 48, { width: W - 180, lineGap: 3 });
  });

  // Neo-Brutalist Call-To-Action Box on Page 2
  const ctaY = startY + 4 * 148 - 4;
  drawNeoCard(30, ctaY, W - 60, 84, '#000000', '#ff0055', 10, 3.5);

  doc.fillColor('#ffd200').fontSize(14).font('Helvetica-Bold').text('READY TO DOMINATE THE MARKET?', 50, ctaY + 16);
  doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text('Register today for Equity Arena at SVKM\'s Shri Bhagubhai Mafatlal Polytechnic and claim your 20,000 IC.', 50, ctaY + 36, { width: W - 100 });

  drawNeoBadge(50, ctaY + 54, 380, 20, 'REGISTER ONLINE: https://ignite-8.vercel.app/register-stock', '#00f3ff', '#000000', '#000000', 9);

  // Footer Page 2
  drawFooter(2);
}

function drawFooter(pageNum) {
  const footerY = H - 42;
  doc.rect(0, footerY, W, 42).fill('#f8fafc');
  doc.rect(0, footerY, W, 2).fill('#000000');

  doc.fillColor('#000000').fontSize(8).font('Helvetica-Bold').text(
    'Equity Arena is an educational stock market simulation. Virtual currency (IC) only. No real money involved.',
    30, footerY + 15
  );

  doc.fillColor('#000000').fontSize(8.5).font('Helvetica-Bold').text(
    `IGNITE 8.0 • PAGE ${pageNum} OF 2`,
    W - 150, footerY + 15, { width: 120, align: 'right' }
  );
}
