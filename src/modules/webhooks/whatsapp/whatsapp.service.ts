import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Message, Prisma } from '@prisma/client';
import { exec } from 'child_process';
import { generateRequestNumber } from '../../../common/utils/generator-random-number.util';
import { PrismaService } from '../../../config/prisma/prisma.service';
import {
  MessageReceiveDto,
  MessageReceiveType
} from './dto/message-receive.dto';
import { RequestDataDto } from './dto/request-data.dto';
import { RequestReceiveDto } from './dto/request-receive.dto';

@Injectable()
export class WhatsappService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: RequestDataDto) {
    if (dto.changeField !== 'messages' || dto.provider !== 'whatsapp') {
      return;
    }

    const handleCompany = await this.handleCompany(dto.business.id);

    if (!handleCompany) {
      return;
    }

    const handleClient = await this.handleClient(
      dto.contact.id,
      dto.contact.name,
      handleCompany.id
    );

    if (!handleClient) {
      return;
    }

    const handleChat = await this.handleChat(
      dto.contact.id,
      dto.contact.name,
      handleClient.id,
      handleCompany.id,
      dto.business.id
    );

    const handleMessage = await this.handleMessage(
      dto.message,
      handleChat.id,
      handleChat.attendantId
    );
    /// EMITIR A MESSAGE DO handleMessage PARA O FRONT ///

    if (handleChat.departmentId === null) {
      console.log(handleMessage);
      const messageSplit = [
        dto.message?.interactive?.list_reply?.id || undefined,
        handleMessage.body
      ];

      const handleChatBot = await this.handleChatBot(
        handleCompany.Conversation,
        handleCompany.Department,
        messageSplit,
        handleChat.id,
        dto.contact.id,
        handleCompany.Whatsapp[0].whatsappId
      );
    }

    return;

