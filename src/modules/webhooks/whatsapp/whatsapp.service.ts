import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Prisma } from '@prisma/client'
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
  }

  private async handleMessage(
    dto: MessageReceiveDto,
    chatId: string,
    chatAttendantId: string
  ) {
    console.log(dto)

    let data: Prisma.MessageUncheckedCreateInput

    switch (dto.type) {
      case MessageReceiveType.TEXT:
        data = {
          body: dto.text.body,
          chatId,
          sendByAttendant: false,
          type: 'TEXT',
          status: 'PROCESS',
          integrationId: dto.id,
          chatAttendantId
        }
        break
      case MessageReceiveType.AUDIO:
        break
      case MessageReceiveType.CONTACTS:
        break
      case MessageReceiveType.DOCUMENT:
        break
      case MessageReceiveType.IMAGE:
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${dto.image.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.META_APP_TOKEN}`,
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/68.0.3440.106 Safari/537.36'
            }
          }
        ).then((el) => el.json())

        const image = await fetch(
          `https://graph.facebook.com/v18.0/${response.url}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.META_APP_TOKEN}`,
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/68.0.3440.106 Safari/537.36'
            }
          }
        ).then((el) => el.json())

        console.log(image)

        // try {
        //   const res = await axios.get(response.url, { responseType: 'stream' })

        //   // Verifique se a solicitação foi bem-sucedida (código de status 200).
        //   if (res.status === 200) {
        //     // Defina o diretório e o nome do arquivo onde você deseja salvar a imagem.
        //     const saveDir = 'tmp'

        //     const imageFilename = 'nome_da_imagem.jpeg'

        //     // Combine o diretório com o nome do arquivo.
        //     const imageFullPath = join(saveDir, imageFilename)

        //     // Crie um fluxo de escrita para salvar a imagem.
        //     const writer = fs.createWriteStream(imageFullPath)

        //     // Pipelina os dados da resposta para o fluxo de escrita.
        //     res.data.pipe(writer)

        //     // Aguarde o término da gravação e manipule quaisquer erros.
        //     await new Promise((resolve, reject) => {
        //       writer.on('finish', resolve)
        //       writer.on('error', reject)
        //     })

        //     // Neste ponto, a imagem foi salva no diretório especificado.
        //   } else {
        //     console.error(
        //       'Falha ao obter a imagem. Código de status:',
        //       response.status
        //     )
        //   }
        // } catch (error) {
        //   console.error('Erro ao baixar e salvar a imagem:', error)
        // }

        break
      case MessageReceiveType.INTERACTIVE:
        break
      case MessageReceiveType.LOCATION:
        break
      case MessageReceiveType.REACTION:
        break
      case MessageReceiveType.STICKER:
        break
      case MessageReceiveType.UNSUPPORTED:
        break
      case MessageReceiveType.VIDEO:
        break
      default:
        break
    }

    // const message = await this.prisma.message.create({
    //   data
    // })
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
