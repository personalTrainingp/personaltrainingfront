function buildSlots(from = "06:00", to = "20:30", stepMin = 30) {
  const slots = [];
  let cur = dayjs().hour(Number(from.split(":")[0])).minute(Number(from.split(":")[1]));
  const end = dayjs().hour(Number(to.split(":")[0])).minute(Number(to.split(":")[1]));
  while (cur.isBefore(end) || cur.isSame(end)) {
    slots.push(cur.format("HH:mm"));
    cur = cur.add(stepMin, "minute");
  }
  return slots;
}
export const timeSlots = buildSlots(); // ["06:00","06:30","07:00",...]