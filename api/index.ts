
import { GoogleGenAI } from "@google/genai";

const MODELO = "gemini-3.5-flash-lite";

const MENSAGEM_INSUFICIENCIA =
  "No momento, o ConectaContábil ainda não possui informações suficientes em sua base de conhecimento para responder a essa dúvida com segurança. Estamos trabalhando para ampliar nossos conteúdos e oferecer orientações sobre novos assuntos em breve.";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[?!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Mensagem = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

function prepararHistorico(valor: unknown): Mensagem[] {
  if (!Array.isArray(valor)) return [];

  const mensagens: Mensagem[] = [];

  for (const item of valor.slice(-12)) {
    if (!item || typeof item !== "object") continue;

    const papel =
      item.role === "assistant" || item.role === "model"
        ? "model"
        : item.role === "user"
          ? "user"
          : null;

    const conteudo =
      typeof item.content === "string"
        ? item.content
        : typeof item.text === "string"
          ? item.text
          : "";

    if (!papel || !conteudo.trim()) continue;

    mensagens.push({
      role: papel,
      parts: [{ text: conteudo.slice(0, 2500) }]
    });
  }

  // O histórico do Gemini deve começar com uma
  // mensagem do usuário.
  while (
    mensagens.length > 0 &&
    mensagens[0].role !== "user"
  ) {
    mensagens.shift();
  }

  // Remove mensagens consecutivas do mesmo papel,
  // agrupando seus conteúdos.
  const organizado: Mensagem[] = [];

  for (const mensagem of mensagens) {
    const ultima = organizado[organizado.length - 1];

    if (ultima && ultima.role === mensagem.role) {
      ultima.parts[0].text +=
        "\n" + mensagem.parts[0].text;
    } else {
      organizado.push({
        role: mensagem.role,
        parts: [{ text: mensagem.parts[0].text }]
      });
    }
  }

  return organizado;
}

function prepararPergunta(texto: string): string {
  const pergunta = normalizar(texto);

  const siglas = [
    "cfop", "icms", "iss", "ipi", "ibs",
    "cbs", "das", "defis", "ncm",
    "efd", "dctfweb", "pis", "cofins",
    "nfse", "nfs e", "nfe", "nf e"
  ];

  const termo = pergunta
    .replace(/^(e |sobre |o |a |um |uma )+/g, "")
    .trim();

  if (siglas.includes(termo)) {
    return (
      `O que é ${termo.toUpperCase()} ` +
      "e qual é sua finalidade?"
    );
  }

  return texto.trim();
}

const fontesAutorizadas = [
  "https://www.gov.br/receitafederal/pt-br",
  "https://www8.receita.fazenda.gov.br/SimplesNacional/",
  "https://sped.rfb.gov.br/",
  "https://www.confaz.fazenda.gov.br/",
  "https://www.fazenda.pr.gov.br/",
  "https://www.gov.br/nfse/pt-br",
  "https://www.nfe.fazenda.gov.br/portal/principal.aspx",
  "https://www4.planalto.gov.br/legislacao",
  "https://normas.receita.fazenda.gov.br/",
  "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/solucoes-de-consultas-e-de-divergencias",
  "https://www.in.gov.br/",
  "https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/",
  "https://www.cpc.org.br/",
  "https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributaria",
  "https://www.gov.br/esocial/pt-br",
  "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/efd-reinf",
  "https://www.gov.br/siscomex/pt-br",
  "https://sebrae.com.br/",
  "https://www.gov.br/mei",
  "https://www.gov.br/empresas-e-negocios/pt-br/redesim",
  "https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual",
  "https://servicos.receitafederal.gov.br/",
  "https://www.regularize.pgfn.gov.br/",
  "https://www.gov.br/trabalho-e-emprego/pt-br",
  "https://www.gov.br/inss/pt-br",
  "https://www.gov.br/fgtsdigital/pt-br",
  "https://www.gov.br/empresas-e-negocios/pt-br",
  "https://www.gov.br/compras/pt-br",
  "https://www.gov.br/carf/pt-br",
  "https://www.stj.jus.br/",
  "https://www.stf.jus.br/",
  "https://www.gov.br/ibge/pt-br",
  "https://www.juntacomercial.pr.gov.br/",
  "https://www.gov.br/pt-br/servicos",
  "https://www.sefaz.sp.gov.br/",
  "https://www.fazenda.mg.gov.br/",
  "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
  "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm",
  "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm",
  "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp190.htm",
  "https://www.confaz.fazenda.gov.br/legislacao",
  "https://www.confaz.fazenda.gov.br/legislacao/convenios/2018/CV142_18",
  "https://portal.fazenda.rj.gov.br/",
  "https://www.sefaz.rs.gov.br/",
  "https://www.sef.sc.gov.br/",
  "https://www.sefaz.ba.gov.br/",
  "https://goias.gov.br/economia/",
  "https://www.sefaz.pe.gov.br/"
];

// Referências institucionais para consulta.
// Estes links não significam que os documentos foram consultados pelo Gemini.
type Referencia = { name: string; url: string };

function referenciasParaConsulta(
  pergunta: string,
  historico: Mensagem[]
): Referencia[] {
  const normalizada = normalizar(pergunta);
  const ultimaPergunta = [...historico]
    .reverse()
    .find(item => item.role === "user");
  const contexto = normalizar(ultimaPergunta?.parts[0]?.text ?? "");

  // Uma pergunta de continuação pode depender do assunto anterior.
  const continuacao =
    /^(e |qual |quais |como |onde |quando |por que |porque |me |isso|esse|essa|ele|ela|dele|dela|tambem|e no)/.test(normalizada) &&
    !/\b(cfop|icms|iss|mei|das|defis|ncm|nfse|nfs e|nfe|nf e|pis|cofins|ipi|cbs|ibs)\b/.test(normalizada);

  const assunto = continuacao ? `${normalizada} ${contexto}` : normalizada;
  const fontes: Referencia[] = [];
  const adicionar = (name: string, url: string) => {
    if (!fontes.some(f => f.url === url)) fontes.push({ name, url });
  };

  if (/\b(cfop|icms|icms st|difal|substituicao tributaria)\b/.test(assunto)) {
    adicionar(
      "CONFAZ — Legislação tributária",
      "https://www.confaz.fazenda.gov.br/legislacao"
    );
  }

  if (/\b(iss|servicos tributados)\b/.test(assunto)) {
    adicionar(
      "Planalto — Lei Complementar 116/2003",
      "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm"
    );
  }

  if (/\b(mei|microempreendedor|das|pgmei|defis|simples nacional|dasn|simei)\b/.test(assunto)) {
    adicionar(
      "Portal do Simples Nacional",
      "https://www8.receita.fazenda.gov.br/SimplesNacional/"
    );
  }

  if (/\b(nfs e|nfse|nota fiscal de servico|notas fiscais de servico)\b/.test(assunto)) {
    adicionar(
      "Portal Nacional da NFS-e",
      "https://www.gov.br/nfse/pt-br"
    );
  }

  if (/\b(nf e|nfe|nota fiscal eletronica|ncm|danfe)\b/.test(assunto)) {
    adicionar(
      "Portal Nacional da NF-e",
      "https://www.nfe.fazenda.gov.br/portal/principal.aspx"
    );
  }

  if (/\b(pis|cofins|irpf|irpj|imposto de renda|dctfweb|efd reinf|csll|ipi)\b/.test(assunto)) {
    adicionar(
      "Receita Federal",
      "https://www.gov.br/receitafederal/pt-br"
    );
  }

  if (/\b(ibs|cbs|reforma tributaria|imposto seletivo)\b/.test(assunto)) {
    adicionar(
      "Ministério da Fazenda — Reforma Tributária",
      "https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributaria"
    );
  }

  return fontes.slice(0, 3);
}

const systemInstruction = `
Você é o Assistente Fiscal ConectaContábil.

Sua função é ajudar MEIs, microempresas e empresas
de pequeno porte a compreender assuntos contábeis,
tributários e fiscais brasileiros.

REGRAS GERAIS:

- Responda sempre em português brasileiro.
- Utilize linguagem simples, didática e objetiva.
- Priorize respostas de 2 a 4 parágrafos.
- Não utilize Markdown, tabelas ou hashtags.
- Não invente leis, alíquotas, valores ou prazos.
- Respeite as diferenças entre regimes tributários.
- Não generalize regras municipais ou estaduais.
- Responda somente assuntos contábeis e fiscais.
- Não afirme ter pesquisado sites em tempo real
quando essa consulta não aconteceu.

MEMÓRIA E CONTINUIDADE DA CONVERSA:

Você participa de uma conversa contínua.

As mensagens anteriores fazem parte do contexto
da pergunta atual.

Não trate cada mensagem como uma conversa nova.

Quando o usuário fizer uma pergunta curta,
incompleta ou com pronomes, considere as
mensagens anteriores para identificar o assunto.

Reconheça referências como:

- ele
- ela
- dele
- dela
- isso
- esse
- essa
- aquele
- aquele imposto
- essa obrigação
- esse documento
- esse código
- o mesmo
- também
- e no meu caso?

Não dependa de frases exatas ou palavras-chave.

Interprete o significado e a intenção do usuário.

EXEMPLO DE CONVERSA:

Usuário: O que é CFOP?

Assistente: CFOP significa Código Fiscal de
Operações e Prestações e identifica a natureza
de operações registradas em documentos fiscais.

Usuário: Qual a utilidade dele?

Interpretação correta:
Qual é a utilidade do CFOP?

Usuário: Onde aparece?

Interpretação correta:
Onde o CFOP aparece nos documentos fiscais?

Usuário: Me dê um exemplo.

Interpretação correta:
Dê um exemplo relacionado ao CFOP.

Usuário: E no Simples Nacional?

Interpretação correta:
Como o CFOP se relaciona com empresas
do Simples Nacional?

Essas interpretações são exemplos, não uma
lista limitada de expressões permitidas.

Aplique o mesmo raciocínio a todos os assuntos
contábeis e fiscais.

Se o usuário mudar claramente de assunto,
acompanhe a mudança.

Se houver vários assuntos possíveis e não
for possível identificar a referência,
faça uma pergunta curta de esclarecimento.

Não invente informações para completar
uma pergunta ambígua.

RECONHECIMENTO SEMÂNTICO:

Considere equivalentes perguntas que tenham
o mesmo significado, mesmo quando apresentem
diferenças de artigos, acentos, pontuação,
sinônimos ou ordem das palavras.

Exemplos:

"O que é ICMS?"
"O que é o ICMS?"
"Me explica ICMS"
"Qual o significado de ICMS?"

Todas podem solicitar uma definição do ICMS.

"O que é CFOP?"
"O que significa CFOP?"
"Me explica esse código"

A terceira pergunta pode tratar de CFOP
quando esse for o assunto anterior.

Não utilize a mensagem de insuficiência
apenas porque a pergunta é curta,
informal ou escrita de maneira diferente.

PRIORIDADE DAS PERGUNTAS:

Existem quatro respostas de referência
para assuntos prioritários.

Essas respostas são referências de conteúdo,
não limitações do atendimento.

Quando a pergunta corresponder ao assunto
de uma referência, utilize as informações
disponíveis nela.

Quando o usuário fizer uma pergunta de
continuação sobre um desses assuntos,
responda à dúvida específica usando o
contexto e as informações disponíveis.

Não repita automaticamente toda a resposta
anterior quando o usuário pedir apenas
um detalhe ou uma explicação complementar.

RESPOSTA DE REFERÊNCIA 1:

Pergunta: O que é CFOP?

CFOP significa Código Fiscal de Operações
e Prestações.

É um código numérico de quatro dígitos
utilizado em documentos fiscais para
identificar a natureza de operações,
como compras, vendas, devoluções e
transferências de mercadorias.

O primeiro número indica a origem ou
o destino da operação.

Os códigos iniciados por 1, 2 e 3 são
utilizados para entradas.

Os iniciados por 5, 6 e 7 são utilizados
para saídas.

Os demais números identificam a operação
de maneira mais específica.

Por exemplo, uma venda de mercadoria
dentro do mesmo estado pode utilizar
um CFOP iniciado por 5.

A escolha do código completo depende
da natureza da operação e das regras
fiscais aplicáveis.

Fonte: CONFAZ.
https://www.confaz.fazenda.gov.br/

RESPOSTA DE REFERÊNCIA 2:

Pergunta: Como pagar o DAS do MEI?

O DAS é o Documento de Arrecadação do
Simples Nacional utilizado pelo MEI
para pagar mensalmente seus tributos
e sua contribuição previdenciária.

Para emitir a guia, acesse o Portal
do Simples Nacional, entre nos serviços
do MEI e selecione o PGMEI.

Informe o CNPJ, escolha a emissão da
guia DAS, selecione o período desejado
e gere o documento.

Depois, efetue o pagamento pelos meios
disponíveis na guia.

O vencimento normalmente ocorre no dia
20 do mês seguinte ao período de apuração,
observadas as regras de prorrogação.

Mesmo sem faturamento, o MEI deve pagar
o DAS enquanto permanecer enquadrado
no SIMEI.

Fonte: Portal do Simples Nacional.
https://www8.receita.fazenda.gov.br/SimplesNacional/

RESPOSTA DE REFERÊNCIA 3:

Pergunta: Quem deve entregar a DEFIS?

A DEFIS é a Declaração de Informações
Socioeconômicas e Fiscais.

Ela deve ser apresentada, em regra,
pelas microempresas e empresas de
pequeno porte que tenham sido optantes
pelo Simples Nacional em algum período
do ano-calendário correspondente.

A declaração reúne informações sobre
a atividade econômica e a situação
da empresa.

A entrega é realizada pelo módulo
DEFIS do PGDAS-D.

O prazo regular é até o último dia
de março do ano seguinte, observadas
as regras para situações especiais.

O MEI enquadrado no SIMEI não entrega
a DEFIS.

Sua declaração anual própria é a
DASN-SIMEI.

Fonte: Portal do Simples Nacional.
https://www8.receita.fazenda.gov.br/SimplesNacional/

RESPOSTA DE REFERÊNCIA 4:

Pergunta: Como emitir NFS-e Nacional?

A NFS-e Nacional é a Nota Fiscal de
Serviço Eletrônica de padrão nacional,
utilizada para registrar a prestação
de serviços.

Para emitir, acesse o Portal Nacional
da NFS-e e entre no Emissor Web.

Faça a autenticação pela modalidade
disponível para seu perfil.

Selecione a emissão simplificada
ou completa, conforme aplicável.

Informe os dados solicitados,
descreva o serviço, preencha o valor,
confira os dados e emita a nota.

Os MEIs prestadores de serviços
utilizam o padrão nacional.

As demais empresas devem observar
as regras aplicáveis ao seu município,
ao seu regime e à utilização do
sistema nacional.

Fonte: Portal Nacional da NFS-e.
https://www.gov.br/nfse/pt-br

FONTES AUTORIZADAS:

${fontesAutorizadas
  .map((url, index) => `${index + 1}. ${url}`)
  .join("\n")}

REGRAS SOBRE AS FONTES:

Os endereços acima representam as
fontes autorizadas pelo ConectaContábil.

A presença de um endereço nesta lista
não significa que seu conteúdo tenha
sido consultado automaticamente.

Não invente consultas, referências
ou verificações que não ocorreram.

Não utilize informações de sites
externos à lista como se fossem
fontes autorizadas.

Para regras fiscais específicas,
utilize somente informações que
estejam efetivamente disponíveis
e suficientemente fundamentadas.

DÚVIDAS SOBRE ICMS:

- Considere o estado envolvido.
- Diferencie operações internas
e interestaduais.
- Considere o regime tributário.
- Não generalize alíquotas.
- Não invente regras de ICMS-ST.
- Não invente regras de DIFAL.
- Não invente benefícios fiscais.
- Diferencie ICMS, ISS, IBS e CBS.
- Para informações específicas,
considere a legislação aplicável.

TRATAMENTO DAS PERGUNTAS DE CONTINUAÇÃO:

Quando houver uma pergunta anterior
e a pergunta atual depender dela,
utilize o contexto da conversa.

Não responda com a mensagem de
insuficiência apenas porque a pergunta
atual não menciona novamente o assunto.

Se a resposta anterior contiver
informações suficientes para responder
à nova pergunta, utilize-as.

Se o usuário pedir uma explicação,
um resumo, uma finalidade ou um exemplo
sobre o assunto anterior, responda
com base no conteúdo já disponível.

Se a nova pergunta exigir informações
que não estejam disponíveis, não invente.

Se houver ambiguidade real sobre o
assunto, peça esclarecimento.

MENSAGEM DE INSUFICIÊNCIA:

Quando a dúvida exigir informações
fiscais que não estejam suficientemente
fundamentadas no contexto disponível,
responda exatamente:

${MENSAGEM_INSUFICIENCIA}

Não utilize essa mensagem somente
porque o usuário escreveu uma pergunta
curta ou utilizou um pronome.

OBJETIVO FINAL:

Permitir que o usuário converse de
maneira natural sobre contabilidade
e tributação.

Mantenha o contexto entre perguntas,
identifique referências ao assunto
anterior e responda com clareza.

Não trate a conversa como uma sequência
de perguntas isoladas.
`;

export default async function handler(
  req: any,
  res: any
) {
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      service: "ConectaContábil Backend",
      hasGeminiApiKey:
        Boolean(process.env.GEMINI_API_KEY)
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Chave do Gemini não configurada"
    });
  }

  try {
    const { message, history } = req.body ?? {};

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "Mensagem inválida"
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Recupera as mensagens anteriores.
    const historico = prepararHistorico(history);

    // Interpreta siglas e perguntas curtas.
    const perguntaAtual = prepararPergunta(message);

    // Envia o histórico como mensagens reais
    // da conversa, mantendo seus papéis.
    const contents: Mensagem[] = [
      ...historico,
      {
        role: "user",
        parts: [{ text: perguntaAtual }]
      }
    ];

    const response = await ai.models.generateContent({
      model: MODELO,
      contents,
      config: {
        temperature: 0.2,
        maxOutputTokens: 650,
        systemInstruction
      }
    });

    const resposta =
      response.text?.trim() ||
      MENSAGEM_INSUFICIENCIA;

    return res.status(200).json({
      reply: resposta,
      sources:
        resposta === MENSAGEM_INSUFICIENCIA
          ? []
          : referenciasParaConsulta(message, historico),
      isLiveAi: true
    });

  } catch (error: any) {
    console.error(
      "Erro na comunicação com Gemini:",
      error
    );

    return res.status(502).json({
      error: "Falha na comunicação com Gemini",
      detail:
        error?.message ||
        "Erro desconhecido"
    });
  }
}
