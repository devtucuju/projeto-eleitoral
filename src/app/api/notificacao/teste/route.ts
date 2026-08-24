import { NextResponse } from "next/server";

// POST /api/notificacao/teste
// Envia uma notificação push de teste (precisa de subscription salva)
export async function POST() {
  // Em produção: buscar subscriptions do membro e usar web-push
  // Aqui só retornamos a estrutura esperada
  return NextResponse.json({
    ok: true,
    mensagem: "Endpoint de teste. Implementação real precisa de web-push + subscriptions salvas no DB.",
    esperado: {
      endpoint: "https://fcm.googleapis.com/...",
      keys: { p256dh: "...", auth: "..." },
    },
  });
}
