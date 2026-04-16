import { buildEmailHtml, renderElementHtmlWithPostProcessing } from './htmlRenderer';

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

export async function downloadImageEml(elements, emailMeta) {
  let toPng;
  try {
    const htmlToImage = await import('html-to-image');
    toPng = htmlToImage.toPng || htmlToImage.default?.toPng;
    if (!toPng) throw new Error('toPng not found in html-to-image module');
  } catch (err) {
    console.error(err);
    alert('Please ensure "html-to-image" is installed and restart the server.');
    return;
  }

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0px';
  container.style.top = '0px';
  container.style.width = '600px'; 
  container.style.zIndex = '-9999';
  container.style.opacity = '0.01'; 
  container.style.pointerEvents = 'none';
  container.style.backgroundColor = emailMeta?.backgroundColor || '#f4f4f5';
  container.style.fontFamily = 'sans-serif';
  document.body.appendChild(container);

  const imagesBase64 = [];

  for (const element of elements) {
    const rawHtml = renderElementHtmlWithPostProcessing(element);
    const safeHtml = rawHtml
      .replace(/<!--\[if gte mso 9\]>.*?<!\[endif\]-->/gis, '')
      .replace(/<!--\[if gte mso 9\]><!-- -->.*?<!\[endif\]-->/gis, '')
      .replace(/<v:[a-z0-9]+[^>]*>.*?<\/v:[a-z0-9]+>/gis, ''); // Remove VML nodes that crash XML serializers
      
    container.innerHTML = `<div style="width: 600px;">${safeHtml}</div>`;
    
    // Wait for images to load inside this element
    const imgs = Array.from(container.querySelectorAll('img'));
    await Promise.all(imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    await new Promise(r => setTimeout(r, 60)); // ensure fonts/DOM settle

    try {
      const dataUrl = await toPng(container, { 
        pixelRatio: 2,
        skipFonts: true,
        fontEmbedCSS: '', 
        backgroundColor: emailMeta?.backgroundColor || '#ffffff',
        style: {
          opacity: '1',
          position: 'static',
          zIndex: '1'
        }
      });
      imagesBase64.push(dataUrl);
    } catch (e) {
      console.error('Failed to capture element', element.id, e);
    }
  }

  document.body.removeChild(container);

  // Now construct the EML
  const now = new Date().toUTCString();
  const relBoundary  = `----=_ImageRel_${Date.now()}`;
  const altBoundary  = `----=_ImageAlt_${Date.now()}`;
  
  let sliceHtml = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${emailMeta?.backgroundColor || '#ffffff'}; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"><tr><td align="center" style="padding:0;margin:0;font-size:0;line-height:0;"><table width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;margin:0 auto;background-color:${emailMeta?.backgroundColor || '#ffffff'}; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">`;
  
  imagesBase64.forEach((_, i) => {
    sliceHtml += `<tr><td style="padding:0;margin:0;font-size:0;line-height:0;vertical-align:top;"><img src="cid:slice-${i}@emleditor.local" width="600" style="display:block;width:100%;max-width:600px;border:0;outline:none;text-decoration:none;margin:0;padding:0;" alt="Email Content Slice" /></td></tr>`;
  });
  sliceHtml += `</table></td></tr></table>`;

  const finalHtmlBody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head>
<body style="margin:0;padding:0;background-color:${emailMeta?.backgroundColor || '#ffffff'};">
  ${sliceHtml}
</body>
</html>`;

  // Build inline image MIME parts
  const imageParts = imagesBase64.map((dataUrl, i) => {
    const b64 = base64FromDataUrl(dataUrl);
    const mime = mimeTypeFromDataUrl(dataUrl);
    return [
      `--${relBoundary}`,
      `Content-Type: ${mime}; name="slice-${i}.png"`,
      `Content-Transfer-Encoding: base64`,
      `Content-ID: <slice-${i}@emleditor.local>`,
      `Content-Disposition: inline; filename="slice-${i}.png"`,
      ``,
      wrapBase64(b64),
      ``,
    ].join('\r\n');
  }).join('\r\n');

  const altPart = [
    `--${relBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    ``,
    `--${altBoundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    `Please view this email in an HTML-capable email client.`,
    ``,
    `--${altBoundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    encodeBase64String(finalHtmlBody),
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
    `Subject: ${emailMeta.subject || 'Email Image Export'}`,
    `X-Unsent: 1`,
    `Content-Type: multipart/related; type="multipart/alternative"; boundary="${relBoundary}"`,
    `X-Mailer: EML Editor`,
    ``,
    altPart,
    imageParts,
    `--${relBoundary}--`,
    ``,
  ]
    .filter(line => line !== null)
    .join('\r\n');

  const blob = new Blob([emlContent], { type: 'message/rfc822' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(emailMeta.subject || 'email_images').replace(/[^a-z0-9]/gi, '_')}.eml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
