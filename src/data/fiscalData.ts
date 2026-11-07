import { 
  FiscalObligation, 
  FiscalOrientation, 
  FAQItem, 
  CompanyProfile, 
  AlertPreferences 
} from '../types';

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  id: 'company-01',
  ownerName: 'Mariana Silva Souza',
  tradeName: 'Silva & Souza Consultoria e Serviços ME',
  cnpj: '48.912.345/0001-90',
  structure: 'ME',
  regime: 'Simples Nacional',
  sector: 'Serviços',
  state: 'SP',
  city: 'São Paulo'
};

export const INITIAL_ALERT_PREFERENCES: AlertPreferences = {
  sevenDaysBefore: true,
  threeDaysBefore: true,
  oneDayBefore: true,
  onDueDate: true,
};

// Generates dynamic realistic dates for the current and adjacent months
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0-indexed

function formatDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export const INITIAL_OBLIGATIONS: FiscalObligation[] = [
  {
    id: 'ob-das-mei-01',
    name: 'DAS-MEI (Documento de Arrecadação do MEI)',
    description: 'Guia única mensal para recolhimento dos tributos do Microempreendedor Individual (INSS + ICMS e/ou ISS). Vencimento no dia 20.',
    dueDate: formatDate(currentYear, currentMonth, 20),
    status: 'Pendente',
    category: 'federal',
    applicableRegime: 'MEI',
    officialSource: 'Receita Federal — Portal do Empreendedor',
    officialUrl: 'https://www.gov.br/mei',
    isCustom: false,
    estimatedValue: 75.60,
  },
  {
    id: 'ob-das-sn-02',
    name: 'DAS Simples Nacional (ME e EPP)',
    description: 'Guia única de recolhimento dos tributos unificados do Simples Nacional relativa ao faturamento do mês anterior.',
    dueDate: formatDate(currentYear, currentMonth, 20),
    status: 'Em andamento',
    category: 'federal',
    applicableRegime: 'Simples Nacional',
    officialSource: 'Receita Federal — Portal do Simples Nacional',
    officialUrl: 'https://www8.receita.fazenda.gov.br/SimplesNacional/ConteudoApoio/Manuais/TelaManuais.aspx',
    isCustom: false,
    estimatedValue: 1240.50,
  },
  {
    id: 'ob-dctfweb-03',
    name: 'DCTFWeb Mensal',
    description: 'Declaração de Débitos e Créditos Tributários Federais Previdenciários referente à folha de pagamento e retenções.',
    dueDate: formatDate(currentYear, currentMonth, 15),
    status: 'Pendente',
    category: 'federal',
    applicableRegime: 'ME/EPP',
    officialSource: 'Receita Federal — Manual DCTFWeb',
    officialUrl: 'https://www8.receita.fazenda.gov.br/SimplesNacional/',
    isCustom: false,
  },
  {
    id: 'ob-efdreinf-04',
    name: 'EFD-Reinf (Escrituração Fiscal Digital)',
    description: 'Envio das informações de retenções na fonte (IRRF, PIS, COFINS, CSLL) e pagamentos a prestadores de serviços.',
    dueDate: formatDate(currentYear, currentMonth, 15),
    status: 'Pendente',
    category: 'federal',
    applicableRegime: 'ME/EPP',
    officialSource: 'Receita Federal — Sistema Público de Escrituração Digital (SPED)',
    officialUrl: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/sped-sistema-publico-de-escrituracao-digital/efd-reinf',
    isCustom: false,
  },
  {
    id: 'ob-fgts-05',
    name: 'FGTS Digital',
    description: 'Recolhimento mensal do Fundo de Garantia do Tempo de Serviço dos colaboradores através do portal FGTS Digital.',
    dueDate: formatDate(currentYear, currentMonth, 20),
    status: 'Pendente',
    category: 'trabalhista',
    applicableRegime: 'Todos',
    officialSource: 'Ministério do Trabalho e Emprego — FGTS Digital',
    officialUrl: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital',
    isCustom: false,
  },
  {
    id: 'ob-relatorio-mei-06',
    name: 'Relatório Mensal de Receitas Brutas (MEI)',
    description: 'Preenchimento obrigatório do controle mensal de vendas e prestações de serviços do MEI, anexando notas fiscais de compra e venda.',
    dueDate: formatDate(currentYear, currentMonth, 20),
    status: 'Concluída',
    category: 'declaracao',
    applicableRegime: 'MEI',
    officialSource: 'Portal do Empreendedor — Resolução CGSN nº 140/2018',
    officialUrl: 'https://www.gov.br/mei',
    isCustom: false,
    completedAt: formatDate(currentYear, currentMonth, 5),
  },
  {
    id: 'ob-nfse-07',
    name: 'Emissão e Conferência de NFS-e Nacional',
    description: 'Conferência dos fechamentos das Notas Fiscais de Serviços emitidas no mês pelo Portal Nacional da NFS-e.',
    dueDate: formatDate(currentYear, currentMonth, 10),
    status: 'Concluída',
    category: 'municipal',
    applicableRegime: 'Todos',
    officialSource: 'Portal Nacional da NFS-e',
    officialUrl: 'https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual',
    isCustom: false,
    completedAt: formatDate(currentYear, currentMonth, 8),
  },
  {
    id: 'ob-alvara-08',
    name: 'Taxa de Licença e Funcionamento (TFL / TLF)',
    description: 'Taxa anual cobrada pela Prefeitura Municipal para vistoria e renovação do alvará de funcionamento.',
    dueDate: formatDate(currentYear, currentMonth, 28),
    status: 'Pendente',
    category: 'municipal',
    applicableRegime: 'Todos',
    officialSource: 'Secretaria Municipal da Fazenda',
    officialUrl: 'https://www.gov.br/',
    isCustom: true,
    notes: 'Verificar se município concede isenção para MEI conforme Lei Complementar 123/2006.',
  },
  {
    id: 'ob-defis-09',
    name: 'DEFIS — Declaração Anual de Informações Socioeconômicas',
    description: 'Declaração anual obrigatória para empresas do Simples Nacional (ME e EPP). Prazo regulamentar até 31 de março.',
    dueDate: formatDate(currentYear, 2, 31), // March 31
    status: 'Em andamento',
    category: 'declaracao',
    applicableRegime: 'ME/EPP',
    officialSource: 'Comitê Gestor do Simples Nacional — Resolução CGSN 140/2018',
    officialUrl: 'https://www8.receita.fazenda.gov.br/SimplesNacional/ConteudoApoio/Manuais/TelaManuais.aspx',
    isCustom: false,
  },
  {
    id: 'ob-dasn-simei-10',
    name: 'DASN-SIMEI — Declaração Anual do MEI',
    description: 'Declaração anual informando o faturamento total obtido no ano anterior e se houve contratação de empregado. Prazo limite até 31 de maio.',
    dueDate: formatDate(currentYear, 4, 31), // May 31
    status: 'Pendente',
    category: 'declaracao',
    applicableRegime: 'MEI',
    officialSource: 'Portal do Empreendedor — gov.br/mei',
    officialUrl: 'https://www.gov.br/mei',
    isCustom: false,
  }
];

