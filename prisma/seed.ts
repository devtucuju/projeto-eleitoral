// Seed do scampanha com 175 apoiadores reais do Amapá
// Dados extraídos da planilha "Relação de apoiadores eleições 2026.xlsx"

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Mapeamento dos 175 apoiadores reais
// Cada entrada: [nome, referencia, municipio, bairro, situacao, isLideranca]
type Apoiador = [string, string, string, string | null, string, boolean];

const apoiadores: Apoiador[] = [
  ["Winnie Ataliba", "Rurap", "Macapá", "Parque dos Buritis", "fechado", true],
  ["Max Ataliba", "Rurap", "Macapá", "Parque dos Buritis", "fechado", true],
  ["Alípio Junior", "Sempre Perto", "Macapá", "Zerão", "fechado", true],
  ["Cleia Comunicação", "Prefeitura Mcp", "Macapá", "Renascer", "fechado", true],
  ["Disraeli", "Policial Militar", "Macapá", "Renascer", "fechado", true],
  ["Diana", "Amiga", "Macapá", "Renascer", "fechado", true],
  ["Larissa Amiga", "Faculdade Estácio", "Macapá", "Cond. Bela Vista", "fechado", true],
  ["Valdenir Ligeirinho", "Rurap", "Macapá", null, "fechado", true],
  ["Ruan Felipe", "Escola Katerine", "Macapá", "Infraero II", "fechado", true],
  ["Leticia Borralho", "Mídia", "Macapá", "Santa Rita", "fechado", true],
  ["Adamor (Água Branca)", "Rurap", "Laranjal do Jari", null, "aberto", false],
  ["Adão Ipesap", "SDR", "Macapá", "Zerão", "fechado", false],
  ["Adriano Cipemac", "Cipemac", "Macapá", null, "fechado", false],
  ["Adriano Roçador", "P. Meio Mundo", "Macapá", "Brasil Novo", "fechado", true],
  ["Adriano Telemar", "Amigo(a)", "Macapá", "Curiaú", "aberto", false],
  ["Agvânio Vizinho", "Amigo(a)", "Macapá", "Parque dos Buritis", "fechado", true],
  ["Alacid Advogado", "Rurap", "Macapá", null, "aberto", false],
  ["Alberto Pastor", "Pastor", "Vitória do Jari", null, "aberto", false],
  ["Alex Compadre", "Rurap", "Macapá", "Brasil Novo", "fechado", true],
  ["Alex Irmão Cleia", "Amigo(a)", "Macapá", "Renascer", "fechado", false],
  ["Alírio", "Sempre Perto", "Macapá", null, "fechado", false],
  ["Amanda Diogenes", "IEPA", "Macapá", null, "fechado", false],
  ["Amanda Ex Agvânio", "Amigo(a)", "França", "França", "fechado", true],
  ["Amilton Santa Rita", "P. Meio Mundo", "Macapá", "Macapaba", "fechado", true],
  ["Ana Paula Esposa Alípio", "Sempre Perto", "Macapá", "Zerão", "fechado", true],
  ["Anderson Ex Rurap", "Amigo(a)", "Calçoene", null, "aberto", false],
  ["Anny Drifty", "P. Meio Mundo", "Macapá", null, "aberto", false],
  ["Antônio Almeida", "Rurap", "Macapá", "Parque Aeroportuário", "fechado", true],
  ["Antônio Nunes", "Rurap", "Macapá", "Renascer", "fechado", true],
  ["Armando", "SEMAM", "Macapá", null, "aberto", false],
  ["Augusto Bicicletário", "P. Meio Mundo", "Macapá", null, "aberto", false],
  ["Baia Pai da Ticy", "Amigo(a)", "Macapá", "Centro", "fechado", false],
  ["Bananeira (vizinho de rua)", "Amigo(a)", "Macapá", "Parque dos Buritis", "fechado", false],
  ["Cabeça Motorista", "Politec", "Macapá", "Jardim I", "fechado", true],
  ["Caio Fregni", "Rurap", "Macapá", "Brasil Novo", "fechado", true],
  ["Carlos Kaczan", "Soja", "Macapá", "AP-070", "fechado", true],
  ["Cesária Limpeza", "P. Meio Mundo", "Macapá", "Zerão", "fechado", true],
  ["Chocolate", "Pedreiro", "Macapá", "Congós", "fechado", true],
  ["Claudia", "Unha", "Macapá", null, "aberto", false],
  ["Claudia Chelala", "UNIFAP", "Macapá", "Buritizal", "fechado", false],
  ["Claudio Amigo Elielson", "Amigo(a)", "Oiapoque", null, "fechado", true],
  ["Claudio Barauna", "Amigo(a)", "Amapá", null, "fechado", true],
  ["Cleyton Pai da Maytê", "Escola Katerine", "Macapá", "Infraero I", "fechado", false],
  ["Cris", "Casa", "Macapá", "Brasil Novo", "fechado", true],
  ["Cris Filha da Cleia", "Amigo(a)", "Macapá", "Renascer", "fechado", false],
  ["Daniel Tarrão do Matapi", "Jeovani", "Macapá", "Torrão do Matapi", "fechado", false],
  ["Diana Pinheiro", "SEMHOU", "Macapá", "Perpétuo Socorro", "fechado", true],
  ["Diego Irmão Nádia", "Amigo(a)", "Macapá", "Açaí", "fechado", false],
  ["Diretor Lima (Jô)", "Escola Cultivar", "Macapá", "Zerão", "fechado", true],
  ["Douglas Vila Vitória", "Amigo(a)", "Oiapoque", null, "fechado", true],
  ["Edson Campina Grande", "Prefeitura Mcp", "Macapá", "Campina Grande", "fechado", true],
  ["Eduardo Haisen", "Rurap", "Macapá", "Cond. Bela Vista", "fechado", false],
  ["Eide", "Rurap", "Macapá", null, "aberto", false],
  ["Elielma", "Rurap", "Macapá", "Cond. Bela Vista", "fechado", false],
  ["Elielson", "Rurap", "Oiapoque", null, "fechado", true],
  ["Ellen", "Dentista", "Macapá", null, "fechado", false],
  ["Eloeny", "Escola Katerine", "Macapá", "Infraero II", "fechado", false],
  ["Ely Cabelereiro", "Academia", "Macapá", null, "aberto", false],
  ["Enzo Dra Rayssa", "Prefeitura Mcp", "Macapá", null, "fechado", false],
  ["Erique Pacui", "Rurap", "Macapá", "Pacuí", "fechado", true],
  ["Eucimar", "Rurap", "Santana", null, "aberto", false],
  ["Fabinho Jogador", "Rurap", "Pedra Branca", null, "aberto", false],
  ["Fabiola Esposa Viana", "Rurap", "Macapá", null, "fechado", false],
  ["Fala Fina Roçador", "P. Meio Mundo", "Macapá", "Congós", "fechado", true],
  ["Fernanda", "Faculdade Estácio", "Macapá", null, "aberto", false],
  ["Flamarion", "Rurap", "Macapá", null, "fechado", true],
  ["Francisco", "Cabelereiro", "Macapá", "Açaí", "fechado", true],
  ["Gabriela", "Escola Katerine", "Macapá", "Açaí", "fechado", false],
  ["Gemaque (Pescap)", "Rurap", "Macapá", null, "fechado", false],
  ["Georgenes Regional", "Rurap", "Cutiás", null, "fechado", true],
  ["Haroldinho", "Rurap", "Macapá", null, "fechado", true],
  ["Hérica Rossi", "Soja", "Macapá", null, "aberto", false],
  ["Ilda", "SEMAM", "Macapá", null, "fechado", true],
  ["Iradislon", "Amigo(a)", "Macapá", "Santa Rita", "fechado", false],
  ["Irmão Valmir", "Rurap", "Laranjal do Jari", "Água Branca", "fechado", true],
  ["Ivanilson Roçador", "P. Meio Mundo", "Macapá", "Brasil Novo", "fechado", true],
  ["Izael Roçador", "P. Meio Mundo", "Macapá", "Pedrinhas", "fechado", true],
  ["Jack Soares", "Boticário", "Macapá", null, "aberto", false],
  ["Jackson Roçador", "P. Meio Mundo", "Macapá", "Conjunto Amazonas", "fechado", false],
  ["Jade", "SEMAM", "Macapá", "Infraero II", "fechado", true],
  ["Jailson Amigo Tião", "Amigo(a)", "Calçoene", null, "fechado", true],
  ["Jeovani Chucre", "PSB", "Macapá", "Brasil Novo", "fechado", true],
  ["Jessica Ataide Prof Katerine", "Escola Katerine", "Macapá", null, "aberto", false],
  ["Jô Cunhado", "Embrapa", "Macapá", "Zerão", "fechado", true],
  ["João Carlos", "Rurap", "Ferreira Gomes", null, "fechado", true],
  ["Joel (Pacui)", "Rurap", "Macapá", "Pacuí", "aberto", true],
  ["Joel Bar do Flamengo", "Praça Jaci Barata", "Macapá", null, "aberto", false],
  ["Jonas Cabelereiro", "Academia", "Macapá", null, "fechado", true],
  ["Josi Aupet", "Amigo(a)", "Macapá", "Infraero II", "fechado", true],
  ["Kelsen", "Prefeitura Mcp", "Macapá", "Buritizal", "fechado", true],
  ["Larissa Vieira", "Faculdade Estácio", "Macapá", null, "aberto", false],
  ["Larrisa (Filha Almeida)", "Amigo(a)", "Macapá", "Renascer", "fechado", false],
  ["Ledivaldo Rurap", "Amigo(a)", "Macapá", "Curiaú", "aberto", false],
  ["Lucas Coordenador", "SEMAM", "Macapá", null, "aberto", true],
  ["Luiz Barauna", "Amigo(a)", "Amapá", "Centro", "fechado", true],
  ["Luiz Ruela", "Soja", "Macapá", "AP-070", "fechado", true],
  ["Luizinho", "Rurap", "Cutiás", null, "fechado", true],
  ["Manoel Penafort (Maneca)", "SEMAM", "Macapá", "Centro", "aberto", false],
  ["Manoelzinho", "Rurap", "Vitória do Jari", null, "fechado", true],
  ["Manuela", "Secretaria Pesca", "Macapá", null, "fechado", false],
  ["Marcelo Taborda", "SEMHOU", "Macapá", null, "aberto", false],
  ["Márcio Amorim", "Rurap", "Cutiás", null, "fechado", true],
  ["Marcio Black (Quadrilha)", "Amigo(a)", "Macapá", null, "aberto", false],
  ["Marcio Pinto", "Rurap", "Macapá", null, "fechado", true],
  ["Marco Eletricista", "Amigo(a)", "Amapá", null, "aberto", false],
  ["Mareco", "Rurap", "Macapá", null, "fechado", false],
  ["Maria (Limpeza)", "Rurap", "Macapá", "Pacoval", "fechado", false],
  ["Mariana Avellar", "SDR", "Macapá", null, "fechado", false],
  ["Mariane (Ex-Secretária)", "Amigo(a)", "Macapá", "Jardim I", "fechado", true],
  ["Marilene", "Rurap", "Macapá", null, "fechado", false],
  ["Marlucia Bubu", "Amigo(a)", "Macapá", "Jardim I", "fechado", true],
  ["Mary Esposa Roque", "Rurap", "Macapá", null, "fechado", true],
  ["Mauri Agente Distrital", "Prefeitura Mcp", "Macapá", "Maruanum", "aberto", false],
  ["Maurício", "Rurap", "Calçoene", null, "aberto", false],
  ["Maurício Vizinho", "Amigo(a)", "Macapá", "Parque dos Buritis", "aberto", false],
  ["Maxuel TI", "Rurap", "Macapá", null, "aberto", false],
  ["Maycon Esposo Gabi", "Escola Katerine", "Macapá", "Açaí", "fechado", false],
  ["Miguel Veterinário", "SDR", "Macapá", "Centro", "fechado", true],
  ["Nádia", "Casa", "Macapá", "Açaí", "fechado", true],
  ["Nagib Melen", "Embrapa", "Macapá", null, "aberto", false],
  ["Neca", "Rurap", "Macapá", null, "aberto", false],
  ["Neida", "Unha", "Macapá", "Açaí", "fechado", true],
  ["Nildo Piloto Bailique", "Amigo(a)", "Macapá", "Brasil Novo", "fechado", true],
  ["Norly", "SEMAM", "Macapá", null, "fechado", true],
  ["Núbia", "Rurap", "Macapá", null, "fechado", false],
  ["Omar", "Rurap", "Macapá", null, "aberto", false],
  ["Osiris Cassiporé", "Agricultor", "Oiapoque", "Vila Velha", "fechado", true],
  ["Osvaldo", "Rurap", "Vitória do Jari", null, "fechado", true],
  ["Pacheco Jardim", "Amigo(a)", "Macapá", "Jardim I", "aberto", false],
  ["Paraiba/Wescley", "Rurap", "Macapá", null, "aberto", false],
  ["Patrícia Quaresma", "MDR/Unifap", "Macapá", "Santana", "fechado", false],
  ["Paulinho Soja", "Rurap", "Macapá", "Pacuí", "aberto", false],
  ["Paulo Porteiro", "Escola Katerine", "Macapá", null, "aberto", false],
  ["Rafael (Cutias e Tzinho)", "Soja", "Itaubal", "Pacuí", "fechado", false],
  ["Rafael Dabahia", "Rurap", "Macapá", null, "fechado", true],
  ["Rafael Peçanha", "Rurap", "Macapá", null, "fechado", true],
  ["Rafaela Haizen", "Rurap", "Macapá", "Cond. Bela Vista", "fechado", false],
  ["Raimundinho Viana", "Rurap", "Macapá", null, "fechado", true],
  ["Rainha", "Cantora", "Macapá", null, "fechado", false],
  ["Ramon Roçador", "P. Meio Mundo", "Macapá", "Zerão", "aberto", false],
  ["Raul", "IBGE", "Macapá", null, "aberto", false],
  ["Renato Brufat", "Rurap", "Macapá", "Cond. Bela Vista", "fechado", false],
  ["Roberto Arroyo", "Soja", "Macapá", "AP-070", "fechado", true],
  ["Rodervan", "Rurap", "Oiapoque", null, "fechado", true],
  ["Rolinha", "Restaurante", "Macapá", null, "fechado", true],
  ["Romildo Protafinho", "Rurap", "Macapá", "Renascer", "fechado", true],
  ["Roque", "Rurap", "Macapá", null, "aberto", false],
  ["Rose Secretária Jô", "Amigo(a)", "Macapá", "Pedrinhas", "fechado", true],
  ["Sabá Cassiporé", "Agricultor", "Oiapoque", "Vila Velha", "fechado", true],
  ["Sabá Grama", "Rurap", "Macapá", "Macapaba", "fechado", true],
  ["Salmo", "Rurap", "Oiapoque", null, "fechado", true],
  ["Sammy", "SEMAM", "Macapá", null, "fechado", false],
  ["Sandro", "Ex Incra", "Macapá", null, "fechado", false],
  ["Sandro Gato Net", "Amigo(a)", "Porto Grande", null, "fechado", false],
  ["Santa Rosa", "Rurap", "Oiapoque", null, "fechado", true],
  ["Sarah Fuleirinha", "Amigo(a)", "Macapá", null, "aberto", false],
  ["Sérvulo", "Prefeitura Mcp", "Macapá", null, "fechado", false],
  ["Sidiane Caio", "Professora", "Macapá", "Brasil Novo", "fechado", false],
  ["Silvanildo", "Rurap", "Laranjal do Jari", null, "fechado", true],
  ["Sting (Jô)", "Amigo(a)", "Pedra Branca", null, "aberto", false],
  ["Tainá", "Faculdade Estácio", "Macapá", null, "aberto", false],
  ["Tayana Esposa Sérvulo", "Prefeitura Mcp", "Macapá", null, "fechado", false],
  ["Telisson CREA", "SDR", "Macapá", null, "aberto", false],
  ["Thayná Esposa Cleyton", "Escola Katerine", "Macapá", "Infraero I", "fechado", false],
  ["Thiago Magnun", "Rurap", "Macapá", null, "aberto", false],
  ["Tiaguinho Filho Jeovani", "Brasil Novo", "Macapá", "Brasil Novo", "fechado", false],
  ["Tião Motorista", "Prefeitura Mcp", "Macapá", "Brasil Novo", "fechado", true],
  ["Ticyane Monteiro", "Amigo(a)", "Macapá", "Centro", "fechado", false],
  ["Vanderlei Amanajás", "Rurap", "Macapá", "Pacoval", "aberto", false],
  ["Vilmar", "Rurap", "Calçoene", null, "fechado", true],
  ["Wesley Cacau Cassiporé", "Amigo(a)", "Oiapoque", null, "fechado", true],
  ["Willian", "SEMAM", "Macapá", null, "aberto", false],
  ["Woshingthon Carol", "Amigo(a)", "Macapá", "Alvorada", "fechado", false],
];

