import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Message, Prisma } from '@prisma/client'
import { exec } from 'child_process'
import { randomUUID } from 'crypto'
import { PrismaService } from '../../../config/prisma/prisma.service'
import {
  MessageReceiveDto,
  MessageReceiveType
} from './dto/message-receive.dto'
import { RequestDataDto } from './dto/request-data.dto'
import { RequestReceiveDto } from './dto/request-receive.dto'

@Injectable()
export class WhatsappService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: RequestDataDto) {
    if (dto.changeField !== 'messages' || dto.provider !== 'whatsapp') {
      return
    }

    const handleCompany = await this.handleCompany(dto.business.id)

    if (!handleCompany) {
      return
    }

    const handleClient = await this.handleClient(dto.contact.id)

    if (!handleClient) {
      return
    }

    const handleChat = await this.handleChat(
      dto.contact.id,
      handleClient.id,
      handleCompany.id,
      dto.business.id
    )

    const handleMessage = await this.handleMessage(
      dto.message,
      handleChat.id,
      handleChat.attendantId
    )

    await fetch(
      `${process.env.WHATSAPP_URL}/${process.env.META_WHATSAPP_ID}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: dto.contact.id,
          type: 'text',
          text: { body: 'oi' }
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.META_APP_TOKEN}`
        }
      }
    )

    /// EMITIR A MESSAGE DO handleMessage PARA O FRONT ///
  }

  private async handleFileDownload(id: string, type: string): Promise<string> {
    const urlAudio = process.env.WHATSAPP_URL + id

    const resAudio = await fetch(urlAudio, {
      method: 'GET',
      headers: { Authorization: `Bearer ${process.env.META_APP_TOKEN}` }
    }).then((el) => el.json())

    const pathDirImage = `/tmp/whatsapp/${type}/${resAudio.id}.${
      resAudio.mime_type.split('/')[1]
    }`

    const curlAudioCommand = `curl -X GET '${resAudio.url}' -H 'Authorization: Bearer ${process.env.META_APP_TOKEN}' > .${pathDirImage}`

    exec(curlAudioCommand)

    return pathDirImage
  }

  private async handleMessage(
    dto: MessageReceiveDto,
    chatId: string,
    chatAttendantId: string
  ) {
    let data: Prisma.MessageUncheckedCreateInput

    switch (dto.type) {
      case MessageReceiveType.TEXT:
        data = {
          body: dto.text.body,
          chatId,
          sendByAttendant: false,
          type: 'TEXT',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        }

        break

      case MessageReceiveType.AUDIO:
        const pathDirAudio = await this.handleFileDownload(
          dto.audio.id,
          'audio'
        )

        data = {
          body: pathDirAudio,
          chatId,
          sendByAttendant: false,
          type: 'AUDIO',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        }
        break

      case MessageReceiveType.DOCUMENT:
        const pathDirDocument = await this.handleFileDownload(
          dto.document.id,
          'document'
        )

        data = {
          body: pathDirDocument,
          chatId,
          sendByAttendant: false,
          type: 'DOCUMENT',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        }

        break

      case MessageReceiveType.IMAGE:
        const pathDirImage = await this.handleFileDownload(
          dto.image.id,
          'image'
        )

        data = {
          body: pathDirImage,
          chatId,
          sendByAttendant: false,
          type: 'IMAGE',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        }

        break

      case MessageReceiveType.VIDEO:
        const pathDirVideo = await this.handleFileDownload(
          dto.video.id,
          'video'
        )

        data = {
          body: pathDirVideo,
          chatId,
          sendByAttendant: false,
          type: 'AUDIO',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        }

        break

      case MessageReceiveType.STICKER:
        const pathDirSticker = await this.handleFileDownload(
          dto.sticker.id,
          'sticker'
        )

        data = {
          body: pathDirSticker,
          chatId,
          sendByAttendant: false,
          type: 'STICKER',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        }

        break

      case MessageReceiveType.CONTACTS:
        data = {
          body: JSON.stringify(dto.contacts[0]),
          chatId,
          sendByAttendant: false,
          type: 'CONTACT',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        }

        break

      case MessageReceiveType.LOCATION:
        data = {
          body: JSON.stringify(dto.location),
          chatId,
          sendByAttendant: false,
          type: 'LOCATION',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        }

        break

      case MessageReceiveType.REACTION:
        await this.prisma.reaction.create({
          data: {
            emoji: dto.reaction.emoji,
            Message: {
              connect: { integrationId: dto.reaction.message_id }
            }
          }
        })

        break

      case MessageReceiveType.UNSUPPORTED:
      case MessageReceiveType.INTERACTIVE:
      default:
        return
    }

    let message: Message

    if (dto.type !== MessageReceiveType.REACTION) {
      message = await this.prisma.message.create({
        data
      })
    }

    await fetch(
      `${process.env.WHATSAPP_URL}/${process.env.META_WHATSAPP_ID}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: dto.id
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.META_APP_TOKEN}`
        }
      }
    )

    return message
  }

  private async handleChat(
    contactId: string,
    clientId: string,
    companyId: string,
    businessId: string
  ) {
    const chat = await this.prisma.chat.findFirst({
      where: { contactId }
    })

    if (chat) {
      return chat
    }

    return await this.prisma.chat.create({
      data: {
        requestNumber: randomUUID().toString(),
        type: 'WHATSAPP',
        businessId,
        clientId,
        companyId
      }
    })
  }

  private async handleClient(whatsappId: string) {
    return await this.prisma.client.findFirst({
      where: { whatsappId }
    })
  }

  private async handleCompany(whatsappId: string) {
    return await this.prisma.company.findFirst({
      where: {
        Whatsapp: {
          some: { whatsappId }
        }
      }
    })
  }

  handleDto(dto: RequestReceiveDto) {
    return {
      entryId: dto?.entry[0]?.id, // verificar se e o ID do client
      changeField: dto?.entry[0]?.changes[0]?.field,
      provider: dto?.entry[0]?.changes[0]?.value?.messaging_product,
      business: {
        id: dto?.entry[0]?.changes[0]?.value?.metadata?.phone_number_id,
        phone: dto?.entry[0]?.changes[0]?.value?.metadata?.display_phone_number
      },
      contact: {
        id: dto?.entry[0]?.changes[0]?.value?.contacts[0]?.wa_id,
        name: dto?.entry[0]?.changes[0]?.value?.contacts[0]?.profile?.name
      },
      message: dto?.entry[0]?.changes[0]?.value?.messages[0]
    }
  }
}