export const FISCAL_ORIENTATIONS: FiscalOrientation[] = [
  {
    id: 'or-01',
    title: 'O que é o DAS e como pagar em dia',
    category: 'Tributos e impostos',
    summary: 'Documento único que unifica impostos federais, estaduais e municipais para optantes do Simples Nacional e MEI.',
    explanation: 'O DAS (Documento de Arrecadação do Simples Nacional) consolida o recolhimento tributário. Para MEI, tem valor fixo mensal (INSS + ICMS R$ 1,00 ou ISS R$ 5,00). Para ME e EPP, é calculado percentualmente sobre a receita bruta mensal auferida através do sistema PGDAS-D.',
    stepByStep: [
      'Acesse o Portal do Simples Nacional ou aplicativo oficial MEI.',
      'Gere a guia referente à competência do mês anterior.',
      'Efetue o pagamento até o dia 20 do mês via Pix (QR Code na guia), débito automático ou código de barras.',
      'Guarde o comprovante de pagamento por 5 anos.'
    ],
    practicalExample: 'Se sua microempresa faturou R$ 15.000,00 no mês pelo Anexo III de Serviços, o contador apura a alíquota efetiva no PGDAS-D e gera o DAS com vencimento no dia 20.',
    officialSource: 'Receita Federal — Simples Nacional',
    officialUrl: 'https://www8.receita.fazenda.gov.br/SimplesNacional/ConteudoApoio/Manuais/TelaManuais.aspx'
  },
  {
    id: 'or-02',
    title: 'NFS-e Nacional para Microempreendedores Individuais',
    category: 'Notas fiscais',
    summary: 'Procedimento unificado de emissão de Nota Fiscal de Serviços eletrônica padrão nacional obrigatória para MEI.',
    explanation: 'Desde setembro de 2023, todos os MEIs prestadores de serviços são obrigados a emitir notas fiscais pelo Portal Nacional da NFS-e (gov.br/nfse) ou aplicativo NFS-e Mobile, e não mais nos portais municipais individuais.',
    stepByStep: [
      'Cadastre-se no Portal de Gestão Web da NFS-e Nacional com login gov.br (nível Prata ou Ouro).',
      'Configure os Serviços Favoritos e os dados de sua atividade no cadastro.',
      'Na emissão, selecione se o cliente é Pessoa Física ou Jurídica e preencha os dados.',
      'Revise os dados e confirme a emissão. O cliente recebe o documento com chave de acesso e QR Code.'
    ],
    practicalExample: 'Um técnico de informática MEI prestou serviço para uma empresa local no valor de R$ 800,00. Ele acessa gov.br/nfse, insere o CNPJ do cliente e emite a NFS-e em menos de dois minutos sem custos.',
    officialSource: 'Portal Nacional da NFS-e',
    officialUrl: 'https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual'
  },
  {
    id: 'or-03',
    title: 'Relatório Mensal de Receitas Brutas do MEI',
    category: 'Obrigações fiscais',
    summary: 'Controle contínuo das receitas do microempreendedor individual obrigatório por lei.',
    explanation: 'O MEI deve preencher mensalmente, até o dia 20 do mês seguinte, o Relatório Mensal das Receitas Brutas para cada uma das atividades desenvolvidas (comércio, indústria ou prestação de serviços), anexando os comprovantes de compra e venda.',
    stepByStep: [
      'Baixe o modelo oficial fornecido pelo Portal do Empreendedor.',
      'Some os valores das vendas/serviços realizados com nota fiscal e sem nota fiscal.',
      'Preencha o campo correspondente do mês e assine o relatório.',
      'Mantenha arquivado junto às notas de compra por no mínimo 5 anos.'
    ],
    practicalExample: 'Mesmo que o MEI não tenha faturado nada em determinado mês, deve preencher o relatório com valor R$ 0,00 e manter arquivado para respaldar a declaração anual DASN-SIMEI.',
    officialSource: 'Portal do Empreendedor — Resolução CGSN nº 140/2018, Art. 106',
    officialUrl: 'https://www.gov.br/mei'
  },
  {
    id: 'or-04',
    title: 'DASN-SIMEI: Como fazer a declaração anual do MEI',
    category: 'Declarações',
    summary: 'Declaração obrigatória com prazo até o último dia útil de maio de cada ano.',
    explanation: 'A Declaração Anual do Simples Nacional para o MEI (DASN-SIMEI) é a prestação de contas do faturamento bruto obtido no ano anterior. O teto regulamentar é de R$ 81.000,00 anuais (ou proporcional aos meses de atividade).',
    stepByStep: [
      'Acesse o portal do Simples Nacional na opção DASN-SIMEI.',
      'Informe o CNPJ do MEI e o ano-calendário correspondente.',
      'Informe o valor da receita bruta de Comércio/Indústria e Serviços.',
      'Informe se possuiu empregado com carteira assinada no período.',
      'Transmita e imprima o Recibo de Entrega.'
    ],
    practicalExample: 'Se o MEI começou em julho (6 meses no ano), seu teto proporcional é R$ 40.500,00 (6 x R$ 6.750,00). O preenchimento da DASN deve respeitar esse limite para não gerar desenquadramento.',
    officialSource: 'Receita Federal — Portal do Empreendedor',
    officialUrl: 'https://www.gov.br/mei'
  },
  {
    id: 'or-05',
    title: 'Diferença entre MEI, Microempresa (ME) e EPP',
    category: 'Regimes tributários',
    summary: 'Entenda os limites de faturamento, funcionários e responsabilidades legais de cada categoria.',
    explanation: 'MEI tem faturamento de até R$ 81.000/ano e permite até 1 funcionário. ME fatura até R$ 360.000/ano e pode ter sócios e múltiplos empregados. EPP fatura entre R$ 360.000 e R$ 4.800.000/ano. Ambas ME e EPP podem optar pelo Simples Nacional se cumprirem os requisitos da LC 123/2006.',
    stepByStep: [
      'Monitore o faturamento acumulado nos últimos 12 meses.',
      'Caso ultrapasse o teto do MEI em até 20%, o desenquadramento ocorre no ano seguinte.',
      'Caso ultrapasse mais de 20%, o desenquadramento é retroativo e exige assessoria contábil imediata.',
      'Para ME e EPP, conte com contador para envio das escriturações digitais (SPED, DCTFWeb).'
    ],
    practicalExample: 'Uma empresa que faturou R$ 180.000 no ano é enquadrada como Microempresa (ME) no Simples Nacional e recolhe tributos proporcionais à receita via PGDAS-D.',
    officialSource: 'Portal da Legislação — Lei Complementar 123/2006 (Estatuto da MPE)',
    officialUrl: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm'
  },
  {
    id: 'or-06',
    title: 'Certificado Digital: Tipos A1 e A3 e sua importância',
    category: 'Documentos fiscais',
    summary: 'Identidade eletrônica da empresa para emissão de NF-e, acesso ao e-CAC e assinatura digital.',
    explanation: 'O Certificado Digital no padrão ICP-Brasil é obrigatório para a maioria das MEs e EPPs para assinar notas fiscais, transmitir DCTFWeb e acessar o portal e-CAC da Receita Federal. O modelo A1 é um arquivo digital (validade de 1 ano, pode ser salvo em nuvem); o A3 é físico em token ou cartão (validade de 1 a 3 anos).',
    stepByStep: [
      'Escolha uma Autoridade Certificadora credenciada pelo ITI/Receita Federal.',
      'Defina se prefere A1 (ideal para sistemas em nuvem) ou A3 (físico).',
      'Realize a validação por videoconferência com documento com foto.',
      'Instale no computador ou integre ao sistema emissor de notas fiscais.'
    ],
    practicalExample: 'Para enviar a DCTFWeb no portal e-CAC sem procuração eletrônica, o empresário de ME/EPP precisa autenticar-se com o Certificado Digital e-CNPJ da empresa.',
    officialSource: 'Instituto Nacional de Tecnologia da Informação (ITI) — ICP-Brasil',
    officialUrl: 'https://www.gov.br/iti/pt-br'
  },
  {
    id: 'or-07',
    title: 'DCTFWeb e EFD-Reinf: Entenda as obrigações acessórias',
    category: 'Obrigações fiscais',
    summary: 'Como funciona a confissão de débitos previdenciários e retenções na fonte.',
    explanation: 'A DCTFWeb substituiu a antiga GFIP para a apuração de contribuições previdenciárias (INSS) e recolhimentos decorrentes de processos trabalhistas e retenções. Os dados são alimentados pelo eSocial e pela EFD-Reinf e transmitidos até o dia 15 do mês subsequente.',
    stepByStep: [
      'Transmita os eventos periódicos do eSocial e da EFD-Reinf.',
      'Acesse o portal e-CAC na aba "Declarações e Demonstrativos" > "DCTFWeb".',
      'Confira os débitos e créditos apurados automaticamente pelo sistema.',
      'Transmita a declaração e emita o DARF Previdenciário unificado com código de barras e Pix.'
    ],
    practicalExample: 'Ao pagar o pró-labore do sócio ou salário do colaborador, os eventos do eSocial sobem para a DCTFWeb e geram a guia DARF para quitação até o dia 20.',
    officialSource: 'Receita Federal — Manual de Orientação da DCTFWeb',
    officialUrl: 'https://www.gov.br/receitafederal'
  },
  {
    id: 'or-08',
    title: 'Guarda de Documentos Fiscais: Regra dos 5 anos',
    category: 'Documentos fiscais',
    summary: 'Por quanto tempo sua empresa deve guardar notas, guias e comprovantes.',
    explanation: 'O Código Tributário Nacional (art. 173 e 174) estipula o prazo decadencial e prescricional de 5 anos para que o fisco federal, estadual e municipal fiscalize tributos. Por isso, todas as notas fiscais emitidas e recebidas, guias de DAS, comprovantes bancários e livros fiscais devem ser guardados em meio físico ou digital seguro por no mínimo 5 anos contados do primeiro dia do exercício seguinte.',
    stepByStep: [
      'Organize pastas digitais mensais por ano (ex: 2026/01-Janeiro).',
      'Armazene arquivos XML das notas fiscais emitidas e recebidas.',
      'Salve os comprovantes de pagamento das guias DAS, DARF e FGTS.',
      'Faça backup em nuvem criptografado regularmente.'
    ],
    practicalExample: 'Se o fisco solicitar auditoria referente ao ano de 2025, os documentos correspondentes devem estar disponíveis até 31 de dezembro de 2030.',
    officialSource: 'Código Tributário Nacional — Lei 5.172/1966',
    officialUrl: 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm'
  }
];

