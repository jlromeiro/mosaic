# PRD — Mosaico Solana Hackathon

**Título do site:** Mosaico Solana Hackathon  
**Assinatura:** Powered by “RPC Priority Protocol” Project  
**Versão:** 1.0  
**Tipo:** Landing interativa para evento  
**Opção escolhida:** Opção B — Experiência visual premium com seta animada, glow pulsante e zoom suave  

---

## 1. Resumo executivo

O **Mosaico Solana Hackathon** será um site interativo criado especificamente para o evento/hackathon, permitindo que participantes encontrem sua logo dentro de um grande mosaico de projetos.

O usuário acessa o site, visualiza o mosaico completo, envia um recorte da própria logo e o sistema identifica automaticamente a posição correspondente dentro da imagem. Em seguida, a interface destaca a logo encontrada com uma experiência visual premium: seta animada, efeito pulsante, zoom suave e opção de baixar ou compartilhar o resultado.

A ferramenta também funciona como uma ação de visibilidade para o projeto **RPC Priority Protocol**, posicionando-o como criador de uma experiência útil, tecnológica e compartilhável dentro do ecossistema Solana.

---

## 2. Objetivo do produto

Criar uma experiência web simples, rápida e visualmente impactante para que participantes do hackathon encontrem suas logos no mosaico oficial do evento.

Objetivos principais:

- Facilitar a localização de logos dentro de um mosaico com muitos projetos.
- Gerar uma experiência de descoberta visual com efeito “uau”.
- Aumentar o engajamento dos participantes com o mosaico.
- Incentivar compartilhamentos em redes sociais.
- Dar visibilidade ao projeto **RPC Priority Protocol**.

---

## 3. Nome, domínio e posicionamento

### 3.1 Nome público

**Mosaico Solana Hackathon**

### 3.2 Assinatura

**Powered by RPC Priority Protocol Project**

### 3.3 Subdomínio recomendado

Recomendação principal:

```txt
mosaic.rpcpriorityprotocol.com
```

Motivos:

- Curto.
- Internacional.
- Fácil de lembrar.
- Direto para o conceito visual.
- Reforça o projeto RPC Priority Protocol sem parecer site oficial da Solana.

### 3.4 Alternativas de subdomínio

| Subdomínio | Avaliação |
|---|---|
| `mosaic.rpcpriorityprotocol.com` | Melhor opção geral |
| `find.rpcpriorityprotocol.com` | Muito direto e funcional |
| `hackathon.rpcpriorityprotocol.com` | Bom para evento específico |
| `logos.rpcpriorityprotocol.com` | Claro, mas menos elegante |
| `findmylogo.rpcpriorityprotocol.com` | Descritivo, porém longo |
| `mosaic.assistent.top` | Bom para MVP rápido usando domínio já existente |

### 3.5 Recomendação estratégica

Evitar usar `solana.rpcpriorityprotocol.com` como domínio principal, pois pode gerar interpretação de vínculo oficial com a Solana. O termo Solana pode aparecer no título da página e na comunicação do evento, mas o subdomínio mais seguro e elegante é:

```txt
mosaic.rpcpriorityprotocol.com
```

---

## 4. Público-alvo

- Participantes do hackathon.
- Fundadores de projetos Web3.
- Desenvolvedores do ecossistema Solana.
- Times inscritos no evento.
- Investidores e jurados.
- Visitantes e comunidade interessada.
- Pessoas que desejam compartilhar que seu projeto está no mosaico.

---

## 5. Problema

Mosaicos de eventos com centenas ou milhares de logos são visualmente interessantes, mas tornam difícil para cada participante encontrar rapidamente seu próprio projeto.

Essa dificuldade reduz:

- engajamento com a imagem;
- compartilhamento orgânico;
- percepção de pertencimento ao evento;
- tempo de interação com a marca do hackathon e dos projetos envolvidos.

---

## 6. Solução proposta

Uma landing interativa onde o participante:

1. Entra no site.
2. Visualiza o mosaico completo.
3. Faz upload de um recorte da sua logo.
4. O sistema processa a imagem.
5. A logo é localizada no mosaico.
6. O site move suavemente o foco para a região encontrada.
7. Uma seta animada aponta para a logo.
8. Um glow pulsante destaca a área.
9. O usuário pode visualizar o zoom, baixar ou compartilhar o resultado.

---

## 7. Experiência desejada — Opção B

A experiência deve parecer premium, moderna e alinhada ao universo Web3.

### 7.1 Comportamento visual ideal

Após o upload:

1. O botão muda para estado de carregamento.
2. Mensagem exibida: **Scanning the mosaic...**
3. O backend retorna as coordenadas.
4. O mosaico faz uma transição suave para a região encontrada.
5. Surge uma seta animada apontando para a logo.
6. Um círculo ou retângulo neon pulsa ao redor da logo.
7. Um card lateral mostra o zoom da região encontrada.
8. O usuário pode baixar a imagem final ou tentar novamente.

### 7.2 Elementos visuais principais

- Seta animada com movimento de bounce.
- Círculo ou retângulo pulsante.
- Glow neon.
- Zoom cinematográfico.
- Card de resultado.
- Botão de download.
- Botão de nova busca.
- Rodapé com assinatura do RPC Priority Protocol.

---

## 8. Escopo do MVP

### 8.1 Funcionalidades obrigatórias

| Código | Funcionalidade | Descrição |
|---|---|---|
| RF01 | Exibir mosaico | O site deve carregar o mosaico oficial em alta resolução. |
| RF02 | Upload de logo | O usuário deve enviar um recorte da logo. |
| RF03 | Preview da logo | O sistema deve exibir a imagem enviada antes do processamento. |
| RF04 | Processar imagem | O backend deve comparar a logo enviada com o mosaico. |
| RF05 | Retornar coordenadas | A API deve retornar posição, dimensão e confiança da correspondência. |
| RF06 | Destacar logo | O frontend deve aplicar seta animada e glow sobre a posição encontrada. |
| RF07 | Zoom da região | O sistema deve exibir um recorte ampliado da área encontrada. |
| RF08 | Nova busca | O usuário deve conseguir enviar outra logo sem recarregar a página. |
| RF09 | Download do resultado | O usuário deve conseguir baixar uma imagem com destaque visual. |
| RF10 | Erro amigável | Se não encontrar, o sistema deve orientar o usuário a enviar um recorte melhor. |

---

## 9. Funcionalidades fora do MVP

Funcionalidades que podem entrar depois:

- Login de usuários.
- Ranking de projetos buscados.
- Galeria pública de resultados.
- Integração com X/Twitter.
- Busca por nome do projeto.
- Upload de múltiplas logos.
- Histórico de buscas.
- Versão white-label para outros eventos.
- API pública para organizadores.

---

## 10. Textos principais da interface

### 10.1 Headline

```txt
Find your logo in the Solana Hackathon Mosaic
```

### 10.2 Subheadline

```txt
Upload a crop of your project logo and instantly discover where it appears.
```

### 10.3 CTA principal

```txt
Find My Logo
```

### 10.4 Upload

```txt
Upload your logo crop
```

### 10.5 Loading

```txt
Scanning the mosaic...
```

### 10.6 Sucesso

```txt
Logo found!
Your project is here.
```

### 10.7 Baixa confiança

```txt
We couldn't find a reliable match.
Try uploading a clearer crop of your logo.
```

### 10.8 Rodapé

```txt
Powered by RPC Priority Protocol Project
```

---

## 11. Layout da página

### 11.1 Estrutura geral

Página única com as seguintes seções:

1. Header minimalista.
2. Hero com título, subtítulo e CTA.
3. Área principal com mosaico.
4. Painel de upload/resultado.
5. Zoom da área encontrada.
6. Rodapé com assinatura.

