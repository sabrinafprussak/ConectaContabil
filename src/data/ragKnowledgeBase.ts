import { RAGKnowledgeChunk } from '../types';

export const MANDATORY_INSUFFICIENT_INFO_MESSAGE = 
  "No momento, o ConectaContábil ainda não possui informações suficientes em sua base de conhecimento para responder a essa dúvida com segurança. Estamos trabalhando para ampliar nossos conteúdos e oferecer orientações sobre novos assuntos em breve.";

// Stopwords in Portuguese that must NEVER contribute to fiscal document matching
export const STOPWORDS = new Set([
  'qual', 'quais', 'como', 'onde', 'quando', 'porque', 'por', 'que', 'para', 'com', 'sem', 
  'sobre', 'sob', 'mais', 'menos', 'muito', 'pouco', 'pode', 'deve', 'fazer', 'saber', 'ter', 
  'estar', 'esse', 'essa', 'este', 'esta', 'isso', 'isto', 'aquele', 'aquela', 'aquilo', 
  'meu', 'minha', 'seu', 'sua', 'dele', 'dela', 'eles', 'elas', 'uma', 'umas', 'uns', 
  'pelo', 'pela', 'pelos', 'pelas', 'num', 'numa', 'está', 'são', 'era', 'foi', 'ser', 
  'das', 'dos', 'nas', 'nos', 'aos', 'às', 'pela', 'pelo', 'procedimento', 'correto', 
  'realizar', 'utilizados', 'instrumentos', 'exemplo', 'geral', 'funciona', 'fazer', 'passo'
]);

// Non-fiscal keywords blacklist for immediate rejection
const OUT_OF_SCOPE_BLACKLIST = [
  // Medicine, health, surgery, biology
  'cirurgia', 'catarata', 'médic', 'medic', 'hospital', 'saúde', 'saude', 'doença', 'doenca', 
  'remédio', 'remedio', 'paciente', 'oftalmolog', 'anatomia', 'sintoma', 'farmácia', 'farmacia', 
  'diagnóstico', 'diagnostico', 'terapia', 'biologia', 'odontologia', 'dente', 'oftalmo',
  // Food, cooking, recipes
  'receita de bolo', 'receita para fazer', 'bolo', 'pão', 'pao', 'culinária', 'culinaria', 
  'cozinha', 'açúcar', 'acucar', 'farinha', 'chocolate', 'assadeira', 'sobremesa', 'almoço',
  // Sports, games, hobbies
  'futebol', 'jogo', 'campeonato', 'escalação', 'escalacao', 'time', 'gol', 'libertadores', 
  'brasileirao', 'basquete', 'volei', 'tenis', 'videogame', 'playstation',
  // Entertainment, astrology, literature
  'novela', 'filme', 'cinema', 'ator', 'atriz', 'horóscopo', 'horoscopo', 'signo', 'astrologia', 
  'poema', 'poesia', 'piada', 'musica', 'música', 'cantor', 'show', 'namoro', 'casamento',
  // Weather, generic physics, geography
  'clima', 'tempo amanhã', 'previsão do tempo', 'previsao do tempo', 'temperatura', 
  'física quântica', 'buraco negro', 'astronomia', 'planeta'
];

// Whitelist of core Brazilian fiscal, tributary, accounting and business regulation terms
const FISCAL_DOMAIN_WHITELIST = [
  // Tributos e conceitos gerais
  'imposto', 'tribut', 'taxa', 'contribuic', 'contribuiç', 'aliquota', 'alíquota', 
  'base de calculo', 'base de cálculo', 'arrecada', 'recolh', 'retenc', 'retenç', 
  'darf', 'das', 'dae', 'gnre', 'isenc', 'isenç', 'credito tributario', 'crédito tributário',
  // Tributos específicos
  'icms', 'icms-st', 'icms st', 'iss', 'issqn', 'irpf', 'irpj', 'pis', 'cofins', 
  'csll', 'ipi', 'cbs', 'ibs', 'imposto seletivo', 'difal', 'mva', 'substituic', 'substituiç',
  // Documentos fiscais e notas
  'nota fiscal', 'notas fiscais', 'nfe', 'nf-e', 'nfce', 'nfc-e', 'nfse', 'nfs-e', 
  'danfe', 'xml', 'cfop', 'cst', 'csosn', 'ncm', 'cce', 'cc-e', 'carta de corre', 
  'devoluc', 'devoluç', 'cancelar nota', 'cancelamento de nota', 'rejeic', 'rejeiç', 
  'chave de acesso', 'documento fiscal', 'inutilizac', 'inutilizaç',
  // Obrigações, SPED e declarações
  'sped', 'efd', 'reinf', 'efd-reinf', 'dctf', 'dctfweb', 'defis', 'dasn', 'simei', 
  'esocial', 'dirpf', 'ecf', 'ecd', 'livro fiscal', 'livro diario', 'livro diário', 
  'balanco patrimonial', 'balanço patrimonial', 'dre', 'escriturac', 'escrituraç',
  // Regimes e categorias de empresas
  'simples nacional', 'mei', 'microempreendedor', 'microempresa', 'epp', 'lucro presumido', 
  'lucro real', 'fator r', 'anexo i', 'anexo ii', 'anexo iii', 'anexo iv', 'anexo v', 
  'pgdas', 'cgsn', 'comite gestor', 'comitê gestor',
  // Órgãos, normas e portais oficiais
  'receita federal', 'sefaz', 'fazenda', 'prefeitura', 'cosit', 'solucao de consulta', 
  'solução de consulta', 'instrucao normativa', 'instrução normativa', 'ato declaratorio', 
  'ato declaratório', 'dou', 'diario oficial', 'diário oficial', 'cfc', 'nbc', 
  'siscomex', 'aduana', 'radar', 'duimp', 'comex', 'importac', 'importaç', 'exportac', 'exportaç', 
  'junta comercial', 'redesim', 'dbe', 'cnae', 'cnpj',
  // Rotinas e gestão empresarial
  'abrir empresa', 'fechar empresa', 'baixa de cnpj', 'baixa de empresa', 'pro-labore', 
  'pró-labore', 'dividendo', 'distribuicao de lucro', 'distribuição de lucro', 
  'obrigacao acessoria', 'obrigação acessória', 'prazo de vencimento', 'calendario fiscal', 
  'calendário fiscal', 'guarda de documento', 'regime de caixa', 'regime de competencia'
];

/**
 * Positive Whitelist + Negative Blacklist Gate
 */
export function isQueryInFiscalScope(query: string): boolean {
  if (!query || typeof query !== 'string') return false;
  const q = query.toLowerCase().trim();

  if (q.length < 3) return false;

  // 1. Check blacklist
  if (OUT_OF_SCOPE_BLACKLIST.some(term => q.includes(term))) {
    return false;
  }

  // 2. Check positive whitelist
  const matchesWhitelist = FISCAL_DOMAIN_WHITELIST.some(term => q.includes(term));
  return matchesWhitelist;
}

export type DetectedTaxDomain = 
  | 'IMPOSTO_DE_RENDA'
  | 'ISS'
  | 'ICMS'
  | 'ICMS_ST'
  | 'PIS_COFINS'
  | 'CSLL'
  | 'IPI'
  | 'SIMPLES_NACIONAL'
  | 'MEI'
  | 'SEFAZ_PR'
  | 'NORMAS_RFB'
  | 'COSIT'
  | 'DOU'
  | 'CFC'
  | 'EFD_REINF'
  | 'SISCOMEX'
  | 'NOTAS_FISCAIS'
  | 'REFORMA_TRIBUTARIA'
  | 'ESOCIAL'
  | 'REDESIM'
  | 'DIFF_TRIBUTOS'
  | 'GERAL_FISCAL'
  | 'NON_FISCAL';

/**
 * Categorize inquiry into an exact tax/topic domain
 */
export function detectTaxDomain(query: string): DetectedTaxDomain {
  if (!isQueryInFiscalScope(query)) {
    return 'NON_FISCAL';
  }

  const q = query.toLowerCase().trim();

  // Cross-tax comparisons
  if (
    (q.includes('diferen') || q.includes('vs') || q.includes('qual a diferen')) &&
    ((q.includes('icms') && q.includes('iss')) || (q.includes('pis') && q.includes('cofins')) || (q.includes('csll') && q.includes('irpj')))
  ) {
    return 'DIFF_TRIBUTOS';
  }

  // 1. Imposto de Renda
  if (
    q.includes('imposto de renda') || 
    q.includes('irpf') || 
    q.includes('irpj') || 
    q.includes('dirpf') || 
    q.includes('declaracao de renda') ||
    q.includes('declaração de renda') ||
    (q.includes('renda') && (q.includes('imposto') || q.includes('declarar') || q.includes('recolher') || q.includes('faixa')))
  ) {
    return 'IMPOSTO_DE_RENDA';
  }

  // 2. SEFAZ Paraná
  if (
    q.includes('paraná') || q.includes('parana') || q.includes('sefaz-pr') || q.includes('sefaz pr') || 
    q.includes('fazenda pr') || q.includes('ricms/pr') || q.includes('ricms pr') || q.includes('receita/pr')
  ) {
    return 'SEFAZ_PR';
  }

  // 3. EFD-Reinf
  if (q.includes('reinf') || q.includes('efd-reinf') || q.includes('efd reinf') || q.includes('r-4000') || q.includes('r-4020') || q.includes('r-4010')) {
    return 'EFD_REINF';
  }

  // 4. Siscomex / Comércio Exterior
  if (q.includes('siscomex') || q.includes('importa') || q.includes('exporta') || q.includes('radar') || q.includes('duimp') || q.includes('aduaneir')) {
    return 'SISCOMEX';
  }

  // 5. Soluções de Consulta COSIT
  if (q.includes('cosit') || q.includes('solucao de consulta') || q.includes('solução de consulta')) {
    return 'COSIT';
  }

  // 6. Sistema de Normas RFB
  if (q.includes('normas rfb') || q.includes('instrucao normativa') || q.includes('instrução normativa') || q.includes('ato declaratorio') || q.includes('normas da receita')) {
    return 'NORMAS_RFB';
  }

  // 7. Diário Oficial da União (DOU)
  if (q.includes('dou') || q.includes('diario oficial') || q.includes('diário oficial') || q.includes('imprensa nacional')) {
    return 'DOU';
  }

  // 8. CFC / NBC
  if (q.includes('cfc') || q.includes('conselho federal de contabilidade') || q.includes('nbc') || q.includes('balanco patrimonial') || q.includes('dre')) {
    return 'CFC';
  }

  // 9. ISS
  if (
    (q.includes('iss') || q.includes('issqn') || q.includes('imposto sobre servico') || q.includes('imposto sobre serviço') || q.includes('116/2003') || q.includes('lc 116')) &&
    !q.includes('imposto de renda') && !q.includes('icms')
  ) {
    return 'ISS';
  }

  // 10. ICMS / ICMS-ST
  if (q.includes('icms-st') || q.includes('icms st') || q.includes('substituicao tributaria') || q.includes('substituição tributária') || q.includes('icms')) {
    return 'ICMS';
  }

  // 11. PIS / COFINS
  if (q.includes('pis') || q.includes('cofins') || q.includes('monofasico') || q.includes('monofásico')) {
    return 'PIS_COFINS';
  }

  // 12. CSLL
  if (q.includes('csll')) {
    return 'CSLL';
  }

  // 13. IPI
  if (q.includes('ipi') || q.includes('produtos industrializados') || q.includes('tipi')) {
    return 'IPI';
  }

  // 14. Reforma Tributária
  if (q.includes('reforma') || q.includes('cbs') || q.includes('ibs') || q.includes('imposto seletivo')) {
    return 'REFORMA_TRIBUTARIA';
  }

  // 15. Notas Fiscais
  if (
    q.includes('nota fiscal') || q.includes('notas fiscais') || q.includes('nfe') || q.includes('nf-e') ||
    q.includes('nfce') || q.includes('nfc-e') || q.includes('nfse') || q.includes('nfs-e') ||
    q.includes('cfop') || q.includes('cst') || q.includes('csosn') || q.includes('ncm') ||
    q.includes('danfe') || q.includes('xml') || q.includes('devoluc') || q.includes('devoluç') ||
    q.includes('rejeic') || q.includes('rejeiç') || q.includes('cancelar nota') || q.includes('carta de corre')
  ) {
    return 'NOTAS_FISCAIS';
  }

  // 16. Simples Nacional & MEI
  if (q.includes('simples nacional') || q.includes('fator r') || q.includes('das-mei') || q.includes('dasn') || q.includes('defis') || q.includes('anexo i') || q.includes('anexo iii') || q.includes('pgdas')) {
    return 'SIMPLES_NACIONAL';
  }

  if (q.includes('mei') || q.includes('microempreendedor')) {
    return 'MEI';
  }

  // 17. eSocial
  if (q.includes('esocial') || q.includes('folha de pagamento') || q.includes('trabalhista') || q.includes('pro-labore')) {
    return 'ESOCIAL';
  }

  // 18. Redesim / Abertura / Baixa
  if (q.includes('abrir empresa') || q.includes('fechar empresa') || q.includes('baixa de empresa') || q.includes('redesim') || q.includes('dbe')) {
    return 'REDESIM';
  }

  return 'GERAL_FISCAL';
}

