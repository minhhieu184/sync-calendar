import { default as DataSource } from '@model/db/data-source'
import {
  GoogleRoom,
  GoogleRoomRepository,
  MicrosoftRoom,
  MicrosoftRoomRepository,
  RoomRepository
} from '@model/db/entity'
import { GaxiosError } from 'gaxios'
import { AbstractPolymorphicRepository } from 'typeorm-polymorphic'

async function main() {
  await DataSource.initialize()

  const roomRepository: RoomRepository =
    AbstractPolymorphicRepository.createRepository(DataSource, RoomRepository)

  const googleRoomRepository: GoogleRoomRepository =
    AbstractPolymorphicRepository.createRepository(
      DataSource,
      GoogleRoomRepository
    )
  const microsoftRoomRepository: MicrosoftRoomRepository =
    AbstractPolymorphicRepository.createRepository(
      DataSource,
      MicrosoftRoomRepository
    )

  await Promise.all([
    DataSource.query('TRUNCATE "room" RESTART IDENTITY;'),
    DataSource.query('TRUNCATE "google_room" RESTART IDENTITY;'),
    DataSource.query('TRUNCATE "microsoft_room" RESTART IDENTITY;')
  ])

  const rooms = await roomRepository.save(
    roomsData.map(({ name }) => roomRepository.create({ name }))
  )
  const googleRooms: GoogleRoom[] = []
  const microsoftRooms: MicrosoftRoom[] = []

  rooms.forEach((room, index) => {
    const roomData = roomsData[index]
    if (roomData.google?.email) {
      const googleRoom = googleRoomRepository.create({
        name: roomData.name,
        email: roomData.google.email,
        room
      })
      googleRooms.push(googleRoom)
    }
    if (roomData.microsoft?.email) {
      const microsoftRoom = microsoftRoomRepository.create({
        name: roomData.name,
        email: roomData.microsoft.email,
        room
      })
      microsoftRooms.push(microsoftRoom)
    }
  })

  await Promise.all([
    googleRoomRepository.save(googleRooms),
    microsoftRoomRepository.save(microsoftRooms)
  ])

  const res = await googleRoomRepository.find()
  console.log('main ~ res:', res)
  const sdfas = await microsoftRoomRepository.find()
  console.log('main ~ sdfas:', sdfas)
}

main()
  .catch((e) => {
    if (e instanceof GaxiosError) {
      console.log('❌ GaxiosError:', e.response?.data.error)
      console.log(e.stack)
      return
    }
    console.error('❌ Failed to run the script:', e)
  })
  .finally(() => process.exit(0))

interface RoomData {
  name: string
  google?: { email: string }
  microsoft?: { email: string }
}
const roomsData: RoomData[] = [
  {
    name: 'Thách Thức',
    google: {
      email: 'c_188de89oetpugi40n4didk4q5uihe@resource.calendar.google.com'
    }
  },
  {
    name: 'Mirai Studio',
    google: {
      email: 'c_18831tf06rmg4g6clg9en76bafpm6@resource.calendar.google.com'
    }
  },
  {
    name: 'Tôn Trọng',
    google: {
      email: 'c_18803s0g6f9gogf6mm5avs3tp5tlm@resource.calendar.google.com'
    }
  },
  {
    name: 'BOD Room',
    google: {
      email: 'c_188fj8hco6iueh6lhpft18s34bt7i@resource.calendar.google.com'
    }
  },
  {
    name: 'Khát Vọng',
    google: {
      email: 'c_188c3b1vutsd6ilgm07i10026sg84@resource.calendar.google.com'
    },
    microsoft: { email: 'hud.17.khatvong@iceteasoftware.com' }
  },
  {
    name: 'Phone Booth Trái',
    google: {
      email: 'c_188fcbqqamu4kgkdjnp4i89q1bjk8@resource.calendar.google.com'
    },
    microsoft: { email: 'hud.17.booth1@iceteasoftware.com' }
  },
  {
    name: 'Phone Booth Phải',
    google: {
      email: 'c_1887fmavbcioohf1ipocpli0f75i8@resource.calendar.google.com'
    },
    microsoft: { email: 'hud.17.booth2@iceteasoftware.com' }
  },
  {
    name: 'Trách Nhiệm',
    google: {
      email: 'c_18874ihjd4iioh1slnr4dd0bci890@resource.calendar.google.com'
    },
    microsoft: { email: 'hud.17.trachnhiem@iceteasoftware.com' }
  },
  {
    name: 'Trà Đá',
    google: {
      email: 'c_1883ildm82dj4hdjhpvvo6olt49mc@resource.calendar.google.com'
    },
    microsoft: { email: 'hud.17.trada@iceteasoftware.com' }
  },
  {
    name: 'Hợp Tác',
    google: {
      email: 'c_188fjj68tv8liinojuv30l4971t8a@resource.calendar.google.com'
    },
    microsoft: { email: 'hud.17.hoptac@iceteasoftware.com' }
  },
  {
    name: 'Trà Xanh',
    google: {
      email: 'c_188depofelo4ghogjmh696ou8ereu@resource.calendar.google.com'
    },
    microsoft: { email: 'hud.17.traxanh@iceteasoftware.com' }
  },
  {
    name: 'Chủ Động',
    google: {
      email: 'c_18826djmihdiagcuit1ns3ditlqhc@resource.calendar.google.com'
    }
  },
  {
    name: 'Mirai 1',
    microsoft: { email: 'hud.15.mirai1@iceteasoftware.com' }
  },
  {
    name: 'Mirai 2',
    microsoft: { email: 'hud.15.mirai2@iceteasoftware.com' }
  },
  {
    name: 'Mirai 3',
    microsoft: { email: 'hud.15.mirai3@iceteasoftware.com' }
  },
  {
    name: 'Mirai 4',
    microsoft: { email: 'hud.15.mirai4@iceteasoftware.com' }
  }
]
