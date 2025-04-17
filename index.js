const puppeteer = require('puppeteer');

const KICK_URL = "https://kick.com/qeevynumberbinary";
const PROXIES = [
    "50.223.246.237:80", "50.207.199.87:80", "32.223.6.94:80", "44.195.247.145:80",
    "50.207.199.80:80", "50.174.7.153:80", "50.169.37.50:80", "50.239.72.18:80",
    "50.175.212.66:80", "50.217.226.47:80", "50.239.72.16:80", "50.239.72.19:80",
    "50.217.226.40:80", "50.221.74.130:80", "50.175.212.74:80", "50.207.199.82:80",
    "50.122.86.118:80", "188.68.52.244:80", "66.191.31.158:80", "64.23.207.76:8888",
    "43.153.27.248:13001", "18.228.149.161:80", "3.12.144.146:3128", "18.228.198.164:80",
    "43.135.158.192:13001"
];

function getRandomUserAgent() {
    const agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.88 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
}

async function launchBot(proxy, id) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                `--proxy-server=http=${proxy}`,
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        });

        const page = await browser.newPage();

        await page.setUserAgent(getRandomUserAgent());

        await page.goto(KICK_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
        console.log(`[BOT ${id}] Assistindo com proxy ${proxy}`);

        await new Promise(r => setTimeout(r, 10 * 60 * 1000)); // 10 minutos

        await browser.close();
        console.log(`[BOT ${id}] Finalizado`);
    } catch (e) {
        console.error(`[BOT ${id}] Erro: ${e.message}`);
    }
}

(async () => {
    const totalTurnos = 5; // 5 turnos x 10 bots = 50
    const botsPorTurno = 10;

    for (let turno = 0; turno < totalTurnos; turno++) {
        console.log(`\n--- Turno ${turno + 1} ---\n`);
        const bots = [];

        for (let i = 0; i < botsPorTurno; i++) {
            const proxyIndex = turno * botsPorTurno + i;
            if (proxyIndex >= PROXIES.length) break;
            bots.push(launchBot(PROXIES[proxyIndex], i + 1));
        }

        await Promise.all(bots);
        console.log(`--- Turno ${turno + 1} finalizado ---`);
    }
})();
