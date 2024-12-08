import puppeteer from "puppeteer";
import express, { json } from "express";
import cors from "cors";
import fs from "fs";

const server = express();
server.use(json());
server.use(cors());

server.get("/", async (req, res) => {
  const Sms = async () => {
    const phoneNumbers = [
      941137038, 944892600, 954305587, 929303497,
      929585613, 933323848, 926368622, 956064462,
      958636615, 926200964
    ];
    const message = "Olá, boa noite! Att: não responda a esta mensagem. Obrigado!";

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Carregar cookies (se existirem)
    if (fs.existsSync('cookies.json')) {
      const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
      await page.setCookie(...cookies);
    }

    await page.goto('https://web.whatsapp.com', { waitUntil: "networkidle0" });

    // Salvar cookies após login (apenas uma vez)
    if (!fs.existsSync('cookies.json')) {
      await page.waitForSelector("canvas", { timeout: 60000 });
      const cookies = await page.cookies();
      fs.writeFileSync("cookies.json", JSON.stringify(cookies));
    }

    // Função para enviar mensagem
    const sendMessage = async (phone) => {
      const url = `https://web.whatsapp.com/send?phone=+244${phone}&text=${encodeURIComponent(message)}`;
      await page.goto(url, { waitUntil: 'load' });

      try {
        // Esperar o botão de envio e clicar
        await page.waitForSelector('span[data-icon="send"]', { timeout: 30000 });
        await page.click('span[data-icon="send"]');
        console.log(`Mensagem enviada para ${phone}`);
      } catch (err) {
        console.error(`Erro ao enviar mensagem para ${phone}:`, err);
      }
    };

    // Enviar mensagem para todos os números
    for (const phone of phoneNumbers) {
      await sendMessage(phone);
      // Aguardar 10 segundos entre envios
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    await browser.close();
    console.log("Todas as mensagens foram enviadas");
    res.status(200).send("Todas as mensagens foram enviadas");
  };

  await Sms();
});

server.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
