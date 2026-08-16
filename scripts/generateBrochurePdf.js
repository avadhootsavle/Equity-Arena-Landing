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
    Keywords: 'Equity Arena, Ignite 8.0, Stock Market, Rules, Brochure'
  }
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const W = 595.28;
const H = 841.89;

// Page 1 — White Mode Theme with Spider-Man Character Artwork
drawPage1();

// Page 2 — White Mode Theme
doc.addPage({ size: 'A4', margin: 0 });
drawPage2();

doc.end();

stream.on('finish', () => {
  console.log(`White Mode Brochure PDF generated successfully at ${outputPath}`);
});

function drawPage1() {
  // Page Background: Crisp Clean White Mode
  doc.rect(0, 0, W, H).fill('#ffffff');

  // Top Light Gray Accent Header Block
  doc.rect(0, 0, W, 145).fill('#f8fafc');
  doc.rect(0, 142, W, 3).fill('#e11d48'); // Crimson red bottom stripe

  // Decorative Top Hazard Line
  doc.rect(0, 0, W, 6).fill('#0f172a');
  doc.rect(0, 6, W / 3, 4).fill('#e11d48');
  doc.rect(W / 3, 6, W / 3, 4).fill('#0284c7');
  doc.rect((2 * W) / 3, 6, W / 3, 4).fill('#eab308');

  // Embed Spider-Man Character Hanging Artwork in Top Right Header
  if (fs.existsSync(imgSpidermanHanging)) {
    doc.image(imgSpidermanHanging, W - 145, 10, { width: 130 });
  }

  // Header Badge
  doc.roundedRect(30, 22, 175, 22, 5).fill('#0f172a');
  doc.fillColor('#ffd200').fontSize(9.5).font('Helvetica-Bold').text('IGNITE 8.0 • OFFICIAL GAME GUIDE', 38, 28);

  // Main Title
  doc.fillColor('#0f172a').fontSize(26).font('Helvetica-Bold').text('EQUITY', 30, 52, { continued: true });
  doc.fillColor('#e11d48').text(' ARENA');

  doc.fillColor('#0284c7').fontSize(12).font('Helvetica-Bold').text('HOW TO PLAY & OFFICIAL RULEBOOK', 30, 85);
  doc.fillColor('#475569').fontSize(9).font('Helvetica-Bold').text('SVKM\'s Shri Bhagubhai Mafatlal Polytechnic • Vile Parle (West), Mumbai', 30, 103);

  // Capital Badge Box
  doc.roundedRect(30, 116, 210, 20, 4).fill('#f1f5f9');
  doc.rect(30, 116, 210, 20).lineWidth(1.5).stroke('#0f172a');
  doc.fillColor('#e11d48').fontSize(9).font('Helvetica-Bold').text('STARTING CAPITAL:', 38, 122, { continued: true });
  doc.fillColor('#0f172a').text(' 20,000 IC (VIRTUAL COINS)');

  // Section Header
  doc.fillColor('#0f172a').fontSize(15).font('Helvetica-Bold').text('8 STEPS TO MASTER THE ARENA', 30, 160);
  doc.rect(30, 178, 250, 2.5).fill('#e11d48');

  // Steps 1 to 4 on Page 1
  const stepsPage1 = [
    {
      num: '01',
      title: 'REGISTER & GET 20,000 IC',
      color: '#e11d48',
      badge: 'STARTING BONUS',
      body: 'Create your account and receive 20,000 free Ignite Points (IC) to start the game. Your IC balance is your trading capital.'
    },
    {
      num: '02',
      title: 'START THE 3-HOUR GAME',
      color: '#0284c7',
      badge: 'LIVE ARENA',
      body: 'The game runs for exactly 3 hours live. During the game, the market prices of the 15 available stocks keep changing in real-time.'
    },
    {
      num: '03',
      title: 'CHECK THE STOCKS',
      color: '#d97706',
      badge: 'TELEMETRY & GRAPHS',
      body: 'Explore the 15 available stocks and check their live price, trend graph, sector telemetry, and order details before making your move.'
    },
    {
      num: '04',
      title: 'FOLLOW THE MARKET NEWS',
      color: '#059669',
      badge: 'MARKET EVENTS',
      body: 'New breaking market news will appear during the game. The news can affect stock prices, so read the news and make your decisions carefully.'
    }
  ];

  let startY = 192;
  stepsPage1.forEach((step, idx) => {
    const cardY = startY + idx * 142;

    // Card Shadow
    doc.roundedRect(33, cardY + 3, W - 60, 128, 8).fill('#e2e8f0');

    // Card Main Background (Clean White Mode)
    doc.roundedRect(30, cardY, W - 60, 128, 8).fill('#ffffff');
    doc.roundedRect(30, cardY, W - 60, 128, 8).lineWidth(2).stroke('#0f172a');
    doc.rect(30, cardY, 8, 128).fill(step.color);

    // Number Badge
    doc.roundedRect(48, cardY + 14, 38, 26, 5).fill(step.color);
    doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold').text(step.num, 48, cardY + 20, { width: 38, align: 'center' });

    // Step Title
    doc.fillColor('#0f172a').fontSize(13.5).font('Helvetica-Bold').text(step.title, 96, cardY + 18);

    // Badge Right
    doc.roundedRect(W - 170, cardY + 14, 125, 20, 4).fill('#f1f5f9');
    doc.rect(W - 170, cardY + 14, 125, 20).lineWidth(1).stroke('#cbd5e1');
    doc.fillColor(step.color).fontSize(7.5).font('Helvetica-Bold').text(step.badge, W - 170, cardY + 20, { width: 125, align: 'center' });

    // Step Description Body
    doc.fillColor('#334155').fontSize(10).font('Helvetica').text(step.body, 96, cardY + 46, { width: W - 170, lineGap: 3.5 });

    // Optional Character Icon overlay on card
    if (idx === 0 && fs.existsSync(imgPixelHead)) {
      doc.image(imgPixelHead, W - 75, cardY + 75, { width: 32 });
    } else if (idx === 2 && fs.existsSync(imgPixelSpider)) {
      doc.image(imgPixelSpider, W - 75, cardY + 75, { width: 32 });
    }
  });

  // Footer Page 1
  drawFooter(1);
}

