export const translateStatus = (status?: string): string => {
  if (!status) return '';
  switch (status) {
    case 'Occupied': return 'มีผู้เช่า';
    case 'Vacant': return 'ว่าง';
    case 'Maintenance': return 'ซ่อมบำรุง';
    case 'Active': return 'ปกติ';
    case 'Pending': return 'รอดำเนินการ';
    case 'Open': return 'เปิดใหม่';
    case 'In Progress': return 'กำลังดำเนินการ';
    case 'Resolved': return 'แก้ไขแล้ว';
    case 'Paid': return 'ชำระแล้ว';
    case 'Unpaid': return 'ยังไม่ชำระ';
    case 'Overdue': return 'ค้างชำระ';
    case 'Verificata': return 'รอตรวจสอบ';
    case 'Settled': return 'เสร็จสิ้น';
    default: return status;
  }
};

export const translatePriority = (priority?: string): string => {
  if (!priority) return '';
  switch (priority) {
    case 'Low': return 'ต่ำ';
    case 'Medium': return 'ปานกลาง';
    case 'High': return 'สูง';
    default: return priority;
  }
};

export const translateRoomType = (type?: string): string => {
  if (!type) return '';
  switch (type) {
    case 'Studio': return 'สตูดิโอ';
    case '1-Bedroom': return '1 ห้องนอน';
    case '2-Bedroom': return '2 ห้องนอน';
    case 'Penthouse': return 'เพนท์เฮาส์';
    default: return type;
  }
};

export const translateMonth = (monthStr?: string): string => {
  if (!monthStr) return '';
  
  // Try to parse the string to check if it's a valid date or year-month representation
  const d = new Date(monthStr);
  if (!isNaN(d.getTime()) && monthStr.includes('-')) {
    return d.toLocaleString('th-TH', { month: 'long', year: 'numeric' });
  }

  // Handle formats like "June 2026"
  const parts = monthStr.trim().split(/\s+/);
  if (parts.length === 2) {
    const monthMap: Record<string, string> = {
      'January': 'มกราคม', 'February': 'กุมภาพันธ์', 'March': 'มีนาคม', 'April': 'เมษายน',
      'May': 'พฤษภาคม', 'June': 'มิถุนายน', 'July': 'กรกฎาคม', 'August': 'สิงหาคม',
      'September': 'กันยายน', 'October': 'ตุลาคม', 'November': 'พฤศจิกายน', 'December': 'ธันวาคม',
      'Jan': 'ม.ค.', 'Feb': 'ก.พ.', 'Mar': 'มี.ค.', 'Apr': 'เม.ย.',
      'Jun': 'มิ.ย.', 'Jul': 'ก.ค.', 'Aug': 'ส.ค.', 'Sep': 'ก.ย.', 'Oct': 'ต.ค.', 'Nov': 'พ.ย.', 'Dec': 'ธ.ค.'
    };
    const enMonth = parts[0];
    const year = parseInt(parts[1]);
    const thMonth = monthMap[enMonth] || enMonth;
    // Thai year is Buddhist Era (+543)
    const thYear = !isNaN(year) && year < 2500 ? (year + 543).toString() : parts[1];
    return `${thMonth} ${thYear}`;
  }
  
  return monthStr;
};
