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
- Adicione o token copiado no `.env` no `CLIENT_TOKEN`.
## 3. URL do MongoDB
