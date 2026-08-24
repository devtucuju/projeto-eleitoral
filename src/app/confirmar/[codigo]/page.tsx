import { prisma } from "@/lib/prisma";
import { ConfirmActions } from "./ConfirmActions";

export const dynamic = "force-dynamic";

async function getConversa(codigo: string) {
  return prisma.conversa.findUnique({
    where: { codigoConf: codigo },
    include: { membro: { include: { celula: true } } },
  });
}

export default async function ConfirmarPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const conversa = await getConversa(codigo);

  if (!conversa) {
    return (
      <main className="celula-mobile" style={{ padding: 24, minHeight: "100vh" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Link inválido</h1>
        <p style={{ color: "var(--celula-texto-secundario)", marginTop: 8 }}>
          Esse link de confirmação não existe ou já expirou.
        </p>
      </main>
    );
  }

  if (conversa.confirmada) {
    return (
      <main className="celula-mobile" style={{ padding: 24, minHeight: "100vh" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Já confirmado</h1>
        <p style={{ color: "var(--celula-texto-secundario)", marginTop: 8 }}>
          {conversa.membro.nome} já tinha registrado essa conversa. Obrigado!
        </p>
      </main>
    );
  }

  const nomeCabo = conversa.membro.apelido || conversa.membro.nome;
  const bairro = conversa.membro.celula.nome;

  return (
    <main className="celula-mobile" style={{ padding: 24, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ fontSize: 17, fontWeight: 500 }}>Olá!</div>

      <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 16, lineHeight: 1.3 }}>
        {nomeCabo} disse que conversou com você {bairro ? `em ${bairro}` : ""}.
      </h1>

      <p style={{ marginTop: 12, color: "var(--celula-texto-secundario)", fontSize: 15 }}>
        Você confirma essa conversa?
      </p>

      <div style={{ flex: 1 }} />

      <ConfirmActions codigo={codigo} />

      <p style={{ marginTop: 24, color: "var(--celula-texto-secundario)", fontSize: 13, textAlign: "center" }}>
        Seu nome não será compartilhado.
      </p>
    </main>
  );
}
