import { prisma } from "../config/prisma";

export const getRoomsSummary = async () => {
  const [total, available, maintenance, occupied, rooms] = await Promise.all([
    prisma.rooms.count(),
    prisma.rooms.count({
      where: {
        status_room: "VACANT",
      },
    }),
    prisma.rooms.count({
      where: {
        status_room: "MAINTENANCE",
      },
    }),
    prisma.rooms.count({
      where: {
        status_room: "OCCUPIED",
      },
    }),
    prisma.rooms.findMany({
      orderBy: {
        room_code: "asc",
      },
      select: {
        room_code: true,
        room_type: true,
        monthly_price: true,
        floor: true,
        status_room: true,
      },
    }),
  ]);

  // Map enum keys to their respective Thai strings for the frontend
  const statusRoomMap: Record<string, string> = {
    VACANT: "ว่าง (พร้อมเข้าพัก)",
    MAINTENANCE: "อยู่ระหว่างซ่อมบำรุง",
    OCCUPIED: "มีผู้เช่า",
  };

  const mappedRooms = rooms.map((room) => ({
    room_code: room.room_code,
    room_type: room.room_type,
    monthly_price: room.monthly_price ? Number(room.monthly_price) : null,
    floor: room.floor,
    status_room: statusRoomMap[room.status_room] || room.status_room,
  }));

  return {
    จำนวนห้องทั้งหมดที่มี: total,
    จำนวนห้องที่ว่าง: available,
    จำนวนห้องที่อยู่ระหว่างซ่อมบำรุง: maintenance,
    จำนวนห้องที่มีผู้เช่า: occupied,
    ห้องทั้งหมด: mappedRooms,
  };
};
