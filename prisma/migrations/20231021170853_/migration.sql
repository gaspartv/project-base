-- CreateEnum
CREATE TYPE "languages" AS ENUM ('EN_US', 'PT_BR');

-- CreateEnum
CREATE TYPE "user_polices" AS ENUM ('NORMAL', 'ADMIN', 'SUPER');

-- CreateEnum
CREATE TYPE "company_police" AS ENUM ('BUSINESS', 'SUPER');

-- CreateEnum
CREATE TYPE "message_status" AS ENUM ('PROCESS', 'SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "message_type" AS ENUM ('AUDIO', 'CONTACT', 'DOCUMENT', 'IMAGE', 'LOCATION', 'STICKER', 'TEXT', 'VIDEO');

-- CreateEnum
CREATE TYPE "chat_type" AS ENUM ('WHATSAPP', 'INSTAGRAM', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "department_polices" AS ENUM ('ATTENDANT', 'MANAGER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "description" TEXT,
    "imageUri" TEXT,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "language" "languages" NOT NULL DEFAULT 'PT_BR',
    "police" "user_polices" NOT NULL DEFAULT 'NORMAL',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disconnectedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "tokens" TEXT[],
    "userId" UUID NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pass_tokens" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "userId" UUID NOT NULL,

    CONSTRAINT "pass_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "corporateName" TEXT NOT NULL,
    "tradingName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "phone" TEXT,
    "botName" TEXT DEFAULT 'MIT_BOT',
    "closedChatIn" INTEGER DEFAULT 30,
    "Police" "company_police" NOT NULL DEFAULT 'BUSINESS',
    "metaAppId" UUID,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workings" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "Police" "department_polices" NOT NULL DEFAULT 'ATTENDANT',
    "userId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,

    CONSTRAINT "workings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disabled_at" TIMESTAMP(3),
    "index" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "company_id" UUID NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_app" (
    "id" UUID NOT NULL,
    "metaAppToken" TEXT NOT NULL,
    "metaAppId" TEXT NOT NULL,

    CONSTRAINT "meta_app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_whatsapp" (
    "id" UUID NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "whatsappId" TEXT NOT NULL,
    "metaAppId" UUID NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "meta_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_instagram" (
    "id" UUID NOT NULL,
    "instagramToken" TEXT NOT NULL,
    "instagramId" TEXT NOT NULL,
    "metaAppId" UUID NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "meta_instagram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "message_status" NOT NULL DEFAULT 'PROCESS',
    "type" "message_type" NOT NULL DEFAULT 'TEXT',
    "integrationId" TEXT,
    "body" TEXT NOT NULL,
    "sendByAttendant" BOOLEAN NOT NULL,
    "chatId" UUID NOT NULL,
    "chatAttendantId" UUID,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "type" "chat_type" NOT NULL,
    "contactId" TEXT,
    "contactName" TEXT,
    "businessId" TEXT NOT NULL,
    "attendantId" UUID,
    "departmentId" UUID,
    "companyId" UUID NOT NULL,
    "clientId" UUID NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_attendant" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "attendantId" UUID,
    "departmentId" UUID NOT NULL,
    "chatId" UUID NOT NULL,

    CONSTRAINT "chat_attendant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "code" TEXT,
    "cpf" TEXT,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "whatsappId" TEXT,
    "whatsappName" TEXT,
    "instagramId" TEXT,
    "instagramName" TEXT,
    "facebookId" TEXT,
    "facebookName" TEXT,
    "companyId" UUID NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "title" TEXT DEFAULT 'Clique aqui',
    "header" TEXT,
    "body" TEXT,
    "buttons" TEXT,
    "footer" TEXT,
    "isMain" BOOLEAN NOT NULL,
    "companyId" UUID NOT NULL,
    "parentId" UUID,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestion_conversations" (
    "id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "suggestion_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_facebook" (
    "id" UUID NOT NULL,
    "facebookToken" TEXT NOT NULL,
    "facebookId" TEXT NOT NULL,
    "metaAppId" UUID NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "meta_facebook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Company_corporateName_key" ON "Company"("corporateName");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Company_metaAppId_key" ON "Company"("metaAppId");

-- CreateIndex
CREATE UNIQUE INDEX "workings_userId_departmentId_key" ON "workings"("userId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_company_id_name_key" ON "departments"("company_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "meta_app_metaAppToken_key" ON "meta_app"("metaAppToken");

-- CreateIndex
CREATE UNIQUE INDEX "meta_app_metaAppId_key" ON "meta_app"("metaAppId");

-- CreateIndex
CREATE UNIQUE INDEX "meta_whatsapp_whatsappNumber_key" ON "meta_whatsapp"("whatsappNumber");

-- CreateIndex
CREATE UNIQUE INDEX "meta_whatsapp_whatsappId_key" ON "meta_whatsapp"("whatsappId");

-- CreateIndex
CREATE UNIQUE INDEX "meta_instagram_instagramToken_key" ON "meta_instagram"("instagramToken");

-- CreateIndex
CREATE UNIQUE INDEX "meta_instagram_instagramId_key" ON "meta_instagram"("instagramId");

-- CreateIndex
CREATE UNIQUE INDEX "messages_integrationId_key" ON "messages"("integrationId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_code_key" ON "clients"("code");

-- CreateIndex
CREATE UNIQUE INDEX "clients_id_cpf_email_whatsappId_instagramId_facebookId_comp_key" ON "clients"("id", "cpf", "email", "whatsappId", "instagramId", "facebookId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "meta_facebook_facebookToken_key" ON "meta_facebook"("facebookToken");

-- CreateIndex
CREATE UNIQUE INDEX "meta_facebook_facebookId_key" ON "meta_facebook"("facebookId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pass_tokens" ADD CONSTRAINT "pass_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_metaAppId_fkey" FOREIGN KEY ("metaAppId") REFERENCES "meta_app"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workings" ADD CONSTRAINT "workings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workings" ADD CONSTRAINT "workings_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_whatsapp" ADD CONSTRAINT "meta_whatsapp_metaAppId_fkey" FOREIGN KEY ("metaAppId") REFERENCES "meta_app"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_whatsapp" ADD CONSTRAINT "meta_whatsapp_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_instagram" ADD CONSTRAINT "meta_instagram_metaAppId_fkey" FOREIGN KEY ("metaAppId") REFERENCES "meta_app"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_instagram" ADD CONSTRAINT "meta_instagram_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatAttendantId_fkey" FOREIGN KEY ("chatAttendantId") REFERENCES "chat_attendant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_attendant" ADD CONSTRAINT "chat_attendant_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_attendant" ADD CONSTRAINT "chat_attendant_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_attendant" ADD CONSTRAINT "chat_attendant_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestion_conversations" ADD CONSTRAINT "suggestion_conversations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_facebook" ADD CONSTRAINT "meta_facebook_metaAppId_fkey" FOREIGN KEY ("metaAppId") REFERENCES "meta_app"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meta_facebook" ADD CONSTRAINT "meta_facebook_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
