-- Add auth fields to Membro
ALTER TABLE "Membro" ADD COLUMN "email" TEXT;
ALTER TABLE "Membro" ADD COLUMN "password" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Membro" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'coordenador';

CREATE UNIQUE INDEX IF NOT EXISTS "Membro_email_key" ON "Membro"("email");