async function main() {
  console.log("🌱 Limpando dados existentes...");

  // Limpa na ordem correta (foreign keys)
  await prisma.conversa.deleteMany();
  await prisma.missao.deleteMany();
  await prisma.membro.deleteMany();
  await prisma.celula.deleteMany();
  await prisma.candidato.deleteMany();
  await prisma.partido.deleteMany();
  await prisma.user.deleteMany();

  console.log("🏛️ Criando partido...");
  const partido = await prisma.partido.create({
    data: {
      nome: "Partido de Apoio",
      sigla: "PDA",
      numero: 99999,
      cor: "#1F6B4A",
      ativo: true,
    },
  });

  console.log("👤 Criando candidato placeholder...");
  const candidato = await prisma.candidato.create({
    data: {
      nome: "Candidato 2026",
      apelido: "Célula",
      numero: 99999,
      cargo: "Deputado Estadual",
      partidoId: partido.id,
      ativo: true,
    },
  });

  console.log("🏘️ Criando células por bairro...");

  // Extrai bairros únicos
  const bairrosMacapa = Array.from(
    new Set(
      apoiadores
        .filter((a) => a[2] === "Macapá" && a[3])
        .map((a) => a[3] as string)
    )
  );

  const celulaMap = new Map<string, string>();

  for (const bairro of bairrosMacapa) {
    const celula = await prisma.celula.create({
      data: {
        nome: bairro,
        cidade: "Macapá",
        candidatoId: candidato.id,
      },
    });
    celulaMap.set(bairro, celula.id);
  }

  // Células para outros municípios (deduplicado)
  const outrosMunicipios = Array.from(
    new Set(
      apoiadores
        .filter((a) => a[2] !== "Macapá")
        .map((a) => a[2])
    )
  ).filter((m) => !bairrosMacapa.includes(m));

  for (const municipio of outrosMunicipios) {
    const celula = await prisma.celula.create({
      data: {
        nome: municipio,
        cidade: municipio,
        candidatoId: candidato.id,
      },
    });
    celulaMap.set(municipio, celula.id);
  }

  console.log(`📍 ${celulaMap.size} células criadas`);

  console.log("👥 Criando 175 membros...");

  let count = 0;
  for (const [nome, referencia, municipio, bairro, situacao, isLideranca] of apoiadores) {
    // Define a célula
    let celulaId: string;
    if (bairro && celulaMap.has(bairro)) {
      celulaId = celulaMap.get(bairro)!;
    } else if (celulaMap.has(municipio)) {
      celulaId = celulaMap.get(municipio)!;
    } else {
      // Fallback
      celulaId = celulaMap.values().next().value!;
    }

    // Extrai possível apelido do nome (entre parênteses)
    const apelidoMatch = nome.match(/\(([^)]+)\)/);
    const apelido = apelidoMatch ? apelidoMatch[1] : null;
    const nomeLimpo = nome.replace(/\s*\([^)]+\)/, "").trim();

    // Tipo baseado na referência
    let tipo = "cabo";
    if (isLideranca) tipo = "lider";
    else if (referencia?.includes("Amigo")) tipo = "voluntario";

    // Telefone placeholder (não temos dados reais)
    const telefone = `969${String(count).padStart(8, "0")}`;

    // Pontos iniciais para lideranças
    const pontosIniciais = isLideranca ? Math.floor(Math.random() * 500) + 100 : 0;
    const streakInicial = isLideranca ? Math.floor(Math.random() * 15) : 0;

    await prisma.membro.create({
      data: {
        nome: nomeLimpo,
        telefone,
        apelido,
        tipo,
        status: situacao,
        isLideranca,
        referencia,
        bairro,
        municipio,
        celulaId,
        codigoConvite: telefone.slice(-8),
        aceitouTermos: true,
        pontos: pontosIniciais,
        streak: streakInicial,
        // Placeholder - usar bcrypt.hashSync('senha', 10) em produção
        password: "$2a$10$placeholder.hash.for.seed.data",
      },
    });
    count++;
  }

  console.log(`✅ ${count} membros criados`);

  console.log("� Criando missão do dia...");
  const celulaZerao = celulaMap.get("Zerão");
  if (celulaZerao) {
    await prisma.missao.create({
      data: {
        titulo: "Conversar com vizinhos da feira",
        descricao: "Feira do Zerão - bater papo, anotar telefone, pedir confirmação.",
        tipo: "feira",
        local: "Feira do Zerão",
        data: new Date(),
        metaConversas: 5,
        candidatoId: candidato.id,
        celulaId: celulaZerao,
      },
    });
  }

  console.log("👔 Criando usuário coordenador...");
  const senhaHash = await bcrypt.hash("campanha2026", 10);
  await prisma.user.create({
    data: {
      email: "coord@campanha.com",
      password: senhaHash,
      nome: "Coordenador",
      role: "coordenador",
    },
  });
  console.log("   Login: coord@campanha.com / campanha2026");

  console.log("🎉 Seed concluído!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
