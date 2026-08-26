-- CreateTable
CREATE TABLE "Pessoa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "cpf" TEXT,
    "numeroTitulo" TEXT,
    "zona" TEXT,
    "secao" TEXT,
    "cidade" TEXT,
    "endereco" TEXT,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Conversa" ADD COLUMN "pessoaId" TEXT,
ADD COLUMN "nomePessoa" TEXT,
ADD COLUMN "telefonePessoa" TEXT,
DROP COLUMN "eleitorId",
DROP COLUMN "nomeEleitor",
DROP COLUMN "telefoneEleitor";

-- AddForeignKey
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Conversa_pessoaId_idx" ON "Conversa"("pessoaId");

-- CreateIndex
CREATE INDEX "Pessoa_telefone_idx" ON "Pessoa"("telefone");
