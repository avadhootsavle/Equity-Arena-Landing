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

// Page 1 — Steps 01 to 04
drawPage1();

// Page 2 — Steps 05 to 08
doc.addPage({ size: 'A4', margin: 0 });
drawPage2();

// Page 3 — FAQ & CTA Box
doc.addPage({ size: 'A4', margin: 0 });
drawPage3();

doc.end();

stream.on('finish', () => {
  console.log(`3-Page Neo-Brutalist Brochure PDF generated successfully at ${outputPath}`);
});

/** Helper: Draw a Neo-Brutalist Card with Hard Solid Offset Shadow */
function drawNeoCard(x, y, w, h, bg = '#ffffff', shadowColor = '#000000', borderRadius = 12, borderWidth = 3.5) {
  // Hard Offset Shadow Box
  doc.roundedRect(x + 6, y + 6, w, h, borderRadius).fill(shadowColor);
  // Main Card Body
  doc.roundedRect(x, y, w, h, borderRadius).fill(bg);
  // Thick Solid Outer Border
  doc.roundedRect(x, y, w, h, borderRadius).lineWidth(borderWidth).stroke('#000000');
}

/** Helper: Draw a Neo-Brutalist Badge Button */
function drawNeoBadge(x, y, w, h, text, bg = '#ffd200', textColor = '#000000', shadowColor = '#000000', fontSize = 9) {
  doc.roundedRect(x + 2.5, y + 2.5, w, h, 6).fill(shadowColor);
  doc.roundedRect(x, y, w, h, 6).fill(bg);
  doc.roundedRect(x, y, w, h, 6).lineWidth(2).stroke('#000000');
  doc.fillColor(textColor).fontSize(fontSize).font('Helvetica-Bold').text(text, x, y + (h - fontSize) / 2 - 0.5, { width: w, align: 'center' });
}

function drawPage1() {
  doc.rect(0, 0, W, H).fill('#ffffff');

  // Top Neo Hazard Bar (High-Contrast Color Stripes)
  const stripeW = W / 5;
  doc.rect(0, 0, stripeW, 10).fill('#ff0055');
  doc.rect(stripeW, 0, stripeW, 10).fill('#ffd200');
  doc.rect(stripeW * 2, 0, stripeW, 10).fill('#00f3ff');
  doc.rect(stripeW * 3, 0, stripeW, 10).fill('#10b981');
  doc.rect(stripeW * 4, 0, stripeW, 10).fill('#000000');

  // Header Banner Card Box
  drawNeoCard(30, 30, W - 60, 150, '#f8fafc', '#000000', 14, 3.5);

  // Embed Spider-Man Character Image hanging in Header
  if (fs.existsSync(imgSpidermanHanging)) {
    doc.image(imgSpidermanHanging, W - 165, 14, { width: 140 });
  }

  // Header Badges
  drawNeoBadge(46, 46, 180, 24, 'IGNITE 8.0 • OFFICIAL GAME BROCHURE', '#ffd200', '#000000', '#000000', 8.5);
  drawNeoBadge(236, 46, 95, 24, 'SVKM\'S SBMP', '#000000', '#ffffff', '#000000', 8.5);

  // Main Neo Title
  doc.fillColor('#000000').fontSize(32).font('Helvetica-Bold').text('EQUITY', 46, 82, { continued: true });
  doc.fillColor('#ff0055').text(' ARENA');

  drawNeoBadge(46, 122, 210, 20, 'HOW TO PLAY & OFFICIAL RULEBOOK', '#000000', '#00f3ff', '#000000', 8.5);

  doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold').text('SVKM\'s Shri Bhagubhai Mafatlal Polytechnic • Vile Parle (West), Mumbai', 46, 148);

  // Capital Bonus Box
  drawNeoCard(46, 162, 260, 24, '#ffffff', '#000000', 6, 2);
  doc.fillColor('#ff0055').fontSize(9).font('Helvetica-Bold').text('STARTING CAPITAL: 20,000 IC (VIRTUAL COINS)', 54, 169);

  // Section Title: 8 STEPS TO DOMINATE THE ARENA
  drawNeoBadge(30, 200, 270, 28, '⚡ 8 STEPS TO DOMINATE THE ARENA', '#ff0055', '#ffffff', '#000000', 10.5);

  // Steps 1 to 4 on Page 1
  const stepsPage1 = [
    {
      num: '01',
      title: 'REGISTER & GET 20,000 IC',
      color: '#ff0055',
      badge: 'WELCOME BONUS',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      body: 'Create your account on Equity Arena and receive 20,000 free Ignite Points (IC) to start the game. Your IC balance is your trading capital.'
    },
    {
      num: '02',
      title: 'START THE 3-HOUR GAME',
      color: '#0284c7',
      badge: 'LIVE ARENA',
      badgeBg: '#00f3ff',
      badgeText: '#000000',
      body: 'The game runs for exactly 3 hours live. During the game, the market prices of the 15 available stocks keep changing in real-time based on high-volatility telemetry.'
    },
    {
      num: '03',
      title: 'CHECK THE STOCKS',
      color: '#d97706',
      badge: 'TELEMETRY & GRAPHS',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      body: 'Explore the 15 available stocks and check their live price, trend graph, sector telemetry, and order details before making your move.'
    },
    {
      num: '04',
      title: 'FOLLOW THE MARKET NEWS',
      color: '#059669',
      badge: 'MARKET SHOCKS',
      badgeBg: '#10b981',
      badgeText: '#ffffff',
      body: 'New breaking market news will appear during the game. The news can affect stock prices, so read the news and make your trading decisions carefully.'
    }
  ];

  let startY = 246;
  stepsPage1.forEach((step, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = 30 + col * (W / 2 - 15);
    const cardY = startY + row * 270;
    const cardW = W / 2 - 45;

    drawNeoCard(cardX, cardY, cardW, 250, '#ffffff', '#000000', 12, 3);
    doc.rect(cardX, cardY, 8, 250).fill(step.color);

    drawNeoBadge(cardX + 18, cardY + 16, 36, 28, step.num, step.color, '#ffffff', '#000000', 13);
    drawNeoBadge(cardX + cardW - 130, cardY + 16, 115, 24, step.badge, step.badgeBg, step.badgeText, '#000000', 8);

    doc.fillColor('#000000').fontSize(13).font('Helvetica-Bold').text(step.title, cardX + 18, cardY + 56, { width: cardW - 36 });
    doc.fillColor('#334155').fontSize(10).font('Helvetica-Bold').text(step.body, cardX + 18, cardY + 98, { width: cardW - 36, lineGap: 4 });

    if (idx === 0) {
      doc.fillColor('#059669').fontSize(9.5).font('Helvetica-Bold').text('✓ 20,000 IC credited instantly', cardX + 18, cardY + 215);
      if (fs.existsSync(imgPixelHead)) {
        doc.image(imgPixelHead, cardX + cardW - 45, cardY + 205, { width: 30 });
      }
    }
  });

  drawFooter(1);
}

