-- CreateTable
CREATE TABLE "Reaction" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);
