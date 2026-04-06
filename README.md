## 1. Arquivo .env
Quando você criar a cópia desse projeto, você terá que criar um arquivo chamado **".env"**, ele irá salvar seus dados sigilosos, que não podem ser compartilhados.
- Deixei um exemplo em `.env.example`.
- Nos artigos **2.** e **3.** irei ensinar a pegar os dados que você deverá colocar no seu `.env`.
## 2. Token do Bot
Irei fazer o passo a passo de como criar e pegar o **token** do seu bot.
- Acesse o [Portal do Desenvolvedor](https://discord.com/developers/applications) e faça login com sua conta.
- Aperte no botão **"Novo aplicativo"**.
- Crie seu bot.
- Acesse o menu e clique na opção **"bot"**.
- Desça até achar a aba de **"intenções de gateway"**.
- Ative as intenções de **membros do servidor** e **conteúdo da mensagem**.
- Volte para cima até achar a aba **"Token"** e redefina o token.
- Copie o token redefinido.
- Adicione o token copiado em `.env` no `CLIENT_TOKEN`.
## 3. URL do MongoDB
Vou fazer o mesmo que fiz acima.
- Acesse o site do [MongoDB](https://mongodb.com/atlas).
- Antes de qualquer coisa, coloque o site no modo `Site para computador` ( se tiver no celular ), o site não funciona bem normalmente.
- Aperte em **Get Started**.
- Crie sua conta.
- Crie um cluster ( o site te redereciona automaticamente )
  - Selecione a opção **Free**.
  - Na aba **Quick setup**, desmarque as duas opções.
  - Seu cluster está criado.
- Clique em **Add Your Current IP Address** na aba **1**.
- Confirme em **Add IP Address**.
- Crie um user, colocando nome e senha. ( é importante você copiar essa senha ).
- Confirme em **Create Database User**.
- Aperte em **Choose a connection method**.
- Aperte na opção **Drivers**.
- Ignore tudo e vá para a aba **3**.
- Copie a URL que está nele.
  - Você terá algo mais ou menos assim: `mongodb+srv://teste:<db_password>@cluster0.dbz0gws.mongodb.net/?appName=Cluster0`.
- Antes de adicionar essa URL no `.env` precisamos garantir que qualquer IP possa acessar sua database. 👇
  - No menu do MongoDB, vá para a aba **SECURITY**.
  - Clique na opção **Database & Network Access**.
  - Clique na opção **IP Access List**.
  - Delete o seu IP atual apertando **DELETE**.
  - Adicione um novo IP.
  - No novo IP coloque ele como `0.0.0.0/0`, isso garante o acesso de qualquer IP.
  - Pronto.
- Adicione a URL copiada em `.env` no `MONGODB`.
- Substitua o `<db_password>` pela senha que você copiou anteriormente.
- Pronto.
## 4. Iniciando o Bot
- Após concluir todos os passos acima, agora podemos iniciar o bot.
- No terminal do dispositivo que você tiver usando, digite `npm start`, na pasta do seu projeto.
- Se você não tiver errado nada o bot iniciará normalmente.
## 5. Hospedando
...