function drawPage2() {
  // Page Background: Crisp Clean White Mode
  doc.rect(0, 0, W, H).fill('#ffffff');

  // Top Light Gray Mini Header
  doc.rect(0, 0, W, 75).fill('#f8fafc');
  doc.rect(0, 72, W, 3).fill('#0284c7');

  // Embed Spider-Man Side Character in Page 2 Header
  if (fs.existsSync(imgSpidermanSide)) {
    doc.image(imgSpidermanSide, W - 110, 8, { width: 85 });
  }

  doc.fillColor('#0f172a').fontSize(18).font('Helvetica-Bold').text('EQUITY ARENA', 30, 20, { continued: true });
  doc.fillColor('#e11d48').text(' • GAMEPLAY RULES & STRATEGY');
  doc.fillColor('#475569').fontSize(9).font('Helvetica-Bold').text('PAGE 2 OF 2 • IGNITE 8.0 OFFICIAL HANDBOOK', 30, 44);

  // Steps 5 to 8 on Page 2
  const stepsPage2 = [
    {
      num: '05',
      title: 'BUY & SELL SHARES',
      color: '#0284c7',
      bg: '#ffffff',
      border: '#0f172a',
      badge: 'TRADING DESK',
      body: 'Use your Ignite Points to buy and sell shares.\nYou can:\n• Buy/Sell at Market Price — trade at the current stock price.\n• Place a Limit Order — set the price at which you want to buy or sell. The order will be completed when the stock reaches your chosen price.'
    },
    {
      num: '06',
      title: 'MANAGE YOUR IC',
      color: '#7c3aed',
      bg: '#ffffff',
      border: '#0f172a',
      badge: 'PORTFOLIO CONTROL',
      body: 'Keep track of your Ignite Points, shares and profit/loss. Use your points wisely and decide when to buy, hold or sell.'
    },
    {
      num: '07',
      title: 'FINAL 5 MINUTES (LOCKOUT WARNING)',
      color: '#e11d48',
      bg: '#fff1f2',
      border: '#e11d48',
      badge: 'CRITICAL LOCKOUT',
      body: 'When the game enters its last 5 minutes, no new trades can be placed. All the shares you still own will be automatically sold at the current market price.'
    },
    {
      num: '08',
      title: 'WIN THE GAME (CHAMPIONSHIP)',
      color: '#d97706',
      bg: '#fefce8',
      border: '#d97706',
      badge: 'VICTORY GOAL',
      body: 'After the 3-hour game ends, the player with the highest amount of Ignite Points (IC) wins!'
    }
  ];

  let startY = 88;
  stepsPage2.forEach((step, idx) => {
    const cardY = startY + idx * 148;

    // Card Shadow
    doc.roundedRect(33, cardY + 3, W - 60, 134, 8).fill('#e2e8f0');

    // Card Background
    doc.roundedRect(30, cardY, W - 60, 134, 8).fill(step.bg);
    doc.roundedRect(30, cardY, W - 60, 134, 8).lineWidth(2).stroke(step.border);
    doc.rect(30, cardY, 8, 134).fill(step.color);

    // Number Badge
    doc.roundedRect(48, cardY + 14, 38, 26, 5).fill(step.color);
    doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold').text(step.num, 48, cardY + 20, { width: 38, align: 'center' });

    // Step Title
    doc.fillColor('#0f172a').fontSize(13.5).font('Helvetica-Bold').text(step.title, 96, cardY + 18);

    // Badge Right
    doc.roundedRect(W - 170, cardY + 14, 125, 20, 4).fill(step.num === '07' ? '#e11d48' : step.num === '08' ? '#d97706' : '#f1f5f9');
    doc.fillColor(step.num === '07' || step.num === '08' ? '#ffffff' : step.color).fontSize(7.5).font('Helvetica-Bold').text(step.badge, W - 170, cardY + 20, { width: 125, align: 'center' });

    // Step Body
    doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(step.body, 96, cardY + 46, { width: W - 170, lineGap: 3 });
  });

  // Call-To-Action Box on Page 2
  const ctaY = startY + 4 * 148 - 5;
  doc.roundedRect(33, ctaY + 3, W - 60, 85, 10).fill('#e2e8f0');
  doc.roundedRect(30, ctaY, W - 60, 85, 10).fill('#0f172a');

  doc.fillColor('#ffd200').fontSize(14).font('Helvetica-Bold').text('READY TO DOMINATE THE MARKET?', 50, ctaY + 16);
  doc.fillColor('#ffffff').fontSize(9.5).font('Helvetica').text('Register today for Equity Arena at SVKM\'s Shri Bhagubhai Mafatlal Polytechnic and claim your 20,000 IC.', 50, ctaY + 36);
  doc.fillColor('#00f3ff').fontSize(10.5).font('Helvetica-Bold').text('REGISTER ONLINE: https://ignite-8.vercel.app/register-stock', 50, ctaY + 56);

  // Footer Page 2
  drawFooter(2);
}

function drawFooter(pageNum) {
  const footerY = H - 42;
  doc.rect(0, footerY, W, 42).fill('#f8fafc');
  doc.rect(0, footerY, W, 1.5).fill('#e2e8f0');

  doc.fillColor('#64748b').fontSize(8).font('Helvetica').text(
    'Equity Arena is an educational stock market simulation. Virtual currency (IC) only. No real money involved.',
    30, footerY + 14
  );

  doc.fillColor('#0f172a').fontSize(8).font('Helvetica-Bold').text(
    `IGNITE 8.0 • PAGE ${pageNum} OF 2`,
    W - 150, footerY + 14, { width: 120, align: 'right' }
  );
}