function drawPage2() {
  doc.rect(0, 0, W, H).fill('#ffffff');

  // Mini Header Card
  drawNeoCard(30, 24, W - 60, 65, '#f8fafc', '#00f3ff', 12, 3.5);

  if (fs.existsSync(imgSpidermanSide)) {
    doc.image(imgSpidermanSide, W - 120, 10, { width: 90 });
  }

  drawNeoBadge(46, 36, 95, 20, 'PAGE 2 OF 2', '#000000', '#ffffff', '#000000', 8);
  drawNeoBadge(150, 36, 125, 20, 'TRADING STRATEGY', '#00f3ff', '#000000', '#000000', 8);

  doc.fillColor('#000000').fontSize(18).font('Helvetica-Bold').text('EQUITY', 46, 62, { continued: true });
  doc.fillColor('#ff0055').text(' ARENA');
  doc.fillColor('#000000').text(' • GAMEPLAY RULES');

  // Steps 5 to 8 Grid
  const stepsPage2 = [
    {
      num: '05',
      title: 'BUY & SELL SHARES',
      color: '#0284c7',
      bg: '#ffffff',
      badge: 'TRADING DESK',
      badgeBg: '#00f3ff',
      badgeText: '#000000',
      body: 'Use your Ignite Points to buy and sell shares.',
      subPoints: [
        { label: '• Buy / Sell at Market Price', desc: 'Trade instantly at the current live stock price.' },
        { label: '• Place a Limit Order', desc: 'Set the exact price at which you want to buy or sell. The order executes automatically when the stock hits your price.' }
      ]
    },
    {
      num: '06',
      title: 'MANAGE YOUR IC',
      color: '#7c3aed',
      bg: '#ffffff',
      badge: 'PORTFOLIO CONTROL',
      badgeBg: '#c084fc',
      badgeText: '#000000',
      body: 'Keep track of your Ignite Points, stock holdings, and profit/loss. Use your points wisely and decide strategically when to buy, hold or sell.'
    },
    {
      num: '07',
      title: 'FINAL 5 MINUTES (LOCKOUT WARNING)',
      color: '#dc2626',
      bg: '#fff1f2',
      badge: 'CRITICAL LOCKOUT',
      badgeBg: '#ff0055',
      badgeText: '#ffffff',
      body: 'When the game enters its last 5 minutes, no new trades can be placed. All remaining shares you still own will be automatically sold at the current market price.'
    },
    {
      num: '08',
      title: 'WIN THE GAME (CHAMPIONSHIP)',
      color: '#d97706',
      bg: '#fefce8',
      badge: 'VICTORY GOAL',
      badgeBg: '#ffd200',
      badgeText: '#000000',
      body: 'After the 3-hour game ends, the player with the highest final amount of Ignite Points (IC) wins the championship!'
    }
  ];

  let startY = 110;
  stepsPage2.forEach((step, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = 30 + col * (W / 2 - 15);
    const cardY = startY + row * 325;
    const cardW = W / 2 - 45;

    drawNeoCard(cardX, cardY, cardW, 305, step.bg, '#000000', 12, 3);
    doc.rect(cardX, cardY, 8, 305).fill(step.color);

    drawNeoBadge(cardX + 18, cardY + 16, 36, 28, step.num, step.color, '#ffffff', '#000000', 13);
    drawNeoBadge(cardX + cardW - 130, cardY + 16, 115, 24, step.badge, step.badgeBg, step.badgeText, '#000000', 8);

    doc.fillColor('#000000').fontSize(13).font('Helvetica-Bold').text(step.title, cardX + 18, cardY + 56, { width: cardW - 36 });
    doc.fillColor('#334155').fontSize(10).font('Helvetica-Bold').text(step.body, cardX + 18, cardY + 98, { width: cardW - 36, lineGap: 4 });

    if (step.subPoints) {
      let subY = cardY + 140;
      step.subPoints.forEach((sub) => {
        drawNeoCard(cardX + 14, subY, cardW - 28, 68, '#f8fafc', '#000000', 8, 2);
        doc.fillColor('#0284c7').fontSize(9.5).font('Helvetica-Bold').text(sub.label, cardX + 22, subY + 8);
        doc.fillColor('#334155').fontSize(8.5).font('Helvetica').text(sub.desc, cardX + 22, subY + 24, { width: cardW - 44 });
        subY += 76;
      });
    }
  });

  drawFooter(2);
}

