# Projeto final de Cyber Security

Esse projeto visa criar um chatbot baseado no dataset do curso de Engenharia de Computação da Unoesc.

O projeto foi feito com SvelteKit + SDK AI da Vercel, utilizando o `Gemini 2.5 Pro` como LLM.

---

**Professor:** Jacson Luiz Matte

**Alunas:**

- Ana Paula Rampanelli (404334) - **Engenheira de dados e de IA**
- Júlia Patricia Wolschick (404691) - **Engenheira de backend e de IA**, **desenvolvedora de interface**

---

## Configuração

Preencha a variável de ambiente `GOOGLE_GENERATIVE_AI_API_KEY`, ela é tudo que precisa para o aplicativo funcionar:

```shell
cp .env.example .env
```

Inicie o servidor:

```shell
npm run dev
```

## Diário de Bordo de Contribuições

### Semana 01

#### Ana

Realizei buscas no Google para encontrar informações gerais e técnicas sobre o curso de Engenharia da Computação, e também
solicitei materiais específicos ao coordenador do curso (Jean) na tentativa de aprofundar o conteúdo. O coordenador
forneceu apenas o link do site institucional, informação que já possuíamos.

Já fiz também a transcrição integral de todas as informações disponíveis no site da instituição para um documento de texto.
Localizei e adicionei um documento técnico em PDF referente à área.
Organizei e enviei o material (transcrições + PDF) para a Júlia.

O site oficial continha pouco conteúdo aprofundado e houve grande dificuldade em localizar outras fontes ou repositórios
externos confiáveis sobre o curso específico, limitando o material inicial.

#### Júlia

Nessa semana eu comecei os projetos de frontend e backend. A parte mais difícil foi me reacostumar com o Svelte.
Eu fiz um projeto parecido no trabalho recentemente, só que com Vue, então várias coisas eu já sabia exatamente
como fazer, que bibliotecas usar, etc.

Esse começo foi mais uma maquete mesmo.

### Semana 02

#### Ana

Acabamos percebendo que o material da primeira semana era insuficiente, então busquei em canais de vídeo e no Instagram
por conteúdos que promoviam o curso e entrevistas. Transcrevi manualmente as entrevistas e vídeos promocionais para texto.
A conversão do conteúdo audiovisual para texto levou muito tempo. O processo manual foi trabalhoso e repetitivo, mesmo não sendo difícil.

Também estabeleci que a IA deve ser didática e informal, visando interagir melhor com o estudante interessado.

Por fim finalizamos o Dataset unindo dados do site e transcrições de vídeos.

#### Júlia

Nessa semana eu finalizei os projetos de frontend e backend. Parei de usar a solução pronta do pacote `ai` e
refiz a partir de streaming de texto. Implementei o banco, o visual, e deixei a conversa mais fluida. Agora é
possível ter mais de um chat também!

Foram feitas algumas últimas alterações na personalidade da IA e adicionei comentários nos trechos relevantes
do código, como pedido.