### 11.2 Layout desktop

```txt
+---------------------------------------------------------+
| Header: Mosaico Solana Hackathon                       |
+---------------------------------------------------------+
| Hero: título + subtítulo + CTA                         |
+---------------------------------------------------------+
|                                                         |
|  [ Mosaico interativo grande ]   [ Upload / Resultado ] |
|                                                         |
+---------------------------------------------------------+
| Powered by RPC Priority Protocol Project               |
+---------------------------------------------------------+
```

### 11.3 Layout mobile

```txt
+------------------------------+
| Título                       |
| Subtítulo                    |
| Upload                       |
| Mosaico                      |
| Resultado / Zoom             |
| Rodapé                       |
+------------------------------+
```

---

## 12. Identidade visual

### 12.1 Estilo

- Dark mode.
- Estética Web3.
- Visual tecnológico.
- Neon elegante.
- Interface limpa.
- Baixa fricção.

### 12.2 Paleta sugerida

```txt
Background: #050510
Primary: #14F195
Secondary: #9945FF
Accent: #00D4FF
Text: #FFFFFF
Muted: #A1A1AA
Danger/Error: #FF4D6D
Success: #14F195
```

### 12.3 Componentes visuais

- Cards com borda sutil.
- Efeito glassmorphism moderado.
- Botões com gradiente discreto.
- Animações suaves.
- Seta neon.
- Glow pulsante.
- Feedback visual claro.

---

## 13. Arquitetura técnica recomendada

### 13.1 Frontend

```txt
Next.js
React
Tailwind CSS
Framer Motion
React Dropzone
Canvas ou HTML overlay
```

### 13.2 Backend

```txt
Python
FastAPI
OpenCV
Pillow
NumPy
Uvicorn
```

### 13.3 Infraestrutura

Opção alinhada ao padrão operacional:

```txt
Docker Compose
Traefik
Portainer
VPS
```

### 13.4 Serviços sugeridos

```txt
mosaic-frontend
mosaic-api
```

### 13.5 Domínios sugeridos

```txt
mosaic.rpcpriorityprotocol.com
api-mosaic.rpcpriorityprotocol.com
```

Também é possível usar apenas um domínio, roteando API por path:

```txt
mosaic.rpcpriorityprotocol.com/api
```

---

## 14. Arquitetura lógica

```txt
Usuário
  ↓
Frontend Next.js
  ↓ upload da logo
API FastAPI
  ↓
OpenCV compara logo x mosaico
  ↓
API retorna coordenadas e confiança
  ↓
Frontend renderiza seta animada + destaque
  ↓
Usuário baixa ou compartilha resultado
```

---

## 15. Estratégia de detecção visual

### 15.1 Fase 1 — MVP

Usar **OpenCV Template Matching multiescala**.

Técnica base:

```txt
cv2.matchTemplate()
```

Busca em escalas:

```txt
0.5x até 2.0x
```

Objetivo: permitir encontrar logos mesmo quando o recorte enviado tem tamanho diferente da versão no mosaico.

### 15.2 Fase 2 — Melhor precisão

Adicionar técnicas complementares:

```txt
ORB / Feature Matching
```

Objetivo: aumentar robustez em casos de compressão, pequenas distorções ou variação de fundo.

### 15.3 Fase 3 — IA visual

Adicionar embeddings visuais:

```txt
CLIP embeddings
```

Objetivo: encontrar logos por similaridade semântica/visual mesmo com variações mais significativas.

### 15.4 Recomendação prática

Para o evento, iniciar com OpenCV multiescala. Se a acurácia ficar abaixo do esperado nos testes reais, adicionar abordagem complementar com ORB ou embeddings.

---

## 16. API

### 16.1 Endpoint — Buscar logo

```http
POST /api/find-logo
```

#### Request

```txt
multipart/form-data
file: logo.png
```

#### Response — sucesso