// Complete Official Knowledge Base with Required Query Terms for Precise Grounding
export const OFFICIAL_RAG_KNOWLEDGE_BASE: RAGKnowledgeChunk[] = [
  // =========================================================================
  // 1. IMPOSTO DE RENDA (IRPF E IRPJ)
  // =========================================================================
  {
    id: 'ir-01',
    title: 'Imposto de Renda: Conceito Geral, Diferença entre IRPF e IRPJ',
    subject: 'Imposto de Renda',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['renda', 'irpf', 'irpj', 'dirpf'],
    content: `O Imposto de Renda é um tributo de competência exclusivamente federal arrecadado pela Receita Federal do Brasil sobre os ganhos de capital, lucros e rendimentos auferidos ao longo do ano.
Existem dois tipos fundamentais que nunca devem ser confundidos:
1. IRPF (Imposto de Renda da Pessoa Física):
   - Incide sobre os rendimentos do cidadão (CPF), como salários, pró-labore, aluguéis recebidos e ganhos de investimentos.
   - Utiliza a tabela progressiva mensal e anual com alíquotas que variam de 0% (faixa de isenção) até 27,5%.
   - Obrigatoriedade anual: Pessoas físicas que receberam rendimentos tributáveis acima do teto estipulado pela Receita ou tiveram rendimentos isentos/não tributáveis acima do limite devem entregar a Declaração de Ajuste Anual (DIRPF).
2. IRPJ (Imposto de Renda da Pessoa Jurídica):
   - Incide sobre o lucro ou faturamento das empresas (CNPJ).
   - Apuração depende do regime tributário:
     * No Simples Nacional: O IRPJ está embutido na alíquota única paga mensalmente na guia DAS.
     * No Lucro Presumido: A Receita presume uma margem de lucro (ex: 8% para comércio, 32% para serviços) e aplica a alíquota de 15% de IRPJ mais 10% adicional sobre o que exceder R$ 20.000,00/mês.
     * No Lucro Real: Incide sobre o lucro contábil líquido real (15% + 10% adicional). Se a empresa tiver prejuízo fiscal, não paga IRPJ.
ATENÇÃO IMPORTANTE: O Imposto de Renda (IRPF/IRPJ) é um tributo FEDERAL sobre a renda. Ele não possui nenhuma relação com o ISS (que é municipal sobre serviços) nem com o ICMS (que é estadual sobre produtos).`,
    sourceName: 'Receita Federal — Perguntas e Respostas da Pessoa Física e Jurídica',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas',
    keywords: [
      'imposto de renda', 'o que e imposto de renda', 'irpf', 'irpj', 'dirpf', 'declaracao de imposto de renda',
      'imposto de renda pessoa fisica', 'imposto de renda pessoa juridica', 'tabela progressiva', 'tributo federal sobre a renda'
    ]
  },
  {
    id: 'ir-02',
    title: 'IRPF para Titulares e Sócios de MEI, ME e EPP: Pró-Labore vs Lucros Isentos',
    subject: 'Imposto de Renda',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['renda', 'irpf', 'pro-labore', 'pró-labore', 'lucro isento', 'dividendos'],
    content: `Como os titulares e sócios de micro e pequenas empresas declaram seus rendimentos no IRPF:
1. Pró-Labore:
   - É a remuneração pelo trabalho exercido pelo sócio administrador na empresa.
   - É rendimento TRIBUTÁVEL: sobre ele incide a contribuição do INSS (11%) e o IRPF conforme a tabela progressiva (com retenção na fonte se ultrapassar a faixa de isenção).
2. Distribuição de Lucros e Dividendos:
   - É a remuneração pelo capital investido pelo sócio.
   - É rendimento ISENTO E NÃO TRIBUTÁVEL no IRPF conforme o art. 10 da Lei Federal nº 9.249/1995, desde que a empresa mantenha a escrituração contábil regular ou respeite os percentuais de presunção do Simples Nacional/Lucro Presumido.
3. Regra especial para o MEI no IRPF:
   - O MEI calcula uma parcela isenta de seu faturamento bruto (8% para comércio, 16% para transporte de passageiros, 32% para serviços).
   - O restante, deduzidas as despesas comprovadas do negócio, compõe o rendimento tributável a ser declarado na ficha do IRPF caso o titular atinja o teto de obrigatoriedade.`,
    sourceName: 'Receita Federal — IRPF & Lei Federal nº 9.249/1995',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda',
    keywords: [
      'irpf socio', 'irpf titular', 'pro-labore irpf', 'lucro isento', 'dividendos isentos', 'mei no imposto de renda',
      'declarar mei no irpf', 'distribuicao de lucros'
    ]
  },

  // =========================================================================
  // 2. DISTINÇÕES ENTRE TRIBUTOS
  // =========================================================================
  {
    id: 'trib-diff-01',
    title: 'Diferença Fundamental entre ICMS (Estadual) e ISS (Municipal)',
    subject: 'Diferença entre Tributos',
    sphere: 'misto',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['icms', 'iss'],
    content: `ICMS e ISS são dois impostos completamente distintos no sistema tributário brasileiro:
1. ICMS (Imposto sobre Circulação de Mercadorias e Serviços):
   - Competência: ESTADUAL (arrecadado pela Secretaria da Fazenda de cada Estado - SEFAZ).
   - Fato Gerador: Venda e circulação física de produtos, alimentos, mercadorias, insumos, transporte interestadual/intermunicipal e serviços de comunicação.
   - Alíquotas: Variam entre 4%, 7%, 12% (interestaduais) e 17% a 22% (internas de cada estado).
2. ISS ou ISSQN (Imposto Sobre Serviços de Qualquer Natureza):
   - Competência: MUNICIPAL (arrecadado pela Prefeitura da cidade).
   - Fato Gerador: Prestação de serviços constantes na lista anexa da Lei Complementar nº 116/2003 (ex: consultorias, serviços de TI, saúde, consertos, estética, vigilância, limpeza).
   - Alíquotas: Variam entre o piso de 2% e o teto máximo de 5%.
3. Regra de Ouro da Não Cumulatividade e Conflito:
   - Um mesmo item não paga ICMS e ISS simultaneamente. Se for mercadoria, é ICMS. Se for serviço listado na LC 116/2003, é ISS.
   - Exemplo clássico em oficinas mecânicas: O valor das peças aplicadas no veículo paga ICMS (com NF-e); o valor da mão de obra do mecânico paga ISS (com NFS-e).`,
    sourceName: 'Constituição Federal (Art. 155 e 156) & LC 116/2003',
    sourceUrl: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm',
    keywords: [
      'diferenca entre icms e iss', 'icms ou iss', 'iss vs icms', 'imposto estadual vs municipal', 'quando e icms e quando e iss'
    ]
  },
  {
    id: 'trib-diff-02',
    title: 'Diferenças entre PIS e COFINS e entre CSLL e IRPJ',
    subject: 'Diferença entre Tributos',
    sphere: 'federal',
    applicableRegimes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['pis', 'cofins', 'csll', 'irpj'],
    content: `Distinção técnica e prática entre contribuições federais:
1. PIS vs COFINS:
   - Ambas são contribuições federais sobre o faturamento, porém possuem finalidades sociais e alíquotas diferentes:
   - PIS (Programa de Integração Social): Financia o abono salarial PIS e o seguro-desemprego. Alíquota de 0,65% (cumulativo) ou 1,65% (não cumulativo).
   - COFINS (Contribuição para o Financiamento da Seguridade Social): Financia exclusivamente a Seguridade Social (Previdência Social, Saúde Pública e Assistência Social). Alíquota de 3,00% (cumulativo) ou 7,60% (não cumulativo).
2. IRPJ vs CSLL:
   - IRPJ: Imposto sobre a renda da empresa destinado às despesas gerais do Governo Federal. Alíquota base de 15% + adicional de 10% sobre o lucro excedente a R$ 20.000/mês.
   - CSLL (Contribuição Social sobre o Lucro Líquido): Contribuição social instituída pela Lei nº 7.689/1988 vinculada especificamente à seguridade social. Alíquota geral de 9% sobre o lucro.`,
    sourceName: 'Receita Federal — EFD-Contribuições & Perguntas e Respostas da PJ',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas',
    keywords: [
      'diferenca entre pis e cofins', 'pis vs cofins', 'diferenca csll e irpj', 'csll vs irpj', 'pis e cofins nao sao iguais'
    ]
  },

  // =========================================================================
  // 3. SETE FONTES OFICIAIS INTEGRADAS
  // =========================================================================
  {
    id: 'src-sefaz-pr-01',
    title: 'Secretaria da Fazenda do Paraná (SEFAZ-PR): ICMS, ICMS-ST e DeSTDA',
    subject: 'SEFAZ Paraná',
    sphere: 'estadual',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['paraná', 'parana', 'sefaz-pr', 'sefaz pr', 'fazenda pr', 'ricms/pr', 'ricms pr', 'destda'],
    content: `Regras fiscais estaduais administradas pela Secretaria da Fazenda do Estado do Paraná (SEFAZ-PR):
1. Legislação do ICMS no Paraná:
   - Regulamentado pelo Regulamento do ICMS do Estado do Paraná (RICMS/PR - Decreto Estadual nº 7.871/2017).
   - Alíquota interna padrão modal de ICMS no Paraná: 19,5% (art. 17 da Lei Estadual nº 11.580/1996 e alterações).
2. Substituição Tributária (ICMS-ST no PR):
   - As mercadorias sujeitas à ST no Paraná constam no Anexo IX do RICMS/PR.
   - Operações interestaduais que destinem mercadorias a revendedores paranaenses devem observar se há Protocolo ou Convênio ICMS firmado entre o PR e o estado de origem para recolhimento da GNRE ou guia estadual.
3. DeSTDA (Declaração de Substituição Tributária, Diferencial de Alíquota e Antecipação):
   - Obrigação mensal transmitida até o dia 28 do mês subsequente pelas empresas optantes pelo Simples Nacional estabelecidas no Paraná ou que operem com contribuintes paranaenses recolhendo ICMS-ST ou DIFAL.
4. Portal Receita/PR:
   - Canal oficial de serviços online para emissão de guias DARE-PR, consulta cadastral no CAD/ICMS, autorização de AIDF e acompanhamento da EFD ICMS/IPI.`,
    sourceName: 'Secretaria da Fazenda do Paraná (SEFAZ-PR)',
    sourceUrl: 'https://www.fazenda.pr.gov.br/',
    keywords: [
      'sefaz pr', 'sefaz parana', 'fazenda parana', 'icms pr', 'icms parana', 'ricms pr', 'destda parana', 'aliquota icms parana',
      'receita pr', 'dare pr', 'substituicao tributaria parana'
    ]
  },
  {
    id: 'src-normas-rfb-01',
    title: 'Sistema de Normas da Receita Federal (Normas RFB): INs e Atos Declaratórios',
    subject: 'Normas Tributárias Federais',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['normas rfb', 'instrucao normativa', 'instrução normativa', 'ato declaratorio', 'ato declaratório', 'normas da receita'],
    content: `O Sistema de Normas da Receita Federal (disponível no portal oficial normas.receita.fazenda.gov.br) é o repositório central que organiza e disponibiliza todos os atos normativos tributários federais emitidos pelo fisco:
1. Instruções Normativas (INs):
   - São os atos que regulamentam a aplicação prática das leis tributárias federais, definindo procedimentos, prazos de declarações e regras de retenção (ex: IN RFB nº 2.110/2022 para contribuições previdenciárias; IN RFB nº 2.145/2023 para retenções na fonte).
2. Atos Declaratórios Executivos (ADEs):
   - Editados pelas coordenações e delegacias para declarar situações específicas, aprovar leiautes de sistemas emissores, tabelas de coeficientes ou desenquadramento de regimes.
3. Portarias e Pareceres Normativos:
   - Atos de delegação, organização interna e interpretações obrigatórias sobre temas tributários de repercussão geral.
4. Consulta pública no portal:
   - Qualquer empresário ou contador pode pesquisar atos normativos vigentes por número, ano, termo de busca ou tributo específico, verificando se a norma está em vigor ou se foi revogada por ato posterior.`,
    sourceName: 'Sistema de Normas da Receita Federal (Normas RFB)',
    sourceUrl: 'https://normas.receita.fazenda.gov.br/',
    keywords: [
      'normas receita federal', 'normas rfb', 'instrucao normativa', 'in rfb', 'ato declaratorio', 'legislacao tributaria federal',
      'portaria rfb', 'consulta normas'
    ]
  },
  {
    id: 'src-cosit-01',
    title: 'Soluções de Consulta COSIT: Interpretações Oficiais Vinculantes da RFB',
    subject: 'Interpretação Tributária',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['cosit', 'solucao de consulta', 'solução de consulta'],
    content: `As Soluções de Consulta emitidas pela Coordenação-Geral de Tributação da Receita Federal (COSIT) representam a interpretação oficial do Fisco Federal sobre a legislação tributária:
1. Natureza e Efeito Vinculante:
   - Conforme a Instrução Normativa RFB nº 2.058/2021, as Soluções de Consulta COSIT têm efeito vinculante perante toda a Receita Federal do Brasil a partir da data de sua publicação.
   - Isso significa que todos os auditores fiscais em todo o país são obrigados a seguir o entendimento fixado pela COSIT.
2. Segurança Jurídica para o Contribuinte:
   - O contribuinte que formular consulta formal à Receita sobre a interpretação da lei e tiver resposta favorável (ou aplicar entendimento idêntico de Solução de Consulta COSIT já publicada) está protegido contra a cobrança de multas punitivas e juros de mora relacionados à matéria consultada.
3. Temas Recorrentes da COSIT:
   - Enquadramento e desenquadramento de atividades no Simples Nacional e Fator R.
   - Não incidência de retenção na fonte em pagamentos de serviços específicos.
   - Conceito de insumos para tomada de crédito de PIS e COFINS no Lucro Real.
   - Tributação de comissões, intermediações e plataformas digitais.`,
    sourceName: 'Soluções de Consulta da Receita Federal (COSIT)',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/solucoes-de-consultas-e-de-divergencias',
    keywords: [
      'cosit', 'solucao de consulta cosit', 'solucao de consulta receita federal', 'interpretacao tributaria oficial',
      'efeito vinculante', 'consulta fiscal', 'seguranca juridica fiscal'
    ]
  },
  {
    id: 'src-dou-01',
    title: 'Diário Oficial da União (DOU): Publicações Tributárias e Vigência Legal',
    subject: 'Publicações Oficiais',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['dou', 'diario oficial', 'diário oficial', 'imprensa nacional'],
    content: `O Diário Oficial da União (DOU), mantido pela Imprensa Nacional (in.gov.br), é o veículo de comunicação oficial pelo qual as normas federais adquirem validade jurídica:
1. Publicação das Leis Tributárias (Seção 1):
   - Nenhuma lei que crie, aumente ou altere tributos federais tem validade sem que antes tenha sido formalmente publicada no Diário Oficial da União.
2. Princípios Constitucionais de Proteção ao Contribuinte:
   - Princípio da Anterioridade Anual: A lei publicada no DOU que cria ou majora imposto só entra em vigor no dia 1º de janeiro do ano seguinte.
   - Princípio da Anterioridade Nonagesimal (Noventena): Deve-se aguardar no mínimo 90 dias após a publicação no DOU para iniciar a cobrança de novas contribuições sociais ou alterações no ICMS/IPI.
3. Edições e Consulta Digital:
   - O DOU é publicado diariamente em formato digital e pode ser pesquisado por palavras-chave no portal oficial da Imprensa Nacional.`,
    sourceName: 'Diário Oficial da União (DOU) — Imprensa Nacional',
    sourceUrl: 'https://www.in.gov.br/',
    keywords: [
      'dou', 'diario oficial da uniao', 'imprensa nacional', 'publicacao de lei', 'vigencia de lei tributaria',
      'anterioridade anual', 'noventena', 'secao 1 dou'
    ]
  },
  {
    id: 'src-cfc-01',
    title: 'Conselho Federal de Contabilidade (CFC): Normas Brasileiras de Contabilidade (NBCs)',
    subject: 'Normas Contábeis',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['cfc', 'nbc', 'conselho federal de contabilidade', 'balanco patrimonial', 'balanço patrimonial', 'dre', 'normas contabeis', 'normas contábeis'],
    content: `O Conselho Federal de Contabilidade (CFC) é a autarquia federal que regulamenta o exercício da profissão contábil e emite as Normas Brasileiras de Contabilidade (NBCs):
1. NBC TG 1000 (R1) — Contabilidade para Pequenas e Médias Empresas (PMEs):
   - Norma padrão aplicada a microempresas e empresas de pequeno porte com faturamento anual de até R$ 300 milhões.
   - Estabelece critérios simplificados para elaboração das Demonstrações Contábeis obrigatórias: Balanço Patrimonial, Demonstração do Resultado do Exercício (DRE) e Notas Explicativas.
2. NBC TG 1001 e 1002 — Microentidades:
   - Normas direcionadas a microempresas com faturamento anual de até R$ 4,8 milhões, simplificando os lançamentos contábeis.
3. Princípios Fundamentais de Contabilidade:
   - Princípio da Entidade: O patrimônio particular dos sócios e titulares não pode ser misturado com as contas da empresa.
   - Princípio da Competência: As receitas e despesas devem ser incluídas na apuração do período em que ocorrerem, independentemente do recebimento ou pagamento financeiro.
4. Livros Contábeis Obrigatórios:
   - Livro Diário e Livro Razão registrados na Junta Comercial ou escriturados digitalmente no SPED Contábil (ECD).`,
    sourceName: 'Conselho Federal de Contabilidade (CFC)',
    sourceUrl: 'https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/',
    keywords: [
      'cfc', 'conselho federal de contabilidade', 'nbc', 'normas brasileiras de contabilidade', 'nbc tg 1000',
      'nbc tg 1001', 'nbc tg 1002', 'balanco patrimonial', 'dre', 'livro diario', 'principio da entidade'
    ]
  },
  {
    id: 'src-reinf-01',
    title: 'EFD-Reinf: Retenções da Série R-4000, Prazos e Integração com DCTFWeb',
    subject: 'Escrituração Fiscal Digital',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['reinf', 'efd-reinf', 'efd reinf', 'r-4000', 'r-4010', 'r-4020'],
    content: `A EFD-Reinf (Escrituração Fiscal Digital de Retenções e Outras Informações Fiscais) é um módulo do SPED voltado à declaração de retenções tributárias na fonte:
1. Eventos da Série R-4000 (Retenções Federais):
   - R-4010: Pagamentos e retenções de IRRF a beneficiários pessoas físicas (como autônomos e aluguéis de PF).
   - R-4020: Pagamentos e retenções de IRRF, PIS, COFINS e CSLL (CSRF) a beneficiários pessoas jurídicas (serviços profissionais de consultoria, TI, advocacia, etc.).
   - R-4040: Pagamentos a beneficiários não identificados.
   - R-4080: Retenção no recebimento (comissões de cartões de crédito e agências de viagem).
2. Prazo de Transmissão:
   - Deve ser transmitida até o dia 15 do mês subsequente àquele em que os pagamentos ou retenções ocorreram. Se o dia 15 cair em dia não útil, o prazo é antecipado para o dia útil imediatamente anterior.
3. Integração com a DCTFWeb:
   - Ao fechar a EFD-Reinf, os débitos declarados sobem automaticamente para a DCTFWeb no portal e-CAC, permitindo emitir a guia DARF Numerada com código de barras e QR Code Pix.
4. MEI e Simples Nacional:
   - MEI sem contratação de serviços com retenção está dispensado de enviar a EFD-Reinf.
   - Empresas do Simples Nacional que tomem serviços com retenção de IRRF ou INSS de terceiros devem enviar os eventos da EFD-Reinf normalmente.`,
    sourceName: 'Receita Federal — EFD-Reinf & Manual de Orientação do SPED',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/efd-reinf',
    keywords: [
      'efd-reinf', 'efd reinf', 'reinf', 'r-4000', 'r-4010', 'r-4020', 'r-4080', 'retencoes federais reinf',
      'prazo reinf', 'dia 15', 'sped reinf', 'reinf simples nacional'
    ]
  },
  {
    id: 'src-siscomex-01',
    title: 'Portal Siscomex: Tributos na Importação (II e IE), Duimp e Habilitação Radar',
    subject: 'Comércio Exterior',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['siscomex', 'importa', 'exporta', 'radar', 'duimp', 'aduaneir', 'comex'],
    content: `O Siscomex (Sistema Integrado de Comércio Exterior) é a plataforma governamental que centraliza os procedimentos de importação e exportação no Brasil:
1. Habilitação no Radar (Registro e Rastreamento da Atuação dos Intervenientes Aduaneiros):
   - Antes de realizar qualquer operação de comércio exterior pelo CNPJ, a empresa precisa habilitar-se no Portal Único Siscomex.
   - Modalidades do Radar para pequenas empresas:
     * Expresso: Limite de até US$ 50 mil a cada 6 meses (ideal para MEI e pequenas operações).
     * Limitado: Limite de até US$ 160 mil a cada 6 meses.
     * Ilimitado: Para empresas com capacidade financeira comprovada superior a US$ 160 mil.
2. Tributos Incidentes na Importação:
   - II (Imposto de Importação): Alíquota fixada na Tarifa Externa Comum (TEC) conforme a NCM do produto.
   - IPI-Importação: Cobrado no desembaraço aduaneiro.
   - PIS-Importação e COFINS-Importação: Alíquotas federais de entrada.
   - ICMS-Importação: Imposto estadual cobrado pela SEFAZ onde a mercadoria é desembaraçada.
   - AFRMM: Adicional ao Frete para Renovação da Marinha Mercante (em importações marítimas).
3. Documentos e Procedimentos:
   - Declaração Única de Importação (Duimp) e Declaração Única de Exportação (DU-E), que simplificaram os antigos DI e RE.
   - No Simples Nacional: A empresa pode importar normalmente, devendo recolher os tributos da importação no momento do desembaraço aduaneiro (por fora do DAS).`,
    sourceName: 'Portal Siscomex — Comércio Exterior do Brasil',
    sourceUrl: 'https://www.gov.br/siscomex/pt-br',
    keywords: [
      'siscomex', 'portal siscomex', 'importacao', 'exportacao', 'tributos de importacao', 'imposto de importacao', 'ii', 'ie',
      'radar', 'habilitacao radar', 'duimp', 'desembaraco aduaneiro', 'comercio exterior mei'
    ]
  },

  // =========================================================================
  // 4. NOTAS FISCAIS
  // =========================================================================
  {
    id: 'nfe-01',
    title: 'Modelos de Notas Fiscais: NF-e, NFC-e e NFS-e',
    subject: 'Notas Fiscais',
    sphere: 'misto',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['modelo', 'nfe', 'nf-e', 'nfce', 'nfc-e', 'nfse', 'nfs-e', 'nota fiscal', 'notas fiscais'],
    content: `No Brasil, existem três modelos principais de documentos fiscais eletrônicos:
1. NF-e (Nota Fiscal Eletrônica - Modelo 55): Utilizada para operações de compra e venda de mercadorias, devoluções, remessas e transferências entre empresas (B2B) ou para consumidor final interestadual. Emitida e autorizada pela Secretaria da Fazenda Estadual (SEFAZ).
2. NFC-e (Nota Fiscal de Consumidor Eletrônica - Modelo 65): Substituta do antigo cupom fiscal, utilizada no comércio varejista presencial diretamente ao consumidor final (B2C) dentro do estado.
3. NFS-e (Nota Fiscal de Serviços Eletrônica): Utilizada para registrar prestações de serviços. Desde setembro de 2023, o MEI utiliza obrigatoriamente o Portal Nacional da NFS-e (gov.br/nfse). Empresas ME e EPP emitem no sistema da Prefeitura municipal ou emissor nacional conveniado.`,
    sourceName: 'Portal Nacional da NF-e & Portal Nacional da NFS-e',
    sourceUrl: 'https://www.nfe.fazenda.gov.br/portal/principal.aspx',
    keywords: ['nfe', 'nf-e', 'nfc-e', 'nfce', 'nfs-e', 'nfse', 'modelos de nota', 'modelo 55', 'modelo 65', 'nota de servico', 'nota de mercadoria', 'nota de produto']
  },
  {
    id: 'nfe-02',
    title: 'Regras de Emissão, Cancelamento e Consulta de Notas Fiscais',
    subject: 'Notas Fiscais',
    sphere: 'estadual',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['cancelar', 'cancelamento', 'consulta nota', 'inutilizac', 'inutilizaç', 'chave de acesso'],
    content: `Diretrizes operacionais para emissão, cancelamento e consulta de notas fiscais:
- Cancelamento de NF-e e NFC-e: O prazo regulamentar geral fixado pelo CONFAZ (Ajuste SINIEF 07/2005) é de 24 horas a partir da autorização de uso, desde que a mercadoria não tenha saído do estabelecimento. Alguns estados permitem prazos estendidos (cancelamento extemporâneo mediante taxa ou processo administrativo).
- Para a NFS-e: O cancelamento segue as regras da legislação municipal ou do Emissor Nacional (pode ser cancelada pelo próprio portal ou via solicitação à Prefeitura se o tributo já foi recolhido).
- Consulta de Notas: A autenticidade e validade da NF-e podem ser consultadas no Portal Nacional da NF-e informando a Chave de Acesso de 44 dígitos.
- Inutilização de Numeração: Caso haja quebra na sequência numérica de notas não utilizadas, a numeração deve ser inutilizada junto à SEFAZ até o 10º dia do mês subsequente.`,
    sourceName: 'Manuais da NF-e (SVRS) & Portal Nacional da NF-e',
    sourceUrl: 'https://dfe-portal.svrs.rs.gov.br/Nfe/Documentos',
    keywords: ['cancelar nota', 'cancelamento', 'prazo de cancelamento', '24 horas', 'consulta nota fiscal', 'chave de acesso', '44 digitos', 'inutilizacao', 'inutilizar numeracao']
  },
  {
    id: 'nfe-03',
    title: 'Carta de Correção Eletrônica (CC-e): O que pode e o que não pode corrigir',
    subject: 'Notas Fiscais',
    sphere: 'estadual',
    applicableRegimes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['carta de corre', 'cc-e', 'cce', 'corrigir nota'],
    content: `A Carta de Correção Eletrônica (CC-e) é destinada a corrigir erros em notas fiscais autorizadas, conforme o Convênio SINIEF s/nº de 1970 (art. 7º, § 1º-A):
O QUE PODE SER CORRIGIDO VIA CC-E:
- CFOP (Código Fiscal de Operações), desde que não mude a natureza dos impostos.
- Código de Situação Tributária (CST/CSOSN), sem alterar valores de tributos.
- Descrição da mercadoria ou código do produto.
- Dados da transportadora (endereço, placa, frete por conta do emitente/destinatário).
- Dados adicionais, endereço de entrega ou observações de interesse do contribuinte.
O QUE NÃO PODE SER CORRIGIDO (PROIBIDO):
- Valores fiscais (valor do item, base de cálculo, alíquota, valor do imposto, valor total da nota).
- Dados cadastrais que mudem o remetente ou o destinatário por completo.
- A data de emissão ou data de saída da mercadoria.
Prazo para emissão da CC-e: até 30 dias após a autorização da NF-e, limitada a 20 cartas para a mesma nota.`,
    sourceName: 'CONFAZ & Manuais da NF-e',
    sourceUrl: 'https://www.confaz.fazenda.gov.br/',
    keywords: ['carta de correcao', 'cc-e', 'cce', 'corrigir nota', 'erro na nota', 'o que pode corrigir', 'o que nao pode corrigir']
  },
  {
    id: 'nfe-04',
    title: 'Códigos Fiscais Essenciais: CFOP, CST, CSOSN e NCM',
    subject: 'Notas Fiscais',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['cfop', 'cst', 'csosn', 'ncm'],
    content: `Os quatro códigos fundamentais para emissão e tributação de itens na nota fiscal:
1. CFOP (Código Fiscal de Operações e Prestações - 4 dígitos):
   - Define a circulação do produto ou serviço.
   - Primeiro dígito: 1 e 5 (dentro do mesmo estado), 2 e 6 (interestadual), 3 e 7 (exterior). Exemplo: 5.102 (venda de mercadoria dentro do estado), 6.102 (venda para outro estado).
2. CST (Código de Situação Tributária - 3 dígitos): Utilizado por empresas do Regime Normal (Lucro Presumido e Lucro Real) para indicar a tributação do ICMS (ex: 00 tributada integralmente, 40 isenta, 60 cobrada por substituição tributária).
3. CSOSN (Código de Situação da Operação no Simples Nacional - 3 ou 4 dígitos): Utilizado exclusivamente por optantes do Simples Nacional (ex: 101 tributada com permissão de crédito, 102 tributada sem crédito, 400 não tributada, 500 ICMS cobrado anteriormente por ST).
4. NCM (Nomenclatura Comum do Mercosul - 8 dígitos): Código numérico obrigatório que classifica internacionalmente o produto e define as alíquotas de impostos (ICMS, IPI, PIS, COFINS).`,
    sourceName: 'CONFAZ & Receita Federal — Tabela CFOP / NCM / CSOSN',
    sourceUrl: 'https://www.confaz.fazenda.gov.br/',
    keywords: ['cfop', 'cst', 'csosn', 'ncm', '101', '102', '500', '5102', '6102', 'tabela de codigos', 'nomenclatura comum do mercosul']
  },
  {
    id: 'nfe-05',
    title: 'DANFE vs Arquivo XML: Validade Jurídica e Guarda Obrigatória',
    subject: 'Notas Fiscais',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['danfe', 'xml', 'arquivo xml'],
    content: `Diferença essencial entre DANFE e arquivo XML:
- O XML (Extensible Markup Language) é o documento fiscal oficial com validade jurídica perante a lei. Ele contém a assinatura digital no padrão ICP-Brasil e a autorização de uso concedida pela SEFAZ.
- O DANFE (Documento Auxiliar da Nota Fiscal Eletrônica) é apenas uma representação gráfica impressa ou em PDF do XML. O DANFE não é nota fiscal por si só; sua função principal é acompanhar a mercadoria durante o transporte e fornecer a Chave de Acesso para consulta.
- Guarda Legal: Toda empresa (inclusive MEI e microempresas) deve arquivar com segurança os arquivos XML das notas emitidas e recebidas por no mínimo 5 anos contados do primeiro dia do exercício seguinte (Código Tributário Nacional, art. 173).`,
    sourceName: 'Portal Nacional da NF-e & Ajuste SINIEF 07/2005',
    sourceUrl: 'https://www.nfe.fazenda.gov.br/portal/principal.aspx',
    keywords: ['danfe', 'xml', 'arquivo xml', 'diferenca danfe e xml', 'validade juridica', 'guardar xml', 'guardar nota']
  },
  {
    id: 'nfe-06',
    title: 'Notas Fiscais de Entrada e Saída: Quando emitir',
    subject: 'Notas Fiscais',
    sphere: 'estadual',
    applicableRegimes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['nota de entrada', 'nota de saida', 'nota de saída', 'emissao propria', 'emissão própria'],
    content: `Diferenciação prática de operações de Entrada e Saída:
- NF-e de Saída: Emitida quando mercadorias saem da sua empresa (vendas, remessas para conserto, demonstração, bonificação ou transferência).
- NF-e de Entrada (Emissão Própria): A própria empresa emite quando recebe mercadorias em situações onde o remetente não é obrigado ou não tem condições de emitir nota fiscal. Exemplos:
  1. Compra de produtos ou insumos de pessoa física (sem CNPJ) ou produtor rural não emissor.
  2. Devolução de mercadoria feita por cliente pessoa física não contribuinte.
  3. Entrada de mercadorias importadas do exterior (desembaraço aduaneiro).
  4. Retorno de mercadorias que foram enviadas para conserto ou demonstração.`,
    sourceName: 'Manuais da NF-e & SEFAZ',
    sourceUrl: 'https://dfe-portal.svrs.rs.gov.br/Nfe/Documentos',
    keywords: ['nota de entrada', 'nota de saida', 'emissao propria', 'compra de pessoa fisica', 'devolucao de cliente', 'entrada de mercadoria']
  },
  {
    id: 'nfe-07',
    title: 'Devolução de Mercadorias: Procedimento e CFOPs Espelho',
    subject: 'Notas Fiscais',
    sphere: 'estadual',
    applicableRegimes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['devoluc', 'devoluç', 'devolver mercadoria'],
    content: `A devolução de mercadoria tem por objetivo anular total ou parcialmente uma operação anterior:
Como emitir a nota de devolução:
1. Referenciar a Chave de Acesso: É obrigatório informar no XML o campo da chave de acesso da nota original de compra ou venda.
2. Usar o CFOP de devolução correspondente:
   - Compra com CFOP 1.102 / 2.102 devolve com CFOP 5.202 (interna) ou 6.202 (interestadual).
   - Compra com CFOP 1.101 / 2.101 (industrialização) devolve com CFOP 5.201 ou 6.201.
3. Tributação idêntica à original: Devem ser espelhados os mesmos valores, bases de cálculo e alíquotas que constavam na nota fiscal original.
4. Para empresas do Simples Nacional: O imposto que eventualmente for creditado ou devolvido deve constar nas Informações Complementares caso o Simples não destaque em campo próprio.`,
    sourceName: 'CONFAZ — Convênio SINIEF s/nº de 1970',
    sourceUrl: 'https://www.confaz.fazenda.gov.br/',
    keywords: ['devolucao', 'devolver mercadoria', 'nota de devolucao', 'cfop devolucao', '5202', '6202', 'estorno']
  },
  {
    id: 'nfe-08',
    title: 'Operações Interestaduais, Alíquotas e DIFAL',
    subject: 'Notas Fiscais e ICMS',
    sphere: 'estadual',
    applicableRegimes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['difal', 'interestadual', 'diferencial de aliquota', 'diferencial de alíquota'],
    content: `Regras de circulação interestadual de mercadorias e DIFAL (Diferencial de Alíquotas):
- Alíquotas Interestaduais de ICMS:
  * 4%: Para produtos importados ou com conteúdo de importação superior a 40% (Resolução do Senado nº 13/2012).
  * 7%: Saídas das regiões Sul e Sudeste (exceto ES) com destino às regiões Norte, Nordeste, Centro-Oeste e Espírito Santo.
  * 12%: Saídas de quaisquer estados para Sul e Sudeste, ou entre estados da mesma região Norte/Nordeste/CO.
- DIFAL (Diferencial de Alíquotas): Representa a diferença entre a alíquota interna do estado de destino e a alíquota interestadual.
  * Nas vendas para consumidor final não contribuinte (pessoa física): O DIFAL é recolhido pelo remetente ao estado de destino (Emenda Constitucional 87/2015 e Lei Complementar 190/2022).
  * Importante para o Simples Nacional: O STF (ADI 5464) suspendeu a cobrança do DIFAL nas vendas interestaduais a consumidor final por empresas optantes do Simples Nacional, mantendo apenas a cobrança do diferencial nas compras para uso/consumo ou ativo imobilizado.`,
    sourceName: 'CONFAZ & Lei Complementar nº 190/2022',
    sourceUrl: 'https://www.confaz.fazenda.gov.br/',
    keywords: ['difal', 'operacao interestadual', 'aliquota interestadual', '4%', '7%', '12%', 'diferencial de aliquota', 'venda para outro estado']
  },
  {
    id: 'nfe-11',
    title: 'Principais Rejeições e Erros na Emissão da NF-e e como resolver',
    subject: 'Notas Fiscais',
    sphere: 'estadual',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['rejeic', 'rejeiç', 'erro de emissao', 'erro de nota', '204', '539', '610', '778'],
    content: `Causas e soluções para os erros e rejeições mais comuns na SEFAZ:
- Rejeição 204: Duplicidade de NF-e. Causa: Já existe uma nota autorizada com o mesmo número e série na SEFAZ. Solução: Avançar o número da nota fiscal para o próximo livre.
- Rejeição 539: Duplicidade com diferença na Chave de Acesso. Causa: A nota com esse número foi enviada anteriormente, mas os dados foram alterados e geraram outra chave. Solução: Consultar a chave original no portal da SEFAZ ou mudar a numeração.
- Rejeição 610: Total da NF difere do somatório dos Itens. Causa: Diferença de centavos entre o valor total dos produtos, frete, desconto e o valor final da nota. Solução: Recalcular o somatório exato no software emissor.
- Rejeição 778: Informado NCM inexistente. Causa: O código NCM informado foi extinto ou digitado errado. Solução: Consultar a tabela atualizada de NCM no Portal da Receita Federal.
- Rejeição 215 / 225: Falha no Schema XML. Causa: Campo obrigatório preenchido com caracteres inválidos, acentos, ou certificado digital vencido.`,
    sourceName: 'Manuais de Orientação do Contribuinte (MOC) — Portal da NF-e',
    sourceUrl: 'https://dfe-portal.svrs.rs.gov.br/Nfe/Documentos',
    keywords: ['rejeicao', 'rejeicao 204', 'rejeicao 539', 'rejeicao 610', 'rejeicao 778', 'erro de emissao', 'schema xml', 'duplicidade']
  },
  {
    id: 'nfe-12',
    title: 'Obrigatoriedade de Emissão de Notas Fiscais: Regras MEI e PME',
    subject: 'Notas Fiscais',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'ME/EPP'],
    requiredQueryTerms: ['obrigatoriedade', 'quando emitir', 'obrigada a emitir', 'dispensa de nota'],
    content: `Regulamentação sobre a obrigatoriedade da emissão de notas fiscais:
1. Microempreendedor Individual (MEI):
   - DISPENSADO de emitir nota quando vende produto ou presta serviço para PESSOA FÍSICA (consumidor final), a não ser que o cliente solicite.
   - OBRIGADO a emitir nota fiscal quando vende ou presta serviços para PESSOA JURÍDICA (outra empresa ou órgão público), salvo se a empresa compradora emitir nota de entrada própria.
   - Na prestação de serviços, deve emitir obrigatoriamente a NFS-e Nacional no portal gov.br/nfse.
2. Microempresas (ME) e Empresas de Pequeno Porte (EPP):
   - OBRIGATÓRIA a emissão de documento fiscal (NF-e, NFC-e ou NFS-e) em 100% das operações de venda de mercadorias ou prestação de serviços, independentemente do cliente ser pessoa física ou jurídica (Lei nº 8.846/1994, art. 1º).`,
    sourceName: 'Portal do Empreendedor & Lei Federal nº 8.846/1994',
    sourceUrl: 'https://www.gov.br/mei',
    keywords: ['obrigatoriedade', 'quando emitir nota', 'mei precisa emitir nota', 'dispensa de nota', 'venda para pessoa fisica', 'venda para empresa']
  },

  // =========================================================================
  // 5. IMPOSTOS E TRIBUTOS ESPECÍFICOS
  // =========================================================================
  {
    id: 'trib-01',
    title: 'ICMS e ICMS-ST (Substituição Tributária): Conceitos e Funcionamento',
    subject: 'ICMS',
    sphere: 'estadual',
    applicableRegimes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['icms', 'substituic', 'substituiç', 'mva'],
    content: `Funcionamento do ICMS e da Substituição Tributária (ICMS-ST):
- ICMS: Imposto de competência estadual que incide sobre a circulação de mercadorias, serviços de transporte interestadual/intermunicipal e comunicação.
- ICMS-ST (Substituição Tributária): Regime no qual a responsabilidade pelo recolhimento do ICMS de toda a cadeia (da fábrica até o consumidor final) é atribuída a um único contribuinte (geralmente o fabricante ou importador, chamado de substituto tributário).
- Como funciona a MVA (Margem de Valor Agregado): O fisco estima uma margem de lucro presumida para os revendedores e cobra o imposto antecipadamente.
- Vantagem para o revendedor no Simples Nacional: Quem revende produtos sujeitos a ICMS-ST deve segregar essas receitas no PGDAS-D, desmarcando a cobrança de ICMS no DAS, evitando pagar imposto em duplicidade.`,
    sourceName: 'CONFAZ & Portal da NF-e',
    sourceUrl: 'https://www.confaz.fazenda.gov.br/',
    keywords: ['icms', 'icms-st', 'icms st', 'substituicao tributaria', 'mva', 'margem de valor agregado', 'segregacao de receita', 'imposto estadual mercadoria']
  },
  {
    id: 'trib-02',
    title: 'ISS (Imposto Sobre Serviços) e Retenção Municipal (LC 116/2003)',
    subject: 'ISS',
    sphere: 'municipal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['iss', 'issqn', '116/2003', 'lc 116', 'imposto sobre servico', 'imposto sobre serviço'],
    content: `Regras do Imposto Sobre Serviços de Qualquer Natureza (ISSQN):
- Legislação de Regência: Lei Complementar nº 116/2003 e leis municipais de cada cidade.
- Alíquotas: O piso constitucional do ISS é de 2% e o teto máximo é de 5%.
- Onde o imposto é devido: Como regra geral (art. 3º), o ISS é devido no município do estabelecimento prestador do serviço.
- Exceções (onde o imposto é devido no local da prestação): Serviços de construção civil, limpeza, segurança, vigilância, instalação de andaimes e organização de feiras/eventos têm o ISS devido na cidade onde a obra ou evento ocorre, havendo retenção na fonte pelo tomador.
- MEI: Paga valor fixo mensal de R$ 5,00 de ISS embutido no DAS, dispensado de recolhimento percentual.
LEMBRETE: O ISS é exclusivo para PRESTAÇÃO DE SERVIÇOS municipais e não se confunde com Imposto de Renda ou ICMS.`,
    sourceName: 'Portal da Legislação — Lei Complementar nº 116/2003',
    sourceUrl: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm',
    keywords: ['iss', 'issqn', 'imposto sobre servicos', 'lc 116', 'local da prestacao', 'aliquota iss', '2%', '5%', 'retencao de iss']
  },
  {
    id: 'trib-03',
    title: 'PIS e COFINS: Regimes Cumulativo, Não Cumulativo e Monofásicos',
    subject: 'PIS e COFINS',
    sphere: 'federal',
    applicableRegimes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['pis', 'cofins', 'monofasico', 'monofásico'],
    content: `Estrutura de tributação das contribuições federais PIS e COFINS:
1. Regime Cumulativo (aplicável ao Lucro Presumido):
   - Alíquotas: PIS 0,65% e COFINS 3,00% (total de 3,65% sobre a receita bruta).
   - Sem direito a créditos sobre custos ou despesas.
2. Regime Não Cumulativo (aplicável ao Lucro Real):
   - Alíquotas: PIS 1,65% e COFINS 7,60% (total de 9,25% sobre a receita).
   - Com direito a abater créditos fiscais calculados sobre aquisição de mercadorias para revenda, insumos, energia elétrica, aluguéis de prédios da atividade.
3. Produtos Monofásicos (Bebidas frias, cosméticos, autopeças, combustíveis, produtos farmacêuticos):
   - O PIS e a COFINS são recolhidos de forma concentrada pelo fabricante ou importador.
   - Atacadistas e varejistas (inclusive do Simples Nacional) têm direito à alíquota ZERO nessas vendas. No Simples Nacional, deve-se segregar a receita de monofásicos no PGDAS-D para não pagar PIS/COFINS novamente.`,
    sourceName: 'Receita Federal — EFD-Contribuições & Perguntas e Respostas',
    sourceUrl: 'https://www.gov.br/sped/pt-br/assuntos/escrituracoes-digitais/efd-contribuicoes',
    keywords: ['pis', 'cofins', 'cumulativo', 'nao cumulativo', '0.65%', '3%', '1.65%', '7.6%', 'monofasico', 'produtos monofasicos', 'credito pis cofins']
  },
  {
    id: 'trib-04',
    title: 'IRPJ e CSLL: Como calcular no Lucro Presumido e Lucro Real',
    subject: 'IRPJ e CSLL',
    sphere: 'federal',
    applicableRegimes: ['Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['irpj', 'csll', 'lucro presumido', 'lucro real'],
    content: `Cálculo do Imposto de Renda Pessoa Jurídica (IRPJ) e Contribuição Social sobre o Lucro Líquido (CSLL):
1. No Lucro Presumido:
   - Base de Presunção da Receita: 8% para atividades de comércio e indústria; 32% para prestação de serviços em geral.
   - Alíquota do IRPJ: 15% sobre a base presumida + adicional de 10% sobre a parcela do lucro presumido que ultrapassar R$ 60.000,00 no trimestre (R$ 20.000,00 por mês).
   - Alíquota da CSLL: 9% sobre a base de presunção (que é de 12% para comércio/indústria e 32% para serviços).
   - Apuração trimestral (vencimento no último dia útil de abril, julho, outubro e janeiro).
2. No Lucro Real:
   - IRPJ (15% + 10% adicional) e CSLL (9%) são calculados sobre o Lucro Líquido Contábil real apurado pela contabilidade, ajustado no LALUR pelas adições e exclusões previstas na lei. Se a empresa tiver prejuízo fiscal no período, não paga IRPJ nem CSLL.`,
    sourceName: 'Receita Federal — Perguntas e Respostas ECF',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas',
    keywords: ['irpj', 'csll', 'lucro presumido', 'lucro real', 'presuncao 32%', 'presuncao 8%', 'adicional de irpj', 'lalur', 'prejuizo fiscal']
  },
  {
    id: 'trib-05',
    title: 'IPI (Imposto sobre Produtos Industrializados) e Equiparação',
    subject: 'IPI',
    sphere: 'federal',
    applicableRegimes: ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['ipi', 'produtos industrializados', 'tipi', 'industrializac', 'industrializaç'],
    content: `Diretrizes sobre o Imposto sobre Produtos Industrializados (IPI):
- Competência: Federal (Receita Federal do Brasil).
- Fato Gerador: Desembaraço aduaneiro de produtos importados ou a saída de produto do estabelecimento industrial ou equiparado a indústria.
- O que é Equiparação Industrial: Estabelecimentos comerciais atacadistas que importam mercadorias do exterior ou distribuem produtos saídos de estabelecimentos industriais da mesma empresa são equiparados a indústria por lei.
- Alíquotas: Definidas na TIPI (Tabela de Incidência do IPI), variando conforme a essencialidade do produto (alimentos básicos têm alíquota 0%; bebidas, tabaco e supérfluos têm alíquotas elevadas).
- No Simples Nacional: O IPI é pago unificado no Anexo II (com alíquota inicial de 0,5% agregada).`,
    sourceName: 'Receita Federal — Tabela TIPI & Perguntas e Respostas',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas',
    keywords: ['ipi', 'produtos industrializados', 'tipi', 'equiparado a industria', 'aliquota ipi', 'anexo ii']
  },
  {
    id: 'trib-06',
    title: 'Simples Nacional: Anexos I a V, Tabela de Alíquotas e Fator R',
    subject: 'Simples Nacional',
    sphere: 'federal',
    applicableRegimes: ['Simples Nacional'],
    requiredQueryTerms: ['simples nacional', 'anexo i', 'anexo ii', 'anexo iii', 'anexo iv', 'anexo v', 'fator r', 'pgdas'],
    content: `Estrutura completa de anexos e tributação do Simples Nacional:
- Anexo I: Comércio (alíquota nominal de 4% a 19%).
- Anexo II: Indústria (alíquota nominal de 4,5% a 30%).
- Anexo III: Serviços em geral (instalação, manutenção, agências, academias, alíquota de 6% a 33%).
- Anexo IV: Serviços com INSS patronal pago por fora (construção civil, vigilância, limpeza, advocacia - alíquota de 4,5% a 33%).
- Anexo V: Serviços intelectuais, desenvolvimento de software, consultoria, engenharia (alíquota inicial mais alta, de 15,5% a 30,5%).
- O QUE É O FATOR R E COMO REDUZIR IMPOSTO:
  * O Fator R é a divisão da Folha de Pagamento dos últimos 12 meses (salários + pró-labore + encargos) pela Receita Bruta dos últimos 12 meses.
  * Se o resultado for IGUAL OU SUPERIOR A 28% (0,28): A empresa que estaria no Anexo V (15,5%) migra automaticamente para o Anexo III (6,0%), gerando uma economia de mais de 60% no imposto mensal!`,
    sourceName: 'Receita Federal — Manuais do Simples Nacional & LC 123/2006',
    sourceUrl: 'https://www8.receita.fazenda.gov.br/SimplesNacional/ConteudoApoio/Manuais/TelaManuais.aspx',
    keywords: ['simples nacional', 'anexos', 'anexo i', 'anexo ii', 'anexo iii', 'anexo iv', 'anexo v', 'fator r', '28%', 'folha de pagamento', 'pgdas']
  },
  {
    id: 'emp-03',
    title: 'Reforma Tributária do Consumo: CBS, IBS, Imposto Seletivo e o Simples Nacional',
    subject: 'Reforma Tributária',
    sphere: 'federal',
    applicableRegimes: ['MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real'],
    requiredQueryTerms: ['reforma tributaria', 'reforma tributária', 'cbs', 'ibs', 'imposto seletivo'],
    content: `Panorama oficial da Reforma Tributária do Consumo aprovada pela Emenda Constitucional nº 132/2023:
1. O que muda:
   - Extingue cinco tributos atuais sobre o consumo: PIS, COFINS e IPI (federais), ICMS (estadual) e ISS (municipal).
   - Cria o modelo de IVA Dual (Imposto sobre Valor Agregado):
     * CBS (Contribuição sobre Bens e Serviços): Tributo unificado da União (federal).
     * IBS (Imposto sobre Bens e Serviços): Tributo compartilhado entre Estados e Municípios.
     * Imposto Seletivo (IS): Tributo federal que incidirá sobre bens e serviços prejudiciais à saúde ou ao meio ambiente (cigarros, bebidas alcoólicas, etc.).
2. Cronograma de Transição:
   - 2026: Início com alíquotas de teste (0,9% de CBS e 0,1% de IBS).
   - 2027: Cobrança plena da CBS e extinção do PIS e da COFINS.
   - 2029 a 2032: Redução gradual do ICMS e ISS e aumento proporcional do IBS.
   - 2033: Plena vigência do novo sistema tributário nacional.
3. COMO FICA O SIMPLES NACIONAL E O MEI:
   - O Simples Nacional e o MEI continuam existindo e mantêm o tratamento favorecido garantido na Constituição!
   - A empresa optante pelo Simples Nacional poderá escolher:
     Opção A: Continuar recolhendo tudo pelo DAS unificado como faz hoje (seus clientes tomam crédito tributário equivalente ao valor de CBS e IBS que constar embutido no DAS).
     Opção B: Optar por recolher a CBS e o IBS pelo regime geral (por fora do DAS), permitindo que seus clientes tomem crédito integral da alíquota padrão, o que é muito vantajoso para quem vende para grandes empresas (B2B).`,
    sourceName: 'Receita Federal — Entenda a Reforma Tributária do Consumo',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/entenda',
    keywords: ['reforma tributaria', 'cbs', 'ibs', 'imposto seletivo', 'iva dual', 'transicao reforma', 'reforma simples nacional', 'ec 132']
  }
];

