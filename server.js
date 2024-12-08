import puppeteer from "puppeteer";

async function Sms(params) { 
var phone = [ 
929736896,
941137038,
944892600,
954305587,
929303497,
929585613,
933323848,
926368622,
956064462,
958636615,
926200964
]
var sms = "ola , boa noite!   Att : não reponda a está sms, obrigado!"
const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
const page = await browser.newPage();
page.on('dialog', async (dialog) => {
  console.log("Diálogo detectado!");

  if (dialog.type() === 'alert') {
      console.log('Alerta detectado. Fechando...');
      await dialog.dismiss(); // Fecha o alerta
  } else if (dialog.type() === 'confirm') {
      console.log('Confirmação detectada. Selecionando "Sim" e fechando...');
      await dialog.accept(); // Aceita a confirmação
      await page.close(); // Fecha a aba atual
  } else if (dialog.type() === 'prompt') {
      console.log('Prompt detectado. Fechando...');
      await dialog.dismiss(); // Fecha o prompt
  } else {
      console.log('Tipo de diálogo desconhecido. Fechando...');
     
  }
});


// Função para enviar a mensagem para um número específico
const sendMessage = async (phone) => {
  console.log("carregando a url com o numero : "+phone)
  const url = `https://web.whatsapp.com/send?phone=+244${phone}&text=${sms}`;
  console.log("caregou a URL")
  await page.goto(url, { timeout: 0, waitUntil: 'load' });

  console.log(`Preparando para enviar mensagem para ${phone}`);
  
  // Espera o botão de envio estar visível
  console.log("um delay de 2000 antes de pegar o selector")
  await delay(2000)
  await page.waitForSelector('span[data-icon="send"]', { timeout: 0 });
  // Clica no botão de envio
  const sendButton = await page.$("span[data-icon='send']");
  let teste = true;
  while (teste){
    if(sendButton){
      await sendButton.click();
      console.log("clicou , agora aguarde")
      await delay(5000)
      console.log("clicou , aguardou")
      teste = false
      console.log("esperando o bt pra clicar.....")
      page.on('dialog', async (dialog) => {
        console.log("entrou aqui")
          // Usando if-else para verificar o tipo de diálogo e fechá-lo
          if (dialog.type() === 'alert') {
            console.log('Fechando alerta...');
            await dialog.dismiss();  // Fecha o alerta
          } else if (dialog.type() === 'confirm') {
            console.log('Fechando confirmação...');
            await dialog.dismiss();  // Fecha a confirmação
          } else if (dialog.type() === 'prompt') {
            console.log('Fechando prompt...');
            await dialog.dismiss();  // Fecha o prompt
          } else {
            console.log('sem diálogo detectado');
          }
        }
    )
      
    }
  }
  await new Promise(resolve => setTimeout(resolve, 1000));
  page.on('dialog', async (dialog) => {
    console.log("entrou aqui")
      // Usando if-else para verificar o tipo de diálogo e fechá-lo
      if (dialog.type() === 'alert') {
        console.log('Fechando alerta...');
        await dialog.dismiss();  // Fecha o alerta
      } else if (dialog.type() === 'confirm') {
        console.log('Fechando confirmação...');
        await dialog.dismiss();  // Fecha a confirmação
      } else if (dialog.type() === 'prompt') {
        console.log('Fechando prompt...');
        await dialog.dismiss();  // Fecha o prompt
      } else {
        console.log('sem diálogo detectado');
      }
    }
)
  console.log(`Mensagem enviada para ${phone}`);
};

// Envia a mensagem para todos os números na lista
for (let index = 0; index < phone.length; index++) {
  
  await sendMessage(phone[index]);
  // Aguarda alguns segundos entre os envios para evitar bloqueios
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log("Todas as mensagens foram enviadas");
await browser.close();
}

function delay(params){
  return new Promise(resolve=>setTimeout(resolve,params))
}
   

//Sms();