export const SUPPORT_FAQS: FAQItem[] = [
  {
    id: 'faq-01',
    category: 'Calendário',
    question: 'Como funciona o Calendário Fiscal no ConectaContábil?',
    answer: 'O Calendário Fiscal reúne as obrigações tributárias e trabalhistas aplicáveis ao seu regime (MEI, Simples Nacional, ME ou EPP). Você pode navegar entre os meses, clicar nas datas marcadas para ver detalhes, consultar fontes oficiais e cadastrar prazos personalizados de sua prefeitura ou empresa.'
  },
  {
    id: 'faq-02',
    category: 'Alertas',
    question: 'Como recebo os alertas de vencimentos?',
    answer: 'Os alertas são calculados internamente com base nas datas cadastradas no seu calendário. O ConectaContábil gera avisos visíveis no ícone de sino e na tela de Alertas com 7 dias, 3 dias, 1 dia de antecedência e no próprio dia do vencimento. Você pode personalizar essas preferências nas Configurações.'
  },
  {
    id: 'faq-03',
    category: 'Checklist',
    question: 'Marcar uma tarefa como concluída confirma o pagamento do imposto?',
    answer: 'Não. O Checklist Fiscal é uma ferramenta de gestão e controle operacional interno do empresário. Marcar uma tarefa como concluída não tem validade fiscal perante a Receita Federal nem substitui o comprovante de pagamento bancário ou a transmissão oficial da declaração.'
  },
  {
    id: 'faq-04',
    category: 'Orientações',
    question: 'As orientações fiscais são baseadas em quais leis?',
    answer: 'Todas as orientações do ConectaContábil são fundamentadas em fontes oficiais públicas brasileiras, como a Lei Complementar nº 123/2006 (Estatuto da MPE), Resoluções do Comitê Gestor do Simples Nacional (CGSN), Manuais da Receita Federal do Brasil, Portal Nacional da NFS-e e orientações do SEBRAE.'
  },
  {
    id: 'faq-05',
    category: 'Configurações',
    question: 'Como alterar o regime tributário ou dados da minha empresa?',
    answer: 'Você pode atualizar a qualquer momento a Razão Social, CNPJ, Enquadramento (MEI, ME, EPP), Regime Tributário e localização acessando a opção "Configurações" no menu lateral. Essas informações são usadas para personalizar as obrigações pertinentes.'
  },
  {
    id: 'faq-06',
    category: 'Inteligência Artificial',
    question: 'Como a IA do ConectaContábil me ajuda a tirar dúvidas?',
    answer: 'Nossa IA foi configurada para esclarecer dúvidas fiscais e tributárias em linguagem simples e acessível, citando sempre a base legal e orientações oficiais brasileiras. Ela atua como um assistente de apoio para esclarecer conceitos e procedimentos da rotina fiscal.'
  },
  {
    id: 'faq-07',
    category: 'Inteligência Artificial',
    question: 'A IA substitui o trabalho do meu contador?',
    answer: 'Não. O ConectaContábil e seu assistente de inteligência artificial são ferramentas de apoio operacional e educação fiscal. Para formalização contábil, balanços, apurações com incentivos fiscais complexos e defesas tributárias, a orientação individual de um profissional contábil registrado no CRC é indispensável.'
  }
];

