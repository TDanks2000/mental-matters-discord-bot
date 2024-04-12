/*
  Warnings:

  - A unique constraint covering the columns `[join_messages]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChannelSettings" ADD COLUMN     "join_messages" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_join_messages_key" ON "ChannelSettings"("join_messages");