/**
 * Strict RAG Retrieval:
 * 1. Checks scope
 * 2. Requires at least one core term from requiredQueryTerms
 * 3. Filters stopwords
 * 4. Demands strict relevance score (>= 15)
 */
export function retrieveRelevantKnowledge(
  query: string, 
  maxResults: number = 3
): { chunks: RAGKnowledgeChunk[]; isConfident: boolean; domain: DetectedTaxDomain } {
  const domain = detectTaxDomain(query);

  if (domain === 'NON_FISCAL') {
    return { chunks: [], isConfident: false, domain: 'NON_FISCAL' };
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery
    .split(/[\s,.;:?!()/]+/)
    .map(t => t.trim())
    .filter(t => t.length > 2 && !STOPWORDS.has(t));

  if (queryTokens.length === 0) {
    return { chunks: [], isConfident: false, domain };
  }

  const scored = OFFICIAL_RAG_KNOWLEDGE_BASE.map(chunk => {
    // CRITICAL: A chunk is ONLY eligible if at least one of its requiredQueryTerms is present in the query
    if (chunk.requiredQueryTerms && chunk.requiredQueryTerms.length > 0) {
      const hasRequiredTerm = chunk.requiredQueryTerms.some(term => normalizedQuery.includes(term.toLowerCase()));
      if (!hasRequiredTerm) {
        return { chunk, score: 0 };
      }
    }

    let score = 0;

    // Strict Domain Boundary Enforcement
    if (domain === 'IMPOSTO_DE_RENDA') {
      if (chunk.id === 'trib-02' || chunk.subject === 'ISS' || (chunk.subject === 'ICMS' && !chunk.id.includes('diff'))) {
        return { chunk, score: -100 };
      }
      if (chunk.id.startsWith('ir-') || chunk.subject === 'Imposto de Renda') {
        score += 40;
      }
    } else if (domain === 'ISS') {
      if (chunk.subject === 'Imposto de Renda' || chunk.id.startsWith('ir-')) {
        return { chunk, score: -100 };
      }
      if (chunk.subject === 'ISS') {
        score += 40;
      }
    } else if (domain === 'ICMS' || domain === 'ICMS_ST') {
      if (chunk.subject === 'ISS' && chunk.id !== 'trib-diff-01') {
        return { chunk, score: -100 };
      }
      if (chunk.subject === 'ICMS') {
        score += 40;
      }
    } else if (domain === 'SEFAZ_PR') {
      if (chunk.id === 'src-sefaz-pr-01') score += 60;
    } else if (domain === 'EFD_REINF') {
      if (chunk.id === 'src-reinf-01') score += 60;
    } else if (domain === 'SISCOMEX') {
      if (chunk.id === 'src-siscomex-01') score += 60;
    } else if (domain === 'COSIT') {
      if (chunk.id === 'src-cosit-01') score += 60;
    } else if (domain === 'NORMAS_RFB') {
      if (chunk.id === 'src-normas-rfb-01') score += 60;
    } else if (domain === 'DOU') {
      if (chunk.id === 'src-dou-01') score += 60;
    } else if (domain === 'CFC') {
      if (chunk.id === 'src-cfc-01') score += 60;
    } else if (domain === 'DIFF_TRIBUTOS') {
      if (chunk.id.startsWith('trib-diff-')) score += 50;
    } else if (domain === 'NOTAS_FISCAIS') {
      if (chunk.subject === 'Notas Fiscais' || chunk.id.startsWith('nfe-')) score += 30;
    }

    // Match exact keywords
    for (const kw of chunk.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += 20;
      }
    }

    // Match filtered content tokens (ignoring stopwords)
    const titleLower = chunk.title.toLowerCase();
    const subjectLower = chunk.subject.toLowerCase();
    const contentLower = chunk.content.toLowerCase();

    for (const token of queryTokens) {
      if (titleLower.includes(token)) score += 8;
      if (subjectLower.includes(token)) score += 5;
      if (contentLower.includes(token)) score += 2;
    }

    return { chunk, score };
  });

  // Strict Threshold: score must be at least 15 to be considered relevant
  const confidentItems = scored.filter(item => item.score >= 15);
  confidentItems.sort((a, b) => b.score - a.score);

  if (confidentItems.length > 0) {
    return {
      chunks: confidentItems.map(item => item.chunk).slice(0, maxResults),
      isConfident: true,
      domain
    };
  }

  // If no document has sufficient confidence, return zero chunks
  return {
    chunks: [],
    isConfident: false,
    domain
  };
}

