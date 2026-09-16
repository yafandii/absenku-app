function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

const CRC_TABLE = makeCrcTable();

function computeCrc32(buf: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZipArchive(files: { name: string; data: string }[]): Uint8Array {
  const encoder = new TextEncoder();
  const fileRecords: {
    nameBuf: Uint8Array;
    dataBuf: Uint8Array;
    crc: number;
    offset: number;
    localHeaderSize: number;
  }[] = [];

  let offset = 0;

  for (const file of files) {
    const nameBuf = encoder.encode(file.name);
    const dataBuf = encoder.encode(file.data);
    const crc = computeCrc32(dataBuf);
    const localHeaderSize = 30 + nameBuf.length;

    fileRecords.push({
      nameBuf,
      dataBuf,
      crc,
      offset,
      localHeaderSize,
    });

    offset += localHeaderSize + dataBuf.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const rec of fileRecords) {
    centralDirSize += 46 + rec.nameBuf.length;
  }

  const totalSize = centralDirOffset + centralDirSize + 22;
  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);

  let cur = 0;

  for (const rec of fileRecords) {
    view.setUint32(cur, 0x04034b50, true);
    view.setUint16(cur + 4, 20, true);
    view.setUint16(cur + 6, 0, true);
    view.setUint16(cur + 8, 0, true);
    view.setUint16(cur + 10, 0, true);
    view.setUint16(cur + 12, 0, true);
    view.setUint32(cur + 14, rec.crc, true);
    view.setUint32(cur + 18, rec.dataBuf.length, true);
    view.setUint32(cur + 22, rec.dataBuf.length, true);
    view.setUint16(cur + 26, rec.nameBuf.length, true);
    view.setUint16(cur + 28, 0, true);
    out.set(rec.nameBuf, cur + 30);
    out.set(rec.dataBuf, cur + 30 + rec.nameBuf.length);

    cur += 30 + rec.nameBuf.length + rec.dataBuf.length;
  }

  for (const rec of fileRecords) {
    view.setUint32(cur, 0x02014b50, true);
    view.setUint16(cur + 4, 20, true);
    view.setUint16(cur + 6, 20, true);
    view.setUint16(cur + 8, 0, true);
    view.setUint16(cur + 10, 0, true);
    view.setUint16(cur + 12, 0, true);
    view.setUint16(cur + 14, 0, true);
    view.setUint32(cur + 16, rec.crc, true);
    view.setUint32(cur + 20, rec.dataBuf.length, true);
    view.setUint32(cur + 24, rec.dataBuf.length, true);
    view.setUint16(cur + 28, rec.nameBuf.length, true);
    view.setUint16(cur + 30, 0, true);
    view.setUint16(cur + 32, 0, true);
    view.setUint16(cur + 34, 0, true);
    view.setUint16(cur + 36, 0, true);
    view.setUint32(cur + 38, 0, true);
    view.setUint32(cur + 42, rec.offset, true);
    out.set(rec.nameBuf, cur + 46);

    cur += 46 + rec.nameBuf.length;
  }

  view.setUint32(cur, 0x06054b50, true);
  view.setUint16(cur + 4, 0, true);
  view.setUint16(cur + 6, 0, true);
  view.setUint16(cur + 8, fileRecords.length, true);
  view.setUint16(cur + 10, fileRecords.length, true);
  view.setUint32(cur + 12, centralDirSize, true);
  view.setUint32(cur + 16, centralDirOffset, true);
  view.setUint16(cur + 20, 0, true);

  return out;
}

