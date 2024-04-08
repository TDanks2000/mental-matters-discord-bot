-- CreateTable
CREATE TABLE "AutoJoinRoles" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "AutoJoinRoles_pkey" PRIMARY KEY ("id")
);