```json
{
  "success": true,
  "found": true,
  "confidence": 0.93,
  "position": {
    "x": 1714,
    "y": 1082,
    "width": 33,
    "height": 33,
    "centerX": 1730,
    "centerY": 1098
  },
  "message": "Logo found"
}
```

#### Response — baixa confiança

```json
{
  "success": true,
  "found": false,
  "confidence": 0.41,
  "message": "We could not find a reliable match. Try uploading a clearer crop."
}
```

---

### 16.2 Endpoint — Gerar imagem compartilhável

```http
POST /api/generate-share-image
```

#### Request

```json
{
  "x": 1714,
  "y": 1082,
  "width": 33,
  "height": 33
}
```

#### Response

```json
{
  "success": true,
  "imageUrl": "/results/result-abc123.png"
}
```

---

## 17. Modelo de dados

O MVP não exige banco de dados.

Para analytics opcional, pode-se registrar apenas metadados, sem guardar os uploads.

### 17.1 Tabela opcional: searches

```sql
CREATE TABLE searches (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  found BOOLEAN NOT NULL,
  confidence NUMERIC(5, 4),
  processing_time_ms INTEGER,
  ip_hash TEXT,
  user_agent TEXT
);
```

### 17.2 Política recomendada

- Não armazenar a imagem enviada permanentemente.
- Apagar uploads temporários após o processamento.
- Armazenar apenas métricas agregadas.

---

## 18. Requisitos não funcionais

### 18.1 Performance

- Tempo ideal de resposta: até 5 segundos.
- Tempo aceitável: até 10 segundos em alta carga.
- Mosaico otimizado para web.
- Backend com cache da imagem base carregada em memória.

### 18.2 Segurança

- Validar tipo real do arquivo.
- Limitar upload a 5 MB.
- Aceitar apenas PNG, JPG, JPEG e WEBP.
- Rate limit por IP.
- Sanitizar nomes de arquivos.
- Apagar arquivos temporários.

### 18.3 Privacidade

- Informar que o upload é usado apenas para localizar a logo.
- Não manter imagens enviadas após o processamento.
- Não exigir login.
- Não coletar dados pessoais.

### 18.4 Compatibilidade

- Chrome.
- Safari.
- Firefox.
- Edge.
- Desktop e mobile.

---

## 19. Métricas de sucesso

### 19.1 Métricas principais

- Número de buscas realizadas.
- Percentual de logos encontradas.
- Tempo médio de processamento.
- Taxa de erro.
- Número de downloads.
- Número de compartilhamentos.
- Taxa de repetição de busca.

### 19.2 Metas para o evento

```txt
Taxa de sucesso acima de 80%
Tempo médio abaixo de 5 segundos
Experiência visual compartilhável
Baixa necessidade de suporte humano
```

---

## 20. Critérios de aceite

O MVP será considerado aprovado quando:

1. O site carregar o mosaico corretamente.
2. O usuário conseguir enviar um recorte da logo.
3. O sistema processar o upload sem erro.
4. O backend retornar coordenadas e confiança.
5. A seta animada apontar corretamente para a logo.
6. O glow pulsante destacar a região correta.
7. O zoom da área encontrada for exibido.
8. O usuário conseguir baixar o resultado.
9. O usuário conseguir fazer nova busca.
10. O site funcionar bem em desktop e mobile.
11. O deploy estiver disponível no subdomínio definido.

---

## 21. Roadmap

### 21.1 Versão 0.1 — MVP técnico

Prazo estimado: 1 dia

Entregas:

- estrutura do projeto;
- mosaico fixo;
- upload da logo;
- busca com OpenCV;
- retorno de coordenadas;
- destaque visual simples.

### 21.2 Versão 0.2 — Experiência bonita

Prazo estimado: 2 a 3 dias

Entregas:

- seta animada;
- glow pulsante;
- zoom automático;
- layout premium;
- responsividade mobile.

### 21.3 Versão 0.3 — Compartilhamento