function drawPage3() {
  doc.rect(0, 0, W, H).fill('#ffffff');

  // FAQ Banner
  drawNeoBadge(30, 30, 260, 30, '❓ FREQUENTLY ASKED QUESTIONS (FAQ)', '#ffd200', '#000000', '#000000', 10.5);

  const faqs = [
    {
      q: 'Q: Is there any real money involved in Equity Arena?',
      a: 'No! Equity Arena is a 100% simulated educational trading game. All 20,000 IC points, stocks, orders, and P&L displayed are virtual. No real money is deposited or lost.'
    },
    {
      q: 'Q: How are the winners decided after 3 hours?',
      a: 'At the end of the 3-hour arena, all remaining shares auto-liquidate at market price. The trader with the highest overall Ignite Points (IC) wallet balance wins 1st place!'
    },
    {
      q: 'Q: Can I place Limit Orders during the game?',
      a: 'Yes! You can choose to trade immediately at Market Price or set Limit Orders. Limit orders will execute automatically when the stock hits your target price.'
    },
    {
      q: 'Q: What happens during the Final 5 Minutes?',
      a: 'During the final 5 minutes, a strict trading lockout occurs. No new buy or sell orders can be placed. All open stock positions are automatically liquidated to compute final standings.'
    }
  ];

  let startY = 80;
  faqs.forEach((faq, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cardX = 30 + col * (W / 2 - 15);
    const cardY = startY + row * 180;
    const cardW = W / 2 - 45;

    drawNeoCard(cardX, cardY, cardW, 160, '#ffffff', '#000000', 10, 3);
    doc.fillColor('#000000').fontSize(11).font('Helvetica-Bold').text(faq.q, cardX + 16, cardY + 16, { width: cardW - 32 });
    doc.rect(cardX + 16, cardY + 54, cardW - 32, 1.5).fill('#e2e8f0');
    doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(faq.a, cardX + 16, cardY + 66, { width: cardW - 32, lineGap: 3.5 });
  });

  // Call-To-Action Container Box on Page 3
  const ctaY = startY + 2 * 180 + 30;
  drawNeoCard(30, ctaY, W - 60, 180, '#000000', '#ff0055', 14, 4);

  drawNeoBadge(50, ctaY + 20, 130, 22, 'JOIN THE ARENA', '#ffd200', '#000000', '#000000', 8.5);
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text('IGNITE 8.0', 190, ctaY + 25);

  doc.fillColor('#ffd200').fontSize(20).font('Helvetica-Bold').text('READY TO DOMINATE THE STOCK MARKET?', 50, ctaY + 54);
  doc.fillColor('#ffffff').fontSize(10.5).font('Helvetica').text('Register today for Equity Arena at SVKM\'s Shri Bhagubhai Mafatlal Polytechnic and claim your 20,000 IC virtual trading capital.', 50, ctaY + 84, { width: W - 100 });

  drawNeoBadge(50, ctaY + 124, 460, 32, 'REGISTER ONLINE: https://ignite-8.vercel.app/register-stock', '#00f3ff', '#000000', '#000000', 11);

  // Footer Page 3
  drawFooter(3);
}

function drawFooter(pageNum) {
  const footerY = H - 42;
  doc.rect(0, footerY, W, 42).fill('#ffffff');
  doc.rect(30, footerY, W - 60, 2).fill('#000000');

  doc.fillColor('#000000').fontSize(8.5).font('Helvetica-Bold').text(
    `© ${new Date().getFullYear()} Equity Arena • Virtual Trading Simulator • No Real Money Involved`,
    30, footerY + 15
  );

  doc.fillColor('#000000').fontSize(8.5).font('Helvetica-Bold').text(
    'SVKM\'S SBMP • VILE PARLE (WEST)',
    W - 220, footerY + 15, { width: 190, align: 'right' }
  );
}