function escapeXml(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getColumnLetter(colIndex: number): string {
  let temp: number;
  let letter = "";
  let idx = colIndex;
  while (idx >= 0) {
    temp = idx % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    idx = Math.floor(idx / 26) - 1;
  }
  return letter;
}

export function buildExportFileName(options: {
  dateFilter?: string;
  divisionName?: string;
  statusFilter?: string;
}): string {
  const parts: string[] = ["Laporan_Presensi"];

  if (options.dateFilter) {
    parts.push(options.dateFilter);
  } else {
    parts.push("Semua_Tanggal");
  }

  if (
    options.divisionName &&
    options.divisionName !== "ALL" &&
    options.divisionName !== "Semua Divisi"
  ) {
    const cleanDiv = options.divisionName.replace(/[^a-zA-Z0-9]/g, "_");
    parts.push(`Divisi_${cleanDiv}`);
  }

  if (options.statusFilter && options.statusFilter !== "ALL") {
    const statusMap: Record<string, string> = {
      ON_TIME: "Tepat_Waktu",
      LATE: "Terlambat",
      NOT_CHECKED_OUT: "Belum_Checkout",
    };
    parts.push(statusMap[options.statusFilter] || options.statusFilter);
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  parts.push(`export_${timeStr}`);

  return parts.join("_");
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
): void {
  const sanitize = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(sanitize).join(",");
  const rowLines = rows.map((row) => row.map(sanitize).join(","));
  const csvContent = [headerLine, ...rowLines].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExcel(
  filename: string,
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
): void {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const wb = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Rekap Presensi" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const colsXml = `
  <cols>
    <col min="1" max="1" width="8" customWidth="1"/>
    <col min="2" max="2" width="16" customWidth="1"/>
    <col min="3" max="3" width="26" customWidth="1"/>
    <col min="4" max="4" width="28" customWidth="1"/>
    <col min="5" max="5" width="20" customWidth="1"/>
    <col min="6" max="6" width="16" customWidth="1"/>
    <col min="7" max="7" width="14" customWidth="1"/>
    <col min="8" max="8" width="14" customWidth="1"/>
    <col min="9" max="9" width="18" customWidth="1"/>
    <col min="10" max="10" width="18" customWidth="1"/>
  </cols>`;

  const headerCells = headers
    .map(
      (h, idx) =>
        `<c r="${getColumnLetter(idx)}1" t="inlineStr"><is><t>${escapeXml(h)}</t></is></c>`,
    )
    .join("");

  const headerRow = `<row r="1">${headerCells}</row>`;

  const dataRows = rows
    .map((row, rIdx) => {
      const rowNum = rIdx + 2;
      const cells = row
        .map((val, cIdx) => {
          const coord = `${getColumnLetter(cIdx)}${rowNum}`;
          if (typeof val === "number") {
            return `<c r="${coord}"><v>${val}</v></c>`;
          }
          return `<c r="${coord}" t="inlineStr"><is><t>${escapeXml(val)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowNum}">${cells}</row>`;
    })
    .join("");

  const ws = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  ${colsXml}
  <sheetData>
    ${headerRow}
    ${dataRows}
  </sheetData>
</worksheet>`;

  const zipBytes = createZipArchive([
    { name: "[Content_Types].xml", data: contentTypes },
    { name: "_rels/.rels", data: rels },
    { name: "xl/_rels/workbook.xml.rels", data: wbRels },
    { name: "xl/workbook.xml", data: wb },
    { name: "xl/worksheets/sheet1.xml", data: ws },
  ]);

  const blob = new Blob([zipBytes as unknown as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printOrDownloadPdf(
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
): void {
  const sanitize = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return "";
    return String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const headerHtml = headers.map((h) => `<th>${sanitize(h)}</th>`).join("");

  const rowsHtml = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${sanitize(cell)}</td>`).join("")}</tr>`,
    )
    .join("");

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${sanitize(title)}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm 10mm 12mm 10mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            padding: 16px;
            margin: 0;
            font-size: 11px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .brand {
            font-size: 18px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .title {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 4px;
          }
          .subtitle {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
          }
          .meta {
            text-align: right;
            font-size: 10px;
            color: #64748b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }
          th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 700;
            text-align: left;
            padding: 7px 8px;
            border: 1px solid #cbd5e1;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
          }
          td {
            padding: 6px 8px;
            border: 1px solid #e2e8f0;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .footer {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">ABSENKU</div>
            <div class="title">${sanitize(title)}</div>
            <div class="subtitle">${sanitize(subtitle)}</div>
          </div>
          <div class="meta">
            <div>Dicetak pada: ${new Date().toLocaleString("id-ID")}</div>
            <div>Total Data: ${rows.length}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>${headerHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div class="footer">
          <div>Dokumen resmi Absenku Cloud Attendance System</div>
          <div>Laporan Presensi Karyawan</div>
        </div>
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 350);
}