/**
 * Validates that an answer corresponds to the requested tax/subject before exhibition
 */
export function validateFiscalAnswer(query: string, reply: string, domain: DetectedTaxDomain): boolean {
  if (!reply || typeof reply !== 'string') return false;
  if (reply.includes(MANDATORY_INSUFFICIENT_INFO_MESSAGE)) return true;

  const replyLower = reply.toLowerCase();

  // If domain is Imposto de Renda, reply must NOT explain ISS
  if (domain === 'IMPOSTO_DE_RENDA') {
    if (replyLower.includes('imposto sobre serviço') || (replyLower.includes('iss') && !replyLower.includes('renda'))) {
      return false;
    }
    if (!replyLower.includes('renda') && !replyLower.includes('irpf') && !replyLower.includes('irpj')) {
      return false;
    }
  }

  // If domain is ISS, reply must NOT explain Imposto de Renda
  if (domain === 'ISS') {
    if (replyLower.includes('imposto de renda') && !replyLower.includes('iss')) {
      return false;
    }
    if (!replyLower.includes('iss') && !replyLower.includes('serviço') && !replyLower.includes('servico')) {
      return false;
    }
  }

  // If domain is non-fiscal, answer must strictly be the fallback
  if (domain === 'NON_FISCAL') {
    return reply.includes(MANDATORY_INSUFFICIENT_INFO_MESSAGE);
  }

  return true;
}

