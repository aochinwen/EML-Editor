import { buildEmailHtml } from './htmlRenderer';

// ── Helpers ────────────────────────────────────────────────────────────────

function encodeBase64String(str) {
  const binary = unescape(encodeURIComponent(str));
  return wrapBase64(btoa(binary));
}

function wrapBase64(b64, lineLen = 76) {
  const lines = [];
  for (let i = 0; i < b64.length; i += lineLen) {
    lines.push(b64.slice(i, i + lineLen));
  }
  return lines.join('\r\n');
}

function mimeTypeFromDataUrl(dataUrl) {
  const m = dataUrl.match(/^data:([^;]+);/);
  return m ? m[1] : 'image/png';
}

function base64FromDataUrl(dataUrl) {
  return dataUrl.split(',')[1] || '';
}

async function fetchAsBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const mime = (res.headers.get('content-type') || 'image/png').split(';')[0].trim();
    const bytes = new Uint8Array(buf);
    let binary = '';
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const b64 = btoa(binary);
    return { mime, b64 };
  } catch {
    return null;
  }
}

// ── Extract all image src values from an HTML string ───────────────────────

function extractImageSrcs(html) {
  const srcs = new Set();
  const re = /src="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const src = m[1];
    if (src && (src.startsWith('http') || src.startsWith('data:'))) {
      srcs.add(src);
    }
  }
  return [...srcs];
}

// ── Build the EML asynchronously ──────────────────────────────────────────

export async function exportEml(elements, emailMeta) {
  let html = buildEmailHtml(elements, emailMeta);
  const now = new Date().toUTCString();

  const altBoundary  = `----=_Alt_${Date.now()}`;
  const relBoundary  = `----=_Rel_${Date.now() + 1}`;

  const plainText = `Please view this email in an HTML-capable email client.`;

  // Collect every unique image src
  const srcs = extractImageSrcs(html);

  // Build cid map: src → { cid, mime, b64 }
  const cidMap = new Map();
  let imgIdx = 0;

  await Promise.all(srcs.map(async (src) => {
    const cid = `img${++imgIdx}@emlexport`;
    if (src.startsWith('data:')) {
      const mime = mimeTypeFromDataUrl(src);
      const b64  = base64FromDataUrl(src);
      cidMap.set(src, { cid, mime, b64 });
    } else {
      const result = await fetchAsBase64(src);
      if (result) {
        cidMap.set(src, { cid, mime: result.mime, b64: result.b64 });
      }
    }
  }));

  // Replace all src="..." in html with cid references
  html = html.replace(/src="([^"]+)"/g, (match, src) => {
    const entry = cidMap.get(src);
    return entry ? `src="cid:${entry.cid}"` : match;
  });

  // Build inline image MIME parts
  const imageParts = [...cidMap.values()].map(({ cid, mime, b64 }) => [
    `--${relBoundary}`,
    `Content-Type: ${mime}; name="${cid.split('@')[0]}"`,
    `Content-Transfer-Encoding: base64`,
    `Content-ID: <${cid}>`,
    `Content-Disposition: inline; filename="${cid.split('@')[0]}"`,
    ``,
    wrapBase64(b64),
    ``,
  ].join('\r\n')).join('\r\n');

  // multipart/alternative (plain + html) nested inside multipart/related
  const altPart = [
    `--${relBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    ``,
    `--${altBoundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    plainText,
    ``,
    `--${altBoundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    encodeBase64String(html),
    ``,
    `--${altBoundary}--`,
    ``,
  ].join('\r\n');

  const emlContent = [
    `MIME-Version: 1.0`,
    `Message-ID: <${Date.now()}@emleditor.local>`,
    `Date: ${now}`,
    `From: ${emailMeta.from || 'sender@example.com'}`,
    `To: ${emailMeta.to || 'recipient@example.com'}`,
    emailMeta.cc  ? `CC: ${emailMeta.cc}`   : null,
    emailMeta.bcc ? `BCC: ${emailMeta.bcc}` : null,
    `Subject: ${emailMeta.subject || 'Email'}`,
    `X-Unsent: 1`,
    cidMap.size > 0 
      ? `Content-Type: multipart/related; type="multipart/alternative"; boundary="${relBoundary}"`
      : `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    `X-Mailer: EML Editor`,
    ``,
    cidMap.size > 0 ? altPart : [
      `--${altBoundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      plainText,
      ``,
      `--${altBoundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      encodeBase64String(html),
      ``,
      `--${altBoundary}--`,
    ].join('\r\n'),
    cidMap.size > 0 ? imageParts : null,
    cidMap.size > 0 ? `--${relBoundary}--` : null,
    ``,
  ]
    .filter(line => line !== null)
    .join('\r\n');

  return emlContent;
}

export async function downloadEml(elements, emailMeta) {
  const content = await exportEml(elements, emailMeta);
  const blob = new Blob([content], { type: 'message/rfc822' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(emailMeta.subject || 'email').replace(/[^a-z0-9]/gi, '_')}.eml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