    // await fetch(
    //   `${process.env.WHATSAPP_URL}/${process.env.META_WHATSAPP_ID}/messages`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       messaging_product: 'whatsapp',
    //       to: dto.contact.id,
    //       type: 'text',
    //       text: { body: 'oi' }
    //     }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${process.env.META_APP_TOKEN}`
    //     }
    //   }
    // )
  }

  private async handleChatBot(
    conversations: any,
    departments: any,
    messageSplit: string[],
    chatId: string,
    contactId: string,
    businessId: string
  ) {
    const speakAttendant = conversations.find((el) => {
      if (el.id === messageSplit[0]) return true;
      if (messageSplit[1]) {
        if (el.header.toLowerCase() === messageSplit[1].toLowerCase()) {
          return true;
        }
      } else {
        if (el.header.toLowerCase() === messageSplit[0].toLowerCase()) {
          return true;
        }
      }
    });

    if (speakAttendant) {
      if (speakAttendant.header.toLowerCase() === 'falar com atendente') {
        if (departments.length === 1) {
          await this.prisma.chat.update({
            where: { id: chatId },
            data: { departmentId: departments[0].id }
          });

          // AVISAR O FRONT QUE O DEPARTAMENTO FOI ATUALIZADO
          // this.webSocketService.getServer().emit(departments[0].id, true)

          const textToSend =
            'Você esta na fila de atendimento em breve um de nossos atendentes ira lhe responder.';

          await this.send(
            businessId,
            contactId,
            departments,
            'text',
            textToSend
          );

          return 'finish';
        }
      }
    }

    await this.send(businessId, contactId, departments, null, null);

    return 'finish';
  }

  private async handleFileDownload(id: string, type: string): Promise<string> {
    const urlAudio = process.env.WHATSAPP_URL + id;

    const resAudio = await fetch(urlAudio, {
      method: 'GET',
      headers: { Authorization: `Bearer ${process.env.META_APP_TOKEN}` }
    }).then((el) => el.json());

    const pathDirImage = `/tmp/whatsapp/${type}/${resAudio.id}.${
      resAudio.mime_type.split('/')[1]
    }`;

    const curlAudioCommand = `curl -X GET '${resAudio.url}' -H 'Authorization: Bearer ${process.env.META_APP_TOKEN}' > .${pathDirImage}`;

    exec(curlAudioCommand);

    return pathDirImage;
  }

  private async handleMessage(
    dto: MessageReceiveDto,
    chatId: string,
    chatAttendantId?: string
  ) {
    let data: Prisma.MessageUncheckedCreateInput;

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
        };

        break;

      case MessageReceiveType.AUDIO:
        const pathDirAudio = await this.handleFileDownload(
          dto.audio.id,
          'audio'
        );

        data = {
          body: pathDirAudio,
          chatId,
          sendByAttendant: false,
          type: 'AUDIO',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        };
        break;

      case MessageReceiveType.DOCUMENT:
        const pathDirDocument = await this.handleFileDownload(
          dto.document.id,
          'document'
        );

        data = {
          body: pathDirDocument,
          chatId,
          sendByAttendant: false,
          type: 'DOCUMENT',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        };

        break;

      case MessageReceiveType.IMAGE:
        const pathDirImage = await this.handleFileDownload(
          dto.image.id,
          'image'
        );

        data = {
          body: pathDirImage,
          chatId,
          sendByAttendant: false,
          type: 'IMAGE',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        };

        break;

      case MessageReceiveType.VIDEO:
        const pathDirVideo = await this.handleFileDownload(
          dto.video.id,
          'video'
        );

        data = {
          body: pathDirVideo,
          chatId,
          sendByAttendant: false,
          type: 'AUDIO',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        };

        break;

      case MessageReceiveType.STICKER:
        const pathDirSticker = await this.handleFileDownload(
          dto.sticker.id,
          'sticker'
        );

        data = {
          body: pathDirSticker,
          chatId,
          sendByAttendant: false,
          type: 'STICKER',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        };

        break;

      case MessageReceiveType.CONTACTS:
        data = {
          body: JSON.stringify(dto.contacts[0]),
          chatId,
          sendByAttendant: false,
          type: 'CONTACT',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        };

        break;

      case MessageReceiveType.LOCATION:
        data = {
          body: JSON.stringify(dto.location),
          chatId,
          sendByAttendant: false,
          type: 'LOCATION',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        };

        break;

      case MessageReceiveType.REACTION:
        await this.prisma.reaction.create({
          data: {
            emoji: dto.reaction.emoji,
            Message: {
              connect: { integrationId: dto.reaction.message_id }
            }
          }
        });

        break;

      case MessageReceiveType.UNSUPPORTED:
      case MessageReceiveType.INTERACTIVE:
        data = {
          body: JSON.stringify(dto.interactive.list_reply.title),
          chatId,
          sendByAttendant: false,
          type: 'INTERACTIVE',
          status: 'READ',
          integrationId: dto.id,
          chatAttendantId
        };
        console.log(dto.interactive.list_reply.title);
        break;
      default:
        return;
    }

    let message: Message;

    if (dto.type !== MessageReceiveType.REACTION) {
      message = await this.prisma.message.create({
        data
      });
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
    );

    return message;
  }

  private async handleChat(
    contactId: string,
    contactName: string,
    clientId: string,
    companyId: string,
    businessId: string
  ) {
    const chat = await this.prisma.chat.findFirst({
      where: { type: 'WHATSAPP', closedAt: null, companyId, clientId }
    });

    if (chat) return chat;

    const requestNumber = generateRequestNumber();

    return await this.prisma.chat.create({
      data: {
        requestNumber,
        type: 'WHATSAPP',
        businessId,
        clientId,
        companyId,
        contactId,
        contactName
      }
    });
  }

  private async handleClient(
    whatsappId: string,
    whatsappName: string,
    companyId: string
  ) {
    const client = await this.prisma.client.findFirst({
      where: { whatsappId }
    });

    if (!client) {
      const code = generateRequestNumber();

      return await this.prisma.client.create({
        data: {
          whatsappId,
          whatsappName,
          companyId,
          code,
          firstName: whatsappName
        }
      });
    }

    return client;
  }

  private async handleCompany(whatsappId: string) {
    return await this.prisma.company.findFirst({
      where: {
        disabledAt: null,
        Whatsapp: {
          some: { whatsappId }
        }
      },
      include: {
        Conversation: true,
        Department: true,
        Whatsapp: true
      }
    });
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
    };
  }

  private async send(
    businessId: string,
    toId: string,
    departments: any[],
    type?: string,
    body?: string
  ) {
    if (type === 'text') {
      await fetch(`${process.env.WHATSAPP_URL}/${businessId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: toId,
          type: 'text',
          text: { body }
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.META_APP_TOKEN}`
        }
      });
      return;
    }

    await fetch(`${process.env.WHATSAPP_URL}/${businessId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toId,
        type: 'interactive',
        interactive: {
          type: 'list',
          header: {
            type: 'text',
            text: 'Escolha o departamento onde deseja atendimento'
          },
          body: {
            text: 'Abaixo algumas opções a seu dispor neste atendimento'
          },
          footer: undefined,
          action: {
            button: 'Departamentos',
            sections: [
              {
                title: 'Departamentos',
                rows: departments.map((el) => ({
                  id: el.id,
                  title: el.name
                }))
              }
            ]
          }
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.META_APP_TOKEN}`
      }
    }).then(async (el) => console.log(await el.json()));

    return;
  }
}
