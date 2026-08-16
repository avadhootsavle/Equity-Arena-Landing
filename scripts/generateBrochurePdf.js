import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '../public/Equity_Arena_Official_Brochure.pdf');

// Create public folder if it doesn't exist
if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

// Initialize PDF Document (A4 format)
const doc = new PDFDocument({
  size: 'A4',
  margin: 0,
  info: {
    Title: 'Equity Arena — Official Game Brochure & How To Play',
    Author: 'IGNITE 8.0 Team',
    Subject: 'How to Play Equity Arena Stock Market Simulation',
    Keywords: 'Equity Arena, Ignite 8.0, Stock Market, Rules, Brochure'
  }
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const W = 595.28;
const H = 841.89;

// Page 1
drawPage1();

// Page 2
doc.addPage({ size: 'A4', margin: 0 });
drawPage2();

doc.end();

stream.on('finish', () => {
  console.log(`Brochure PDF generated successfully at ${outputPath}`);
});

function drawPage1() {
  // Dark Background
  doc.rect(0, 0, W, H).fill('#0c1222');

  // Top Neon Cyber Header Banner
  doc.rect(0, 0, W, 140).fill('#070e1c');
  doc.rect(0, 136, W, 4).fill('#ff0055');

  // Top Decorative Corner Lines
  doc.rect(20, 20, 12, 12).fill('#ffd200');
  doc.rect(W - 32, 20, 12, 12).fill('#00f3ff');

  // Header Badge
  doc.roundedRect(30, 24, 140, 20, 4).fill('#ffd200');
  doc.fillColor('#05070e').fontSize(9).font('Helvetica-Bold').text('IGNITE 8.0 • OFFICIAL GUIDE', 35, 29);

  // Header Title
  doc.fillColor('#ffffff').fontSize(26).font('Helvetica-Bold').text('EQUITY', 30, 52, { continued: true });
  doc.fillColor('#ff0055').text(' ARENA');

  doc.fillColor('#00f3ff').fontSize(12).font('Helvetica-Bold').text('HOW TO PLAY & OFFICIAL RULEBOOK', 30, 85);
  doc.fillColor('#94a3b8').fontSize(9.5).font('Helvetica').text('SVKM\'s Shri Bhagubhai Mafatlal Polytechnic • Vile Parle (West), Mumbai', 30, 103);

  // Decorative Top Right Badge
  doc.roundedRect(W - 160, 45, 130, 45, 8).fill('#131c30');
  doc.rect(W - 160, 45, 4, 45).fill('#00f3ff');
  doc.fillColor('#ffd200').fontSize(12).font('Helvetica-Bold').text('20,000 IC', W - 145, 53);
  doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica').text('STARTING CAPITAL', W - 145, 70);

  // Section Title
  doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('8 STEPS TO DOMINATE THE ARENA', 30, 158);
  doc.rect(30, 180, 260, 2).fill('#ff0055');

  // Steps 1 to 4 on Page 1
  const stepsPage1 = [
    {
      num: '01',
      title: 'REGISTER & GET 20,000 IC',
      color: '#ff0055',
      body: 'Create your account and receive 20,000 free Ignite Points (IC) to start the game. Your IC is your trading capital.'
    },
    {
      num: '02',
      title: 'START THE 3-HOUR GAME',
      color: '#00f3ff',
      body: 'The game runs for exactly 3 hours live. During the game, the market prices of 15 dynamic stocks keep changing in real-time.'
    },
    {
      num: '03',
      title: 'CHECK THE STOCKS',
      color: '#ffd200',
      body: 'Explore the 15 available stocks and check their live price, trend graph, sector telemetry, and order books before making your move.'
    },
    {
      num: '04',
      title: 'FOLLOW THE MARKET NEWS',
      color: '#10b981',
      body: 'New breaking market news will appear during the game. News events directly impact stock volatility, so read carefully and act fast!'
    }
  ];

  let startY = 195;
  stepsPage1.forEach((step, idx) => {
    const cardY = startY + idx * 140;

    // Card Container
    doc.roundedRect(30, cardY, W - 60, 125, 8).fill('#131c30');
    doc.rect(30, cardY, 6, 125).fill(step.color);

    // Step Number Badge
    doc.roundedRect(48, cardY + 14, 38, 26, 4).fill(step.color);
    doc.fillColor('#05070e').fontSize(13).font('Helvetica-Bold').text(step.num, 48, cardY + 20, { width: 38, align: 'center' });

    // Step Title
    doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text(step.title, 96, cardY + 18);

    // Step Body
    doc.fillColor('#cbd5e1').fontSize(10.5).font('Helvetica').text(step.body, 96, cardY + 44, { width: W - 170, lineGap: 4 });

    // Bottom Decorative Bar
    doc.rect(48, cardY + 110, W - 110, 1).fill('#1e293b');
  });

  // Footer Page 1
  drawFooter(1);
}

function drawPage2() {
  // Dark Background
  doc.rect(0, 0, W, H).fill('#0c1222');

  // Top Mini Header
  doc.rect(0, 0, W, 70).fill('#070e1c');
  doc.rect(0, 66, W, 4).fill('#00f3ff');

  doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('EQUITY ARENA', 30, 22, { continued: true });
  doc.fillColor('#ffd200').text(' • GAMEPLAY RULES & STRATEGY');
  doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('PAGE 2 OF 2 • IGNITE 8.0 OFFICIAL HANDBOOK', 30, 46);

  // Steps 5 to 8 on Page 2
  const stepsPage2 = [
    {
      num: '05',
      title: 'BUY & SELL SHARES',
      color: '#3b82f6',
      body: 'Use your Ignite Points to buy and sell shares.\n• Buy/Sell at Market Price — trade instantly at the current stock price.\n• Place a Limit Order — set your target price. The order fills automatically when market reaches it.'
    },
    {
      num: '06',
      title: 'MANAGE YOUR IC',
      color: '#8b5cf6',
      body: 'Keep track of your Ignite Points, holdings, and live profit/loss. Use your points wisely and execute strategic buy, hold, or sell maneuvers.'
    },
    {
      num: '07',
      title: 'FINAL 5 MINUTES (CRITICAL LOCKOUT)',
      color: '#ff0055',
      body: 'When the game enters its last 5 minutes, no new trades can be placed. All shares you still own will be automatically liquidated at current market price.'
    },
    {
      num: '08',
      title: 'WIN THE GAME (CHAMPIONSHIP)',
      color: '#ffd200',
      body: 'After the 3-hour game ends, the player with the highest total Ignite Points (IC) claims victory and wins Equity Arena!'
    }
  ];

  let startY = 90;
  stepsPage2.forEach((step, idx) => {
    const cardY = startY + idx * 148;

    // Card Container
    doc.roundedRect(30, cardY, W - 60, 134, 8).fill('#131c30');
    doc.rect(30, cardY, 6, 134).fill(step.color);

    // Step Number Badge
    doc.roundedRect(48, cardY + 14, 38, 26, 4).fill(step.color);
    doc.fillColor('#05070e').fontSize(13).font('Helvetica-Bold').text(step.num, 48, cardY + 20, { width: 38, align: 'center' });

    // Step Title
    doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text(step.title, 96, cardY + 18);

    // Step Body
    doc.fillColor('#cbd5e1').fontSize(10).font('Helvetica').text(step.body, 96, cardY + 44, { width: W - 170, lineGap: 3 });

    // Special Highlight Badges for 07 and 08
    if (step.num === '07') {
      doc.roundedRect(W - 145, cardY + 14, 100, 20, 4).fill('#ff0055');
      doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold').text('LOCKOUT WARNING', W - 145, cardY + 20, { width: 100, align: 'center' });
    } else if (step.num === '08') {
      doc.roundedRect(W - 145, cardY + 14, 100, 20, 4).fill('#ffd200');
      doc.fillColor('#05070e').fontSize(8).font('Helvetica-Bold').text('VICTORY GOAL', W - 145, cardY + 20, { width: 100, align: 'center' });
    }
  });

  // Call-To-Action Box on Page 2
  const ctaY = startY + 4 * 148 - 5;
  doc.roundedRect(30, ctaY, W - 60, 85, 10).fill('#071326');
  doc.rect(30, ctaY, W - 60, 85).lineWidth(2).stroke('#00f3ff');

  doc.fillColor('#ffd200').fontSize(14).font('Helvetica-Bold').text('READY TO DOMINATE THE MARKET?', 50, ctaY + 16);
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica').text('Register today at SVKM\'s Shri Bhagubhai Mafatlal Polytechnic and claim your 20,000 IC.', 50, ctaY + 36);
  doc.fillColor('#00f3ff').fontSize(11).font('Helvetica-Bold').text('REGISTER ONLINE: https://ignite-8.vercel.app/register-stock', 50, ctaY + 56);

  // Footer Page 2
  drawFooter(2);
}

function drawFooter(pageNum) {
  const footerY = H - 45;
  doc.rect(0, footerY, W, 45).fill('#05070e');
  doc.rect(0, footerY, W, 2).fill('#1e293b');

  doc.fillColor('#64748b').fontSize(8).font('Helvetica').text(
    'Equity Arena is an educational stock market simulation. Virtual currency (IC) only. No real money involved.',
    30, footerY + 12
  );

  doc.fillColor('#94a3b8').fontSize(8).font('Helvetica-Bold').text(
    `IGNITE 8.0 • PAGE ${pageNum} OF 2`,
    W - 150, footerY + 12, { width: 120, align: 'right' }
  );
}