export const OFFICIAL_SOURCES_DIRECTORY = [
  {
    name: 'Receita Federal — Simples Nacional',
    description: 'Manuais oficiais, legislação e aplicativos do Simples Nacional e MEI.',
    url: 'https://www8.receita.fazenda.gov.br/SimplesNacional/ConteudoApoio/Manuais/TelaManuais.aspx',
    tag: 'Tributação Federal'
  },
  {
    name: 'Portal do Empreendedor',
    description: 'Canal oficial do Governo Federal para formalização, alteração e baixa do MEI.',
    url: 'https://www.gov.br/mei',
    tag: 'MEI'
  },
  {
    name: 'Portal Nacional da NF-e',
    description: 'Portal oficial nacional para emissão, consulta e manuais da Nota Fiscal Eletrônica (Modelo 55).',
    url: 'https://www.nfe.fazenda.gov.br/portal/principal.aspx',
    tag: 'Notas Fiscais de Produto'
  },
  {
    name: 'Manuais da NF-e e NFC-e (SVRS)',
    description: 'Documentação técnica, manuais de orientação do contribuinte (MOC) e regras de validação da NF-e e NFC-e.',
    url: 'https://dfe-portal.svrs.rs.gov.br/Nfe/Documentos',
    tag: 'Documentos Fiscais Eletrônicos'
  },
  {
    name: 'Portal Nacional da NFS-e',
    description: 'Documentação técnica, emissores web e mobile da Nota Fiscal de Serviços padrão nacional.',
    url: 'https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual',
    tag: 'Notas Fiscais de Serviços'
  },
  {
    name: 'CONFAZ — Conselho Nacional de Política Fazendária',
    description: 'Convênios ICMS, tabela CFOP, CSOSN e ajustes SINIEF para comércio e indústria nos estados.',
    url: 'https://www.confaz.fazenda.gov.br/',
    tag: 'ICMS / Estados'
  },
  {
    name: 'Receita Federal — Perguntas e Respostas da PJ',
    description: 'Coletânea oficial de orientações tributárias sobre IRPJ, CSLL, Lucro Presumido e ECF.',
    url: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas',
    tag: 'Tributação Federal'
  },
  {
    name: 'Portal SPED e EFD-Contribuições',
    description: 'Manuais da Escrituração Fiscal Digital para PIS, COFINS, ICMS e IPI.',
    url: 'https://www.gov.br/sped/pt-br/assuntos/escrituracoes-digitais/efd-contribuicoes',
    tag: 'SPED / Contribuições'
  },
  {
    name: 'Reforma Tributária — Receita Federal',
    description: 'Orientações oficiais sobre a transição da Reforma Tributária do Consumo (CBS, IBS e Imposto Seletivo).',
    url: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/entenda',
    tag: 'Reforma Tributária'
  },
  {
    name: 'REDESIM — Empresas e Negócios',
    description: 'Rede Nacional para a Simplificação do Registro e da Legalização de Empresas e Negócios.',
    url: 'https://www.gov.br/empresas-e-negocios/pt-br/redesim/ajuda/',
    tag: 'Abertura e Baixa'
  },
  {
    name: 'eSocial — Documentação Técnica',
    description: 'Sistema de escrituração digital das obrigações fiscais, previdenciárias e trabalhistas.',
    url: 'https://www.gov.br/esocial/pt-br/documentacao-tecnica/',
    tag: 'Trabalhista / Folha'
  },
  {
    name: 'Comitê de Pronunciamentos Contábeis (CPC)',
    description: 'Normas brasileiras de contabilidade aplicadas a pequenas e médias empresas (NBC TG 1000).',
    url: 'https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos',
    tag: 'Normas Contábeis'
  },
  {
    name: 'SEBRAE',
    description: 'Guias práticos, consultorias e apoio ao desenvolvimento das micro e pequenas empresas.',
    url: 'https://sebrae.com.br/',
    tag: 'Apoio Empresarial'
  },
  {
    name: 'Portal da Legislação — Planalto (LC 123/2006)',
    description: 'Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm',
    tag: 'Legislação'
  },
  {
    name: 'Portal da Legislação — Planalto (LC 116/2003)',
    description: 'Lei Complementar nacional do Imposto Sobre Serviços de Qualquer Natureza (ISSQN).',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm',
    tag: 'Legislação ISS'
  },
  {
    name: 'Secretaria da Fazenda do Paraná (SEFAZ-PR)',
    description: 'Legislação estadual do ICMS, ICMS-ST, normas estaduais, notas fiscais e obrigações acessórias do Paraná.',
    url: 'https://www.fazenda.pr.gov.br/',
    tag: 'ICMS / SEFAZ-PR'
  },
  {
    name: 'Sistema de Normas da Receita Federal (Normas RFB)',
    description: 'Base de dados de instruções normativas, atos declaratórios, portarias e regulamentações tributárias federais.',
    url: 'https://normas.receita.fazenda.gov.br/',
    tag: 'Normas Tributárias'
  },
  {
    name: 'Soluções de Consulta da Receita Federal (COSIT)',
    description: 'Interpretações oficiais vinculantes da Coordenação-Geral de Tributação sobre legislação tributária federal.',
    url: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/solucoes-de-consultas-e-de-divergencias',
    tag: 'Interpretação Fiscal / COSIT'
  },
  {
    name: 'Diário Oficial da União (DOU)',
    description: 'Publicações de leis, medidas provisórias, decretos e atos normativos oficiais da República.',
    url: 'https://www.in.gov.br/',
    tag: 'Publicações Oficiais'
  },
  {
    name: 'Conselho Federal de Contabilidade (CFC)',
    description: 'Normas Brasileiras de Contabilidade (NBCs, NBC TG 1000 para PMEs) e orientações técnicas da profissão.',
    url: 'https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/',
    tag: 'Normas Contábeis / CFC'
  },
  {
    name: 'EFD-Reinf — Receita Federal',
    description: 'Escrituração Fiscal Digital de Retenções e Outras Informações Fiscais (série R-4000) e integração DCTFWeb.',
    url: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/efd-reinf',
    tag: 'SPED / EFD-Reinf'
  },
  {
    name: 'Portal Siscomex',
    description: 'Sistema Integrado de Comércio Exterior, tributos aduaneiros (II e IE), Duimp e procedimentos de importação e exportação.',
    url: 'https://www.gov.br/siscomex/pt-br',
    tag: 'Comércio Exterior / Siscomex'
  }
];