/**
 * Accessible response synthesizer:
 * 1. Blocks out-of-scope inquiries immediately
 * 2. Matches exact domain
 * 3. Enforces groundedness: if no relevant documents exist, returns MANDATORY_INSUFFICIENT_INFO_MESSAGE
 */
export function generateAccessibleAnswer(
  query: string, 
  companyProfile?: any
): { reply: string; sources: { name: string; url: string; snippet?: string }[]; isInsufficient?: boolean } {
  // 1. Scope check
  if (!isQueryInFiscalScope(query)) {
    return {
      reply: MANDATORY_INSUFFICIENT_INFO_MESSAGE,
      sources: [],
      isInsufficient: true
    };
  }

  const normalized = (query || '').toLowerCase().trim();
  const domain = detectTaxDomain(query);

  if (domain === 'NON_FISCAL') {
    return {
      reply: MANDATORY_INSUFFICIENT_INFO_MESSAGE,
      sources: [],
      isInsufficient: true
    };
  }

  // 2. Imposto de Renda (IRPF e IRPJ)
  if (domain === 'IMPOSTO_DE_RENDA') {
    const isPf = normalized.includes('pessoa física') || normalized.includes('pessoa fisica') || normalized.includes('irpf') || normalized.includes('titular') || normalized.includes('sócio') || normalized.includes('socio');
    const isPj = normalized.includes('pessoa jurídica') || normalized.includes('pessoa juridica') || normalized.includes('irpj') || normalized.includes('empresa') || normalized.includes('cnpj');

    if (isPf && !isPj) {
      return {
        reply: `O IRPF (Imposto de Renda da Pessoa Física) é o imposto federal que incide sobre os rendimentos do cidadão no seu CPF. Veja como funciona na prática para quem tem empresa:
• Quem deve declarar: Pessoas físicas que receberam rendimentos tributáveis acima do teto anual fixado pela Receita Federal, tiveram rendimentos isentos/não tributáveis acima do limite regulamentar ou possuem bens e direitos expressivos.
• Pró-labore do sócio: É considerado rendimento tributável. Sobre ele incide o INSS e o IRPF retido na fonte conforme a tabela progressiva (com alíquotas de 0% até 27,5%).
• Distribuição de lucros e dividendos: É isenta de imposto de renda no IRPF (Lei 9.249/1995), desde que a empresa esteja com os tributos em dia e comprove a apuração contábil regular.
• MEI: O titular do MEI calcula uma parcela isenta sobre o faturamento bruto (32% para serviços, 8% para comércio). Apenas o que sobrar após deduzir as despesas do negócio entra no cálculo de rendimentos tributáveis do IRPF.
Onde consultar: No portal oficial "Meu Imposto de Renda" da Receita Federal (gov.br/receitafederal).`,
        sources: [
          { name: 'Receita Federal — Meu Imposto de Renda', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda', snippet: 'Declaração e Regras do IRPF' },
          { name: 'Portal da Legislação — Lei nº 9.249/1995', url: 'https://www.planalto.gov.br/ccivil_03/leis/l9249.htm', snippet: 'Isenção de Lucros e Dividendos' }
        ]
      };
    }

    if (isPj && !isPf) {
      return {
        reply: `O IRPJ (Imposto de Renda da Pessoa Jurídica) é o imposto federal que incide sobre o lucro ou faturamento das empresas (CNPJ). Entenda a forma de pagamento em cada regime:
• No Simples Nacional: O IRPJ já está embutido na alíquota unificada que você paga todo mês na guia DAS. Não é necessário emitir guia separada.
• No Lucro Presumido: A Receita Federal presume qual foi o seu lucro (8% para comércio e 32% para serviços). Sobre esse valor presumido, aplica-se a alíquota de 15% de IRPJ, mais um adicional de 10% sobre a parcela do lucro que ultrapassar R$ 20.000,00 por mês. O pagamento é trimestral via DARF.
• No Lucro Real: O imposto incide sobre o lucro líquido contábil comprovado. Se a empresa fechar o período com prejuízo fiscal, não há cobrança de IRPJ.
Atenção: O IRPJ é um imposto exclusivamente federal e não se confunde com o ISS (que é municipal) nem com o ICMS (que é estadual).`,
        sources: [
          { name: 'Receita Federal — Perguntas e Respostas da PJ', url: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas', snippet: 'Tributação do IRPJ' },
          { name: 'Portal do Simples Nacional', url: 'https://www8.receita.fazenda.gov.br/SimplesNacional/', snippet: 'Tributos Unificados no DAS' }
        ]
      };
    }

    return {
      reply: `O Imposto de Renda é um tributo federal arrecadado pela Receita Federal sobre o ganho de capital, lucros e rendimentos obtidos por pessoas físicas e empresas. Ele se divide em dois tipos fundamentais:
1. IRPF (Pessoa Física):
• Quem paga: Cidadãos (CPF) que recebem salários, pró-labore, aluguéis ou ganhos acima da faixa de isenção.
• Como funciona: Utiliza a tabela progressiva com alíquotas que variam de 0% (isento) até 27,5%. O acerto de contas é feito anualmente na Declaração de Ajuste Anual.
2. IRPJ (Pessoa Jurídica):
• Quem paga: Empresas com CNPJ ativo.
• Como funciona: Depende do regime tributário. No Simples Nacional, o IRPJ é recolhido de forma simplificada e unificada dentro da guia mensal do DAS. No Lucro Presumido e Real, é apurado a cada trimestre e pago via DARF com alíquota de 15% mais adicional de 10% sobre lucros altos.
Importante: O Imposto de Renda é um imposto de competência da União (federal) sobre a renda. Ele é totalmente diferente do ISS (que é imposto municipal sobre serviços) e do ICMS (que é imposto estadual sobre mercadorias).
Onde consultar: No portal oficial da Receita Federal (gov.br/receitafederal).`,
      sources: [
        { name: 'Receita Federal — Perguntas e Respostas', url: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas', snippet: 'Orientações Gerais sobre Imposto de Renda' },
        { name: 'Portal da Legislação — Lei nº 9.249/1995', url: 'https://www.planalto.gov.br/ccivil_03/leis/l9249.htm', snippet: 'Legislação do Imposto de Renda' }
      ]
    };
  }

  // 3. Diferença entre ICMS e ISS
  if (domain === 'DIFF_TRIBUTOS') {
    if (normalized.includes('icms') && normalized.includes('iss')) {
      return {
        reply: `Veja a diferença fundamental entre ICMS e ISS para não errar na sua empresa:
• ICMS (Estadual): Imposto cobrado pelo Governo do Estado sobre a circulação de mercadorias e produtos físicos (vendas de lojas, supermercados, fábricas), além de frete interestadual e comunicação. É documentado com NF-e (Modelo 55) ou NFC-e (Modelo 65).
• ISS (Municipal): Imposto cobrado pela Prefeitura da sua cidade sobre a prestação de serviços (consultoria, suporte de TI, oficinas, cabeleireiros, clínicas). É documentado com a NFS-e (Nota Fiscal de Serviços).
Exemplo prático:
Se você leva o carro à oficina e troca uma peça:
- A peça vendida paga ICMS estadual.
- A mão de obra do mecânico para consertar paga ISS municipal.
Regra de ouro: Um mesmo item não sofre cobrança dupla de ICMS e ISS ao mesmo tempo.`,
        sources: [
          { name: 'Constituição Federal — Art. 155 e 156', url: 'https://www.planalto.gov.br/', snippet: 'Competências Tributárias' },
          { name: 'Portal da Legislação — Lei Complementar nº 116/2003', url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm', snippet: 'Lei Geral do ISSQN' }
        ]
      };
    }

    if (normalized.includes('pis') && normalized.includes('cofins')) {
      return {
        reply: `PIS e COFINS são duas contribuições federais sobre o faturamento, mas têm destinações e alíquotas diferentes:
• PIS: Destinado a financiar o pagamento do abono salarial e do seguro-desemprego aos trabalhadores. Alíquota de 0,65% no Lucro Presumido e 1,65% no Lucro Real.
• COFINS: Destinada ao custeio da Seguridade Social (aposentadorias da Previdência, Sistema Único de Saúde e assistência social). Alíquota de 3,00% no Lucro Presumido e 7,60% no Lucro Real.
No Simples Nacional: Ambas são recolhidas em alíquotas reduzidas já incluídas no cálculo mensal do DAS. Se a sua empresa vende produtos monofásicos (bebidas, autopeças, perfumaria), a revenda tem alíquota zero dessas contribuições.`,
        sources: [
          { name: 'Receita Federal — EFD-Contribuições', url: 'https://www.gov.br/sped/pt-br/assuntos/escrituracoes-digitais/efd-contribuicoes', snippet: 'PIS e COFINS' },
          { name: 'Portal SPED', url: 'https://www.gov.br/sped/pt-br', snippet: 'Escrituração Fiscal Digital' }
        ]
      };
    }
  }

  // 4. ISS
  if (domain === 'ISS') {
    return {
      reply: `O ISS (Imposto Sobre Serviços) é o tributo cobrado pela Prefeitura sobre serviços prestados. Veja as principais regras da Lei Complementar nº 116/2003:
• Alíquotas: Cada município fixa suas alíquotas por lei própria, obrigatoriamente entre o piso de 2% e o teto máximo de 5%.
• Onde pagar o imposto:
  - Regra geral: O imposto pertence à cidade onde a sua empresa está sediada (onde está registrado o seu CNPJ).
  - Exceções obrigatórias: Para serviços como obras e reformas da construção civil, limpeza predial, segurança e vigilância armada, andaimes e eventos/shows, o ISS deve ser pago para a cidade onde o serviço foi efetivamente executado.
• Retenção na fonte: Nesses casos de exceção, quem contratou você retém o valor do ISS diretamente da nota fiscal e repassa aos cofres da Prefeitura local.
• MEI: O MEI paga apenas R$ 5,00 fixos mensais de ISS embutidos na guia DAS e está dispensado de retenção na fonte.
Lembrete: O ISS incide exclusivamente sobre prestação de serviços municipais, não tendo relação com ICMS ou Imposto de Renda.`,
      sources: [
        { name: 'Portal da Legislação — Lei Complementar nº 116/2003', url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm', snippet: 'Lei Geral do ISSQN' },
        { name: 'Portal Nacional da NFS-e', url: 'https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual', snippet: 'NFS-e Padrão Nacional' }
      ]
    };
  }

  // 5. SEFAZ Paraná
  if (domain === 'SEFAZ_PR') {
    return {
      reply: `Orientações oficiais da Secretaria da Fazenda do Estado do Paraná (SEFAZ-PR):
• ICMS no Paraná: Regulamentado pelo RICMS/PR (Decreto Estadual nº 7.871/2017). A alíquota interna padrão de ICMS no Paraná é de 19,5%.
• Substituição Tributária (ICMS-ST no PR): As regras e mercadorias sujeitas à retenção antecipada no Paraná constam detalhadas no Anexo IX do RICMS/PR.
• DeSTDA (Declaração de Substituição Tributária, Diferencial de Alíquota e Antecipação): Obrigação acessória mensal que as empresas do Simples Nacional que operam com o Paraná transmitem até o dia 28 de cada mês para prestar contas do ICMS-ST e do diferencial de alíquotas.
• Portal Receita/PR: Canal oficial para emitir a guia DARE do Paraná, consultar inscrições estaduais no CAD/ICMS e autorizar documentos fiscais eletrônicos.
Onde consultar: Acesse o portal oficial da SEFAZ-PR em fazenda.pr.gov.br.`,
      sources: [
        { name: 'Secretaria da Fazenda do Paraná (SEFAZ-PR)', url: 'https://www.fazenda.pr.gov.br/', snippet: 'Legislação e Serviços do ICMS no Paraná' },
        { name: 'Regulamento do ICMS do Paraná (RICMS/PR)', url: 'https://www.fazenda.pr.gov.br/', snippet: 'Decreto Estadual nº 7.871/2017' }
      ]
    };
  }

  // 6. EFD-Reinf
  if (domain === 'EFD_REINF') {
    return {
      reply: `A EFD-Reinf (Escrituração Fiscal Digital de Retenções e Outras Informações Fiscais) é o sistema do SPED voltado à declaração de retenções de impostos:
• O que deve ser informado: Retenções de tributos federais sobre serviços tomados ou prestados, especialmente a Série R-4000:
  - Evento R-4010: Pagamentos e retenções de IRRF a pessoas físicas (ex: honorários a autônomos, aluguéis).
  - Evento R-4020: Retenções na fonte de PIS, COFINS, CSLL (CSRF) e IRRF sobre notas fiscais de serviços tomados de outras empresas.
• Prazo de envio: Até o dia 15 do mês seguinte ao dos pagamentos. Se o dia 15 cair em final de semana ou feriado, o envio deve ser antecipado para o dia útil anterior.
• Integração com a DCTFWeb: Ao transmitir a EFD-Reinf, os débitos migram automaticamente para a DCTFWeb no e-CAC para emissão da guia DARF unificada com código de barras e Pix.
• MEI e Pequenas Empresas: O MEI sem retenções está dispensado. Empresas do Simples Nacional que contratam serviços com retenção na fonte precisam transmitir a EFD-Reinf.`,
      sources: [
        { name: 'Receita Federal — EFD-Reinf', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/efd-reinf', snippet: 'Manual de Orientação da EFD-Reinf' },
        { name: 'Portal SPED', url: 'https://www.gov.br/sped/pt-br', snippet: 'Escrituração Fiscal Digital de Retenções' }
      ]
    };
  }

  // 7. Siscomex
  if (domain === 'SISCOMEX') {
    return {
      reply: `O Siscomex (Sistema Integrado de Comércio Exterior) é a plataforma oficial do Governo Federal para operações de importação e exportação:
• Habilitação no Radar: Antes de importar ou exportar pelo CNPJ, a empresa precisa solicitar habilitação no Radar através do Portal Único Siscomex (gov.br/siscomex). A modalidade Expresso atende MEIs e microempresas com limite de até US$ 50 mil a cada semestre.
• Tributos incidentes na importação:
  1. II (Imposto de Importação): Alíquota fixada na Tarifa Externa Comum (TEC) de acordo com a NCM do produto.
  2. IPI-Importação: Cobrado na entrada do produto no Brasil.
  3. PIS-Importação e COFINS-Importação: Contribuições federais aduaneiras.
  4. ICMS-Importação: Imposto estadual recolhido para o estado onde a mercadoria é desembaraçada.
• Desembaraço e Duimp: A liberação das mercadorias é processada pela Declaração Única de Importação (Duimp).
• Simples Nacional e MEI: Empresas optantes pelo Simples podem importar produtos, mas os impostos da importação são pagos no desembaraço aduaneiro por fora do DAS.`,
      sources: [
        { name: 'Portal Siscomex', url: 'https://www.gov.br/siscomex/pt-br', snippet: 'Portal Único de Comércio Exterior' },
        { name: 'Receita Federal — Aduana e Comércio Exterior', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior', snippet: 'Regras de Importação e Radar' }
      ]
    };
  }

  // 8. Soluções de Consulta COSIT
  if (domain === 'COSIT') {
    return {
      reply: `As Soluções de Consulta COSIT são os pronunciamentos oficiais da Coordenação-Geral de Tributação da Receita Federal:
• O que são: Respostas formais da Receita Federal a dúvidas apresentadas por contribuintes sobre a aplicação das leis tributárias.
• Efeito vinculante: Conforme a Instrução Normativa RFB nº 2.058/2021, a Solução de Consulta COSIT tem força vinculante para toda a administração tributária federal. Isso significa que nenhum auditor fiscal pode autuar um contribuinte que esteja seguindo a orientação oficial publicada pela COSIT.
• Segurança para o negócio: Servem como base jurídica sólida para empresas tirarem dúvidas sobre enquadramento no Simples Nacional, Fator R, regras de retenção na fonte e tributação de novos modelos de negócios.
Onde consultar: No portal oficial da Receita Federal na seção de Legislação > Soluções de Consultas e Divergências.`,
      sources: [
        { name: 'Receita Federal — Soluções de Consulta COSIT', url: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/solucoes-de-consultas-e-de-divergencias', snippet: 'Interpretações Vinculantes da RFB' },
        { name: 'Receita Federal — IN RFB nº 2.058/2021', url: 'https://normas.receita.fazenda.gov.br/', snippet: 'Processo de Consulta Tributária' }
      ]
    };
  }

  // 9. Diário Oficial da União (DOU)
  if (domain === 'DOU') {
    return {
      reply: `O Diário Oficial da União (DOU), publicado pela Imprensa Nacional (in.gov.br), é o jornal oficial do Governo Federal:
• Importância no Direito Tributário: Nenhuma lei, medida provisória, decreto ou instrução normativa que crie ou aumente impostos tem validade antes de ser publicada oficialmente no DOU.
• Princípios de proteção ao contribuinte:
  - Princípio da Anterioridade Anual: Leis que aumentam impostos publicadas no DOU em um ano só podem ser cobradas a partir do dia 1º de janeiro do ano seguinte.
  - Princípio da Noventena (Anterioridade Nonagesimal): O governo precisa aguardar pelo menos 90 dias após a publicação no DOU para iniciar a cobrança de novas contribuições sociais ou alterações no ICMS/IPI.
• Acesso: As publicações diárias da Seção 1 (onde saem os atos normativos federais) são gratuitas e públicas no portal oficial in.gov.br.`,
      sources: [
        { name: 'Diário Oficial da União (DOU) — Imprensa Nacional', url: 'https://www.in.gov.br/', snippet: 'Publicações Oficiais da República' },
        { name: 'Portal da Legislação — Planalto', url: 'https://www.planalto.gov.br/', snippet: 'Legislação Federal Compilada' }
      ]
    };
  }

  // 10. CFC
  if (domain === 'CFC') {
    return {
      reply: `O Conselho Federal de Contabilidade (CFC) é o órgão responsável pela normatização da contabilidade no Brasil:
• Normas Brasileiras de Contabilidade para PMEs: A NBC TG 1000 e as normas simplificadas NBC TG 1001 e 1002 definem as regras contábeis para microempresas e empresas de pequeno porte.
• Demonstrações Contábeis Essenciais:
  - Balanço Patrimonial: Mostra os bens, direitos e dívidas da empresa em uma data de encerramento.
  - Demonstração do Resultado do Exercício (DRE): Apura se a empresa obteve lucro líquido ou prejuízo operacional no período.
• Princípio da Entidade: Regra indispensável que proíbe misturar o dinheiro e despesas pessoais dos sócios com as contas da empresa.
• Importância para a distribuição de lucros: Manter a contabilidade regular conforme as normas do CFC garante que os lucros distribuídos aos sócios fiquem 100% isentos de imposto de renda no IRPF.`,
      sources: [
        { name: 'Conselho Federal de Contabilidade (CFC)', url: 'https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/', snippet: 'Normas Brasileiras de Contabilidade (NBC TG 1000)' },
        { name: 'Comitê de Pronunciamentos Contábeis (CPC)', url: 'https://www.cpc.org.br/', snippet: 'Pronunciamentos Contábeis Técnicos' }
      ]
    };
  }

  // 11. Notas Fiscais (NF-e, NFC-e, NFS-e, CFOP, Cancelamento)
  if (domain === 'NOTAS_FISCAIS') {
    if (normalized.includes('modelo') || normalized.includes('quais sao') || normalized.includes('quais são')) {
      return {
        reply: `Existem três modelos principais de notas fiscais eletrônicas no Brasil:
• NF-e (Modelo 55): Para venda e circulação de mercadorias e produtos físicos entre empresas (B2B) ou vendas interestaduais. Autorizada pela SEFAZ estadual.
• NFC-e (Modelo 65): Nota do consumidor final, emitida no balcão do varejo físico (substituiu o cupom fiscal antigo).
• NFS-e: Nota exclusiva para prestação de serviços. Microempreendedores Individuais (MEIs) utilizam obrigatoriamente o Portal Nacional da NFS-e (gov.br/nfse).
Se você comercializa produtos, utiliza NF-e ou NFC-e. Se você presta serviços, utiliza a NFS-e.`,
        sources: [
          { name: 'Portal Nacional da NF-e', url: 'https://www.nfe.fazenda.gov.br/portal/principal.aspx', snippet: 'Modelos Oficiais de NF-e e NFC-e' },
          { name: 'Portal Nacional da NFS-e', url: 'https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual', snippet: 'NFS-e Padrão Nacional' }
        ]
      };
    }

    if (normalized.includes('cancelar') || normalized.includes('cancelamento') || normalized.includes('carta de corre') || normalized.includes('cc-e') || normalized.includes('cce')) {
      return {
        reply: `Procedimentos oficiais para correção ou cancelamento de notas fiscais:
1. Cancelamento da NF-e:
• Prazo geral do CONFAZ: Até 24 horas após a autorização da nota, desde que a mercadoria ainda não tenha saído do estabelecimento.
• Para NFS-e: O cancelamento segue as regras da Prefeitura ou do Portal Nacional da NFS-e.
2. Carta de Correção Eletrônica (CC-e):
Use quando passar o prazo de cancelamento para pequenos erros que não afetem tributos.
• O que pode corrigir: CFOP, código do produto, dados da transportadora, endereço de entrega e observações.
• O que é PROIBIDO corrigir por CC-e: Valores de produtos, base de cálculo de impostos, alíquotas, data de emissão/saída e dados completos do cliente ou emitente.
Se houve erro de valor e passou o prazo de 24 horas, emita uma nota fiscal de estorno ou anulação com suporte do seu contador.`,
        sources: [
          { name: 'CONFAZ — Ajuste SINIEF 07/2005', url: 'https://www.confaz.fazenda.gov.br/', snippet: 'Regras de Cancelamento e CC-e' },
          { name: 'Manuais da NF-e (SVRS)', url: 'https://dfe-portal.svrs.rs.gov.br/Nfe/Documentos', snippet: 'Manual do Contribuinte' }
        ]
      };
    }

    if (normalized.includes('danfe') || normalized.includes('xml')) {
      return {
        reply: `Entenda a diferença essencial entre DANFE e arquivo XML:
• O arquivo XML é a nota fiscal de fato. Possui validade jurídica oficial com assinatura digital certificada e autorização da SEFAZ. Deve ser guardado obrigatoriamente por pelo menos 5 anos.
• O DANFE é apenas a representação gráfica impressa ou em PDF do XML. Sua finalidade é acompanhar o transporte da carga e facilitar a leitura da Chave de Acesso de 44 dígitos. O DANFE não substitui o XML.`,
        sources: [
          { name: 'Portal Nacional da NF-e', url: 'https://www.nfe.fazenda.gov.br/portal/principal.aspx', snippet: 'DANFE e Arquivos Digitais' },
          { name: 'Código Tributário Nacional', url: 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm', snippet: 'Guarda Obrigatória de Documentos Fiscais' }
        ]
      };
    }

    if (normalized.includes('cfop') || normalized.includes('cst') || normalized.includes('csosn') || normalized.includes('ncm')) {
      return {
        reply: `Significado dos quatro códigos fundamentais presentes nas notas fiscais:
• CFOP (4 dígitos): Define a natureza e o destino da operação. Se começa com 1 ou 5 é interna dentro do estado; se começa com 2 ou 6 é interestadual; se começa com 3 ou 7 é para o exterior. Ex: 5.102 (venda no estado).
• CSOSN (3 ou 4 dígitos): Código exclusivo do Simples Nacional indicando a situação do imposto (101 com crédito, 102 sem crédito, 500 com ICMS-ST recolhido).
• CST (3 dígitos): Utilizado por empresas do Lucro Presumido e Real para indicar a tributação do ICMS.
• NCM (8 dígitos): Classificação Mercosul do produto que define a tributação de ICMS, IPI e alíquotas aplicáveis.`,
        sources: [
          { name: 'CONFAZ — Tabela CFOP e CSOSN', url: 'https://www.confaz.fazenda.gov.br/', snippet: 'Tabela de Códigos Fiscais' },
          { name: 'Receita Federal — Nomenclatura Comum do Mercosul', url: 'https://www.gov.br/receitafederal/pt-br', snippet: 'Tabela NCM' }
        ]
      };
    }

    // Pergunta sobre NF-e em geral
    return {
      reply: `A NF-e (Nota Fiscal Eletrônica - Modelo 55) é o documento fiscal digital obrigatório para registrar a venda e a circulação de mercadorias no Brasil:
• Quando emitir: Em vendas para outras empresas (B2B), operações interestaduais ou devoluções de mercadorias.
• Validade jurídica: É conferida pela assinatura digital com certificado digital ICP-Brasil e pela autorização da Secretaria da Fazenda Estadual (SEFAZ).
• Obrigatoriedade para MEI e ME: A microempresa é sempre obrigada a emitir nota fiscal. O MEI é obrigado a emitir quando vende para pessoas jurídicas (empresas ou órgãos públicos).
• Guarda de arquivos: O arquivo XML da NF-e deve ser guardado digitalmente pelo prazo mínimo de 5 anos para comprovação fiscal perante a lei.`,
      sources: [
        { name: 'Portal Nacional da NF-e', url: 'https://www.nfe.fazenda.gov.br/portal/principal.aspx', snippet: 'Emissão e Validade da NF-e' },
        { name: 'Manuais da NF-e (SVRS)', url: 'https://dfe-portal.svrs.rs.gov.br/Nfe/Documentos', snippet: 'Manual do Contribuinte da NF-e' }
      ]
    };
  }

  // 12. Strict Fallback: Query is fiscal, but no documented source matches it
  return {
    reply: MANDATORY_INSUFFICIENT_INFO_MESSAGE,
    sources: [],
    isInsufficient: true
  };
}
