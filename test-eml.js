import fs from 'fs';

// Mock dependencies
const now = new Date().toUTCString();
const relBoundary = '----=_Rel_123';
const altBoundary = '----=_Alt_456';
const html = '<!DOCTYPE html><html><body><h1>Hello</h1></body></html>';
const plainText = 'Hello text';
const cidMap = new Map();
// Add one image
cidMap.set('foo', { cid: 'img1@test', mime: 'image/jpeg', b64: 'abc' });

let imgIdx = 0;

function wrapBase64(b64, lineLen = 76) {
  const lines = [];
  for (let i = 0; i < b64.length; i += lineLen) {
    lines.push(b64.slice(i, i + lineLen));
  }
  return lines.join('\r\n');
}

function encodeQuotedPrintable(str) {
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line)
    .join('\r\n');
}

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
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    encodeQuotedPrintable(html),
    ``,
    `--${altBoundary}--`,
    ``,
  ].join('\r\n');

  const emlContent = [
    `MIME-Version: 1.0`,
    `Message-ID: <123@emleditor.local>`,
    `Date: ${now}`,
    `From: sender@example.com`,
    `To: recipient@example.com`,
    `Subject: Email`,
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
      `Content-Transfer-Encoding: quoted-printable`,
      ``,
      encodeQuotedPrintable(html),
      ``,
      `--${altBoundary}--`,
    ].join('\r\n'),
    cidMap.size > 0 ? imageParts : null,
    cidMap.size > 0 ? `--${relBoundary}--` : null,
  ]
    .filter(line => line !== null)
    .join('\r\n');

fs.writeFileSync('out.eml', emlContent);
console.log('done');
