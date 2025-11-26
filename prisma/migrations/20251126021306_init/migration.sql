-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `changed` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_name_key`(`name`),
    INDEX `User_name_idx`(`name`),
    INDEX `User_created_idx`(`created`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `changed` DATETIME(3) NOT NULL,
    `label` VARCHAR(1024) NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `interval` INTEGER NOT NULL DEFAULT 1440,
    `nextTime` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `fetchStatus` INTEGER NOT NULL,
    `grade` INTEGER NOT NULL DEFAULT 2,
    `useTemplate` BOOLEAN NOT NULL DEFAULT false,
    `tcode` VARCHAR(32) NULL,
    `config` JSON NOT NULL,

    INDEX `Feed_url_idx`(`url`(100)),
    INDEX `Feed_created_idx`(`created`),
    INDEX `Feed_nextTime_idx`(`nextTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `changed` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `url` VARCHAR(1024) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `interval` INTEGER NOT NULL DEFAULT 1440000,
    `nextTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fetchStatus` INTEGER NOT NULL,
    `synced` BOOLEAN NOT NULL DEFAULT false,
    `processed` BOOLEAN NOT NULL DEFAULT false,
    `data` JSON NOT NULL,
    `feedId` INTEGER NULL,

    INDEX `Item_url_idx`(`url`(100)),
    INDEX `Item_created_idx`(`created`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Watchdog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `type` VARCHAR(191) NOT NULL,
    `severity` INTEGER NOT NULL,
    `message` LONGTEXT NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `hostname` VARCHAR(191) NOT NULL,
    `referer` VARCHAR(191) NOT NULL,

    INDEX `Watchdog_type_severity_idx`(`type`, `severity`),
    INDEX `Watchdog_created_idx`(`created`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,

    UNIQUE INDEX `Config_key_key`(`key`),
    INDEX `Config_key_idx`(`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proxy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255) NOT NULL,
    `server` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `created` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `changed` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Proxy_server_key`(`server`),
    INDEX `Proxy_created_idx`(`created`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Listpage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `changed` DATETIME(3) NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `interval` INTEGER NOT NULL DEFAULT 1440,
    `nextTime` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `fetchStatus` INTEGER NOT NULL,
    `feedId` INTEGER NULL,

    INDEX `Listpage_url_idx`(`url`(100)),
    INDEX `Listpage_created_idx`(`created`),
    INDEX `Listpage_nextTime_idx`(`nextTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(255) NOT NULL,
    `code` VARCHAR(32) NOT NULL,
    `config` JSON NOT NULL,
    `created` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `changed` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Template_code_key`(`code`),
    INDEX `Template_created_idx`(`created`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_tcode_fkey` FOREIGN KEY (`tcode`) REFERENCES `Template`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feed`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Listpage` ADD CONSTRAINT `Listpage_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feed`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
