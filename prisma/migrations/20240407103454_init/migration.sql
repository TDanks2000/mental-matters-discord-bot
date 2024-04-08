-- CreateTable
CREATE TABLE "guild_config" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "rankup_messages" BOOLEAN DEFAULT false,
    "join_messages" BOOLEAN DEFAULT false,
    "bannedWords" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "guild_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_votes" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "up_members" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "down_members" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "poll_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balance" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "counting_game" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "last_person_id" TEXT NOT NULL,

    CONSTRAINT "counting_game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationChannelSettings" (
    "id" SERIAL NOT NULL,
    "deleted_message" BOOLEAN NOT NULL DEFAULT true,
    "edited_message" BOOLEAN NOT NULL DEFAULT true,
    "user_left" BOOLEAN NOT NULL DEFAULT true,
    "user_join" BOOLEAN NOT NULL DEFAULT true,
    "user_ban" BOOLEAN NOT NULL DEFAULT true,
    "user_timeout" BOOLEAN NOT NULL DEFAULT true,
    "user_kick" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ModerationChannelSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationChannel" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,

    CONSTRAINT "ModerationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guild_config_guild_id_key" ON "guild_config"("guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "counting_game_channel_id_key" ON "counting_game"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannelSettings_id_key" ON "ModerationChannelSettings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannel_id_key" ON "ModerationChannel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannel_guild_id_key" ON "ModerationChannel"("guild_id");

-- AddForeignKey
ALTER TABLE "ModerationChannel" ADD CONSTRAINT "ModerationChannel_id_fkey" FOREIGN KEY ("id") REFERENCES "ModerationChannelSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