Prazo estimado: 1 a 2 dias

Entregas:

- geração de imagem final;
- botão de download;
- assinatura do RPC Priority Protocol;
- analytics básico.

### 21.4 Versão 1.0 — Evento

Prazo total estimado: 3 a 7 dias

Entregas:

- deploy final;
- domínio/subdomínio configurado;
- testes com logos reais;
- otimização de performance;
- tratamento de erros;
- rate limit.

---

## 22. Estrutura de pastas recomendada

```txt
solana-mosaic-finder/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   │   └── mosaic.png
│   ├── package.json
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   │   └── logo_matcher.py
│   │   └── utils/
│   ├── assets/
│   │   └── mosaic_original.png
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 23. Deploy recomendado

### 23.1 Opção rápida

```txt
Frontend: Vercel
Backend: Render ou Railway
```

### 23.2 Opção recomendada para controle total

```txt
VPS + Docker Compose + Traefik + Portainer
```

### 23.3 Serviços Docker

```txt
mosaic-frontend
mosaic-api
```

### 23.4 Redes Docker

```txt
mosaic-net
portainer_traefik_public
```

### 23.5 Subdomínios

```txt
mosaic.rpcpriorityprotocol.com
api-mosaic.rpcpriorityprotocol.com
```

---

## 24. Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Logo enviada diferente da versão no mosaico | Busca pode falhar | Instruções claras, multiescala e nova tentativa |
| Falso positivo | Usuário vê local errado | Usar score mínimo e exibir confiança |
| Mosaico muito pesado | Lentidão | Otimizar imagem web e usar original só no backend |
| Alto volume de acessos | Backend lento | Rate limit, cache e backend separado |
| Upload malicioso | Risco de segurança | Validar arquivo, limitar tamanho e apagar temporários |
| Uso de marca Solana | Risco de confusão institucional | Usar Solana apenas como referência ao hackathon, com assinatura própria do projeto |

---

## 25. Decisões técnicas recomendadas

| Tema | Decisão |
|---|---|
| Frontend | Next.js + Tailwind + Framer Motion |
| Backend | FastAPI + OpenCV + Pillow |
| Detecção inicial | Template Matching multiescala |
| Animação | Overlay no frontend, não GIF gerado no backend |
| Download | Gerar imagem final via Canvas ou API |
| Banco de dados | Não necessário no MVP |
| Domínio | `mosaic.rpcpriorityprotocol.com` |
| Deploy | Docker Compose + Traefik em VPS |

---

## 26. Prompt de posicionamento

### English version

```txt
Mosaico Solana Hackathon is an interactive visual experience powered by RPC Priority Protocol Project. Participants can upload a crop of their project logo and instantly discover where it appears in the event mosaic, with animated highlights, zoom, and shareable results.
```

### Versão em português

```txt
Mosaico Solana Hackathon é uma experiência visual interativa, powered by RPC Priority Protocol Project, que permite aos participantes enviar um recorte da sua logo e descobrir instantaneamente onde ela aparece no mosaico do evento, com destaque animado, zoom e resultado compartilhável.
```

---

## 27. Conclusão

O **Mosaico Solana Hackathon — Powered by RPC Priority Protocol Project** é uma solução simples, rápida e com alto potencial de engajamento para o evento.

A proposta une utilidade prática, experiência visual diferenciada e posicionamento estratégico do RPC Priority Protocol dentro do ecossistema Web3.

A recomendação é desenvolver primeiro o MVP com OpenCV e experiência visual premium no frontend. Em seguida, validar com o mosaico real e alguns recortes de logos antes da publicação final.

**Subdomínio recomendado:**

```txt
mosaic.rpcpriorityprotocol.com
```

**Stack recomendada:**

```txt
Next.js + FastAPI + OpenCV + Docker + Traefik
```

**Experiência recomendada:**

```txt
Seta animada + glow pulsante + zoom suave + resultado compartilhável
```
