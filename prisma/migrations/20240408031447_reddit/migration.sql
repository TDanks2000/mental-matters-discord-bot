-- CreateTable
CREATE TABLE "ChannelSettings" (
    "id" SERIAL NOT NULL,
    "guid_id" TEXT NOT NULL,
    "channel_id_reddit_posts" TEXT,
    "subreddits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subreddits_interval_hours" INTEGER NOT NULL DEFAULT 3,
    "channel_id_members" TEXT,
    "channel_id_online" TEXT,
    "channel_id_offline" TEXT,

    CONSTRAINT "ChannelSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditPosts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "guiid_id" TEXT NOT NULL,
    "reddit_id" TEXT NOT NULL,

    CONSTRAINT "RedditPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_id_key" ON "ChannelSettings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_guid_id_key" ON "ChannelSettings"("guid_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channel_id_reddit_posts_key" ON "ChannelSettings"("channel_id_reddit_posts");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channel_id_members_key" ON "ChannelSettings"("channel_id_members");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channel_id_online_key" ON "ChannelSettings"("channel_id_online");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channel_id_offline_key" ON "ChannelSettings"("channel_id_offline");

-- CreateIndex
CREATE UNIQUE INDEX "RedditPosts_id_key" ON "RedditPosts"("id");
