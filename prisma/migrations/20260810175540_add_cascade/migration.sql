-- DropForeignKey
ALTER TABLE "Mensagem" DROP CONSTRAINT "Mensagem_autorId_fkey";

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
