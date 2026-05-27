import { Invoice } from '@/types/tenant';

export const resolveInvoiceDetails = (inv: Invoice) => {
  if (inv.details) return inv.details;

  // Static lookups for original IDs
  const staticDetails: Record<string, any> = {
    'inv-101': {
      name: 'Adum Smit',
      room: '504',
      startDate: '01 May 2026',
      endDate: '31 May 2026',
      invoiceDate: '25 May 2026 10:15',
      amountWords: 'Four thousand seven hundred and twenty-six baht only',
      items: [
        { no: 1, item: 'Room Rate', quantity: 1, price: 3800, total: 3800 },
        { no: 2, item: 'Electricity Charge 7722-7834', quantity: 112, price: 6.5, total: 728 },
        { no: 3, item: 'Water Charge 1005-1016', quantity: 11, price: 18.0, total: 198 }
      ]
    },
    'inv-100': {
      name: 'Adum Smit',
      room: '504',
      startDate: '01 April 2026',
      endDate: '30 April 2026',
      invoiceDate: '25 April 2026 09:30',
      amountWords: 'Four thousand seven hundred and sixty-two baht only',
      items: [
        { no: 1, item: 'Room Rate', quantity: 1, price: 3800, total: 3800 },
        { no: 2, item: 'Electricity Charge 7610-7722', quantity: 112, price: 6.5, total: 728 },
        { no: 3, item: 'Water Charge 992-1005', quantity: 13, price: 18.0, total: 234 }
      ]
    }
  };

  if (staticDetails[inv.id]) return staticDetails[inv.id];

  // Dynamic fallback for any custom invoice
  const roomRate = Math.min(inv.amount, 3800);
  const remaining = inv.amount - roomRate;
  const items = [{ no: 1, item: 'Room Rate', quantity: 1, price: roomRate, total: roomRate }];
  
  if (remaining > 0) {
    const elecQty = Math.floor((remaining * 0.7) / 6.5);
    const elecTotal = Math.round(elecQty * 6.5 * 100) / 100;
    if (elecQty > 0) {
      items.push({ no: 2, item: 'Electricity Charge (Est.)', quantity: elecQty, price: 6.5, total: elecTotal });
    }
    const waterTotal = Math.round((remaining - elecTotal) * 100) / 100;
    if (waterTotal > 0) {
      const waterQty = Math.round(waterTotal / 18.0);
      items.push({ no: 3, item: 'Water Charge (Est.)', quantity: waterQty > 0 ? waterQty : 1, price: 18.0, total: waterTotal });
    }
  }

  return {
    name: 'Adum Smit',
    room: '504',
    startDate: '01 ' + (inv.month.split(' ')[0] || 'Month'),
    endDate: '28 ' + (inv.month.split(' ')[0] || 'Month'),
    invoiceDate: inv.dueDate,
    amountWords: 'Total charge amount of ' + inv.amount + ' baht only',
    items
  };
};

export const handlePrint = (inv: Invoice) => {
  const details = resolveInvoiceDetails(inv);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice Receipt - ${inv.id}</title>
        <style>
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            color: #1e293b; 
            padding: 40px; 
            background: #fff;
          }
          .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
          }
          .header { 
            border-bottom: 2px solid #f1f5f9; 
            padding-bottom: 24px; 
            margin-bottom: 24px; 
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .logo-sec {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-text {
            font-size: 20px;
            font-weight: 900;
            color: #ff3737;
          }
          .title { 
            font-size: 22px; 
            font-weight: 900; 
            color: #0f172a; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            text-align: right;
          }
          .ref-id {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            margin-top: 4px;
            font-family: monospace;
          }
          .grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 32px; 
            font-size: 13px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #f1f5f9;
          }
          .meta-item { 
            display: flex; 
            flex-direction: column; 
            gap: 4px;
          }
          .meta-label { 
            font-size: 10px; 
            font-weight: 800; 
            color: #94a3b8; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
          }
          .meta-val { 
            font-size: 13px; 
            font-weight: 700; 
            color: #334155; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 32px; 
          }
          th { 
            background: #f8fafc; 
            padding: 12px 16px; 
            text-align: left; 
            font-size: 10px; 
            font-weight: 800; 
            color: #64748b; 
            text-transform: uppercase; 
            border-bottom: 2px solid #f1f5f9; 
          }
          td { 
            padding: 14px 16px; 
            font-size: 13px; 
            border-bottom: 1px solid #f1f5f9; 
            color: #334155;
          }
          .td-num {
            font-family: monospace;
            font-weight: 650;
          }
          .total-row { 
            font-weight: 900; 
            font-size: 15px; 
            background: #fffdf9; 
          }
          .total-row td {
            border-top: 2px solid #ffc193;
          }
          .footer { 
            border-top: 1px solid #f1f5f9; 
            padding-top: 20px; 
            font-size: 11px; 
            color: #94a3b8; 
            text-align: center; 
            font-weight: 600;
          }
          .baht-words { 
            font-style: italic; 
            color: #64748b; 
            font-weight: 600; 
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo-sec">
              <div class="logo-text">RentDesk</div>
            </div>
            <div>
              <div class="title">Billing Statement</div>
              <div class="ref-id" style="text-align: right;">Reference ID: ${inv.id}</div>
            </div>
          </div>
          <div class="grid">
            <div class="meta-item">
              <span class="meta-label">Tenant Name</span>
              <span class="meta-val">${details.name}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Room Number</span>
              <span class="meta-val">Room ${details.room}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Service Charge Period</span>
              <span class="meta-val">${details.startDate} - ${details.endDate}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Billing Date</span>
              <span class="meta-val">${details.invoiceDate}</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 60px; text-align: center;">No</th>
                <th>Item Description</th>
                <th style="width: 80px; text-align: center;">Qty</th>
                <th style="width: 140px; text-align: right;">Price (THB)</th>
                <th style="width: 140px; text-align: right;">Total (THB)</th>
              </tr>
            </thead>
            <tbody>
              ${details.items.map((item: any) => `
                <tr>
                  <td style="text-align: center; color: #94a3b8; font-weight: 700;">${item.no}</td>
                  <td style="font-weight: 600;">${item.item}</td>
                  <td style="text-align: center; font-weight: 700;">${item.quantity}</td>
                  <td class="td-num" style="text-align: right;">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td class="td-num" style="text-align: right; font-weight: 700; color: #0f172a;">${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3" class="baht-words">${details.amountWords}</td>
                <td style="text-align: right; color: #64748b; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Net Amount</td>
                <td class="td-num" style="text-align: right; color: #ff3737; font-size: 18px;">฿${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            This is a computer-generated billing receipt. If you have any questions, please contact our building administrator.
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
