function textStyle(props, key, extras = '') {
  const font     = props[`${key}Font`]      || 'sans-serif';
  const fontSize = props[`${key}FontSize`]  || '';
  const bold     = props[`${key}Bold`]      ? 'bold'   : 'normal';
  const italic   = props[`${key}Italic`]    ? 'italic' : 'normal';
  const align    = props[`${key}Align`]     || 'left';
  const color    = props[`${key}Color`]     || props.textColor || '';
  const decParts = [];
  if (props[`${key}Underline`]) decParts.push('underline');
  if (props[`${key}Strike`])    decParts.push('line-through');
  const dec = decParts.length ? decParts.join(' ') : 'none';
  const sizeStyle = fontSize ? `font-size:${fontSize};` : '';
  return `font-family:${font};${sizeStyle}font-weight:${bold};font-style:${italic};text-decoration:${dec};text-align:${align};${color ? `color:${color};mso-color-alt:${color};` : ''}${extras}`;
}

function renderOptionalLink(href, content, style) {
  if (!href) return '';
  return `<a href="${href}" style="${style}">${content}</a>`;
}

function renderTags(props, defaultAlign = 'left', marginBottom = '12px') {
  const hasTagsArray = Array.isArray(props.tags) && props.tags.length > 0;
  const fallbackTag = props.tag || props.mainTag;
  if (!hasTagsArray && !fallbackTag) return '';
  const align = props.tagsAlign || defaultAlign;
  const tagsToRender = hasTagsArray ? props.tags : [{ text: fallbackTag, color: props.tagColor || '#6366f1' }];
  
  return `<div style="text-align:${align}; margin-bottom:${marginBottom};">\n${tagsToRender.map(t => `  <span style="display:inline-block;background:${t.color || '#6366f1'};color:#fff;font-size:11px;padding:3px 10px;border-radius:999px;font-family:sans-serif;margin:0 4px 4px 0">${t.text}</span>`).join('\n')}\n</div>`;
}

function resolveHiddenProps(rawProps = {}) {
  const next = { ...rawProps };
  Object.keys(rawProps).forEach((k) => {
    if (!k.endsWith('Hidden')) return;
    if (!rawProps[k]) return;
    const baseKey = k.slice(0, -6);
    if (Object.prototype.hasOwnProperty.call(next, baseKey)) {
      next[baseKey] = '';
    }
  });
  return next;
}

function parseVerticalMargin(margin = '') {
  const parts = `${margin}`.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { top: '', bottom: '' };
  if (parts.length === 1) return { top: parts[0], bottom: parts[0] };
  if (parts.length === 2) return { top: parts[0], bottom: parts[0] };
  if (parts.length === 3) return { top: parts[0], bottom: parts[2] };
  return { top: parts[0], bottom: parts[2] };
}

function getInternalPadding(props = {}, fallback = '0') {
  return typeof props.elementPadding === 'string' && props.elementPadding.trim()
    ? props.elementPadding.trim()
    : fallback;
}

function getOptionalBackground(props = {}, fallback = 'transparent') {
  return props.useBackgroundColor ? (props.backgroundColor || '#ffffff') : fallback;
}

function usesInternalPaddingOverride(type = '') {
  return [
    'image-single',
    'image-two-col',
    'image-caption',
    'image-three-col',
    'image-grid-2x2',
    'image-grid-3-horizontal',
    'image-left-text',
    'image-right-text',
    'image-big-button',
    'image-big-col',
    'image-video',
    'image-panorama',
  ].includes(type);
}

export function withElementSpacing(html, props = {}) {
  const padding = (props.elementPadding || '').trim();
  const margin = (props.elementMargin || '').trim();
  if (!padding && !margin) return html;

  const { top, bottom } = parseVerticalMargin(margin);
  const bgStyle = (props.useBackgroundColor && props.backgroundColor) ? `background-color:${props.backgroundColor};` : '';
  const tdStyle = [padding ? `padding:${padding}` : '', margin ? `margin:${margin}` : '', bgStyle]
    .filter(Boolean)
    .join(';');

  return `<table width="100%" cellpadding="0" cellspacing="0" style="${margin ? `margin:${margin};` : ''}">
${top ? `<tr><td style="height:${top};line-height:${top};font-size:0">&nbsp;</td></tr>` : ''}
<tr><td style="${tdStyle}">${html}</td></tr>
${bottom ? `<tr><td style="height:${bottom};line-height:${bottom};font-size:0">&nbsp;</td></tr>` : ''}
</table>`;
}

function cleanupEmptyMarkup(html = '') {
  return html
    .replace(/<img\b([^>]*?)src=(['"])\s*\2([^>]*)>/gi, '')
    .replace(/<(h[1-6]|p|span|strong|em)\b[^>]*>\s*<\/\1>/gi, '')
    .replace(/<a\b[^>]*>\s*<\/a>/gi, '')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

function getImageWidthStyle(value, fallback = '100%') {
  const width = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  return `width:${width};max-width:100%;height:auto;`;
}

function getSplitColumnWidths(primaryWidth, fallbackPrimary = '42%', fallbackSecondary = '58%') {
  const normalized = typeof primaryWidth === 'string' ? primaryWidth.trim() : '';
  const percentMatch = normalized.match(/^([0-9]+(?:\.[0-9]+)?)%$/);
  if (!percentMatch) {
    return { primary: fallbackPrimary, secondary: fallbackSecondary };
  }

  const primaryValue = Number(percentMatch[1]);
  if (!Number.isFinite(primaryValue) || primaryValue <= 0 || primaryValue >= 100) {
    return { primary: fallbackPrimary, secondary: fallbackSecondary };
  }

  const secondaryValue = 100 - primaryValue;
  return {
    primary: `${primaryValue}%`,
    secondary: `${secondaryValue}%`,
  };
}

export function renderElementHtml(element) {
  const { type, props: rawProps } = element;
  const props = resolveHiddenProps(rawProps);

  switch (type) {
    case 'header-logo-center':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor};border-bottom:${props.borderBottom || 'none'}">
  <tr><td align="${props.align || 'center'}" style="padding:20px">
    <img src="${props.logoUrl}" alt="Logo" style="max-height:50px;display:inline-block"/>
  </td></tr>
</table>`;

    case 'header-logo-left':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td style="padding:16px 24px"><img src="${props.logoUrl}" alt="Logo" style="max-height:40px"/></td>
    <td align="right" style="padding:16px 24px">
      ${(props.navLinks || []).map(l => `<a href="#" style="color:#c7d2fe;text-decoration:none;margin-left:16px;font-size:14px">${l}</a>`).join('')}
    </td>
  </tr>
</table>`;

    case 'header-banner':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:32px 24px">
    <h1 style="margin:0;font-size:28px;color:${props.textColor};font-family:sans-serif">${props.title}</h1>
    <p style="margin:8px 0 0;color:${props.textColor};opacity:0.8;font-family:sans-serif">${props.subtitle}</p>
  </td></tr>
</table>`;

    case 'header-minimal':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor};border-bottom:${props.borderBottom || '3px solid #4F46E5'}">
  <tr><td style="padding:16px 24px">
    <span style="font-size:20px;font-weight:700;color:${props.textColor};font-family:sans-serif">${props.title}</span>
  </td></tr>
</table>`;

    case 'hero-fullwidth':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td>
    ${props.link ? `<a href="${props.link}">` : ''}
    <img src="${props.imageUrl}" alt="${props.alt}" width="100%" style="display:block;max-width:100%"/>
    ${props.link ? '</a>' : ''}
  </td></tr>
</table>`;

    case 'hero-overlay':
      return `<div style="background-color:#000000;width:100%;">
  <!--[if gte mso 9]><!-- -->
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
    <v:fill type="tile" src="${props.imageUrl}" color="#000000"/>
  </v:background>
  <![endif]-->
  <table width="100%" height="280" cellpadding="0" cellspacing="0" border="0">
    <tr><td background="${props.imageUrl}" style="background-image:url('${props.imageUrl}');background-size:cover;background-position:center;text-align:center;vertical-align:middle">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${props.overlayColor}">
        <tr><td align="center" style="padding:60px 24px;vertical-align:middle">
          <h2 style="margin:0;font-size:26px;${textStyle(props,'overlayText')}">${props.overlayText}</h2>
          <p style="margin:8px 0 0;${textStyle(props,'overlaySubtext')}">${props.overlaySubtext}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;

    case 'hero-split':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="50%" style="padding:24px"><img src="${props.imageUrl}" alt="Hero" width="100%" style="display:block"/></td>
    <td width="50%" style="padding:24px;vertical-align:middle">
      <h2 style="margin:0 0 12px;font-size:22px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
      <p style="margin:0 0 20px;color:#374151;${textStyle(props,'body')}">${props.body}</p>
      <a href="${props.ctaLink}" style="background:#4F46E5;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-family:sans-serif">${props.ctaLabel}</a>
    </td>
  </tr>
</table>`;

    case 'content-single':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:32px 40px" align="${props.align || 'left'}">
    ${props.title ? `<h2 style="margin:0 0 12px;font-size:22px;color:${props.titleColor};${textStyle(props,'title')}">${props.title}</h2>` : ''}
    ${props.body ? `<p style="margin:0;color:${props.textColor};line-height:1.6;${textStyle(props,'body')}">${props.body}</p>` : ''}
  </td></tr>
</table>`;

    case 'content-two-col':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="50%" style="padding:24px 20px 24px 40px;vertical-align:top">
      <h3 style="margin:0 0 8px;font-size:18px;color:#111827;${textStyle(props,'col1Title')}">${props.col1Title}</h3>
      <p style="margin:0;color:#374151;line-height:1.6;${textStyle(props,'col1Body')}">${props.col1Body}</p>
    </td>
    <td width="50%" style="padding:24px 40px 24px 20px;vertical-align:top">
      <h3 style="margin:0 0 8px;font-size:18px;color:#111827;${textStyle(props,'col2Title')}">${props.col2Title}</h3>
      <p style="margin:0;color:#374151;line-height:1.6;${textStyle(props,'col2Body')}">${props.col2Body}</p>
    </td>
  </tr>
</table>`;

    case 'content-quote':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:32px 40px;border-left:4px solid ${props.accentColor}">
    <p style="margin:0 0 12px;font-size:20px;color:#1e40af;${textStyle(props,'quote')}">${props.quote}</p>
    <p style="margin:0;color:#6b7280;font-size:14px;font-family:sans-serif">${props.attribution}</p>
  </td></tr>
</table>`;

    case 'content-numbered':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:32px 40px">
    <h2 style="margin:0 0 20px;font-size:22px;color:#111827;font-family:sans-serif">${props.title}</h2>
    ${(props.steps || []).map((s, i) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
      <tr>
        <td width="32" style="vertical-align:top">
          <span style="display:inline-block;width:28px;height:28px;background:#4F46E5;color:#fff;border-radius:50%;text-align:center;line-height:28px;font-size:14px;font-family:sans-serif">${i + 1}</span>
        </td>
        <td style="padding-left:12px;vertical-align:middle;color:#374151;font-family:sans-serif">${s}</td>
      </tr>
    </table>`).join('')}
  </td></tr>
</table>`;

    case 'cta-centered':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:48px 40px">
    <h2 style="margin:0 0 8px;font-size:26px;color:${props.textColor};font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 24px;color:${props.textColor};opacity:0.85;font-family:sans-serif">${props.subtitle}</p>
    ${props.buttonLabel ? `<a href="${props.buttonLink}" style="background:${props.buttonColor};color:${props.buttonTextColor};padding:14px 36px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.buttonLabel}</span></a>` : ''}
  </td></tr>
</table>`;

    case 'cta-banner':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td style="padding:16px 24px;color:${props.textColor};font-size:16px;font-family:sans-serif">${props.text}</td>
    <td align="right" style="padding:16px 24px;white-space:nowrap">
      <a href="${props.buttonLink}" style="background:${props.buttonColor};color:${props.buttonTextColor};padding:10px 24px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.buttonLabel}</span></a>
    </td>
  </tr>
</table>`;

    case 'cta-split':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td style="padding:32px 24px 32px 40px;vertical-align:middle">
      <h2 style="margin:0 0 6px;font-size:22px;color:${props.textColor};font-family:sans-serif">${props.title}</h2>
      <p style="margin:0;color:${props.textColor};opacity:0.75;font-family:sans-serif">${props.body}</p>
    </td>
    <td align="right" style="padding:32px 40px 32px 24px;vertical-align:middle;white-space:nowrap">
      <a href="${props.buttonLink}" style="background:${props.buttonColor};color:${props.buttonTextColor};padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.buttonLabel}</span></a>
    </td>
  </tr>
</table>`;

    case 'button-primary':
    case 'button-pill':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="${props.align || 'center'}" style="padding:24px 40px">
    <a href="${props.link}" style="background:${props.backgroundColor};color:${props.textColor};padding:12px 32px;border-radius:${props.borderRadius};border:${props.border || 'none'};text-decoration:none;font-size:15px;font-weight:600;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.label}</span></a>
  </td></tr>
</table>`;

    case 'button-outline':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="${props.align || 'center'}" style="padding:24px 40px">
    <a href="${props.link}" style="background:${props.backgroundColor};color:${props.textColor};padding:12px 32px;border-radius:${props.borderRadius};border:${props.border};text-decoration:none;font-size:15px;font-weight:600;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.label}</span></a>
  </td></tr>
</table>`;

    case 'button-group':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="${props.align || 'center'}" style="padding:24px 40px">
    ${(props.buttons || []).map(b => `<a href="${b.link}" style="background:${b.color};color:${b.textColor};padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;margin:0 6px;display:inline-block">${b.label}</a>`).join('')}
  </td></tr>
</table>`;

    case 'image-single':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props)}">
  <tr><td align="${props.align || 'center'}" style="padding:${getInternalPadding(props, '0')}">
    ${props.link ? `<a href="${props.link}">` : ''}<img src="${props.imageUrl}" alt="${props.alt || ''}" style="display:inline-block;${getImageWidthStyle(props.imageWidth, '100%')}"/>${props.link ? '</a>' : ''}
    ${props.caption ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption}</p>` : ''}
  </td></tr>
</table>`;

    case 'image-two-col':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props)}">
  <tr>
    <td width="50%" align="${props.align1 || 'center'}" style="padding:${getInternalPadding(props, '4px')}">${props.link1 ? `<a href="${props.link1}">` : ''}<img src="${props.image1Url}" alt="${props.alt1}" style="display:inline-block;${getImageWidthStyle(props.image1Width, '100%')}"/>${props.link1 ? '</a>' : ''}${props.caption1 ? `<p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption1}</p>` : ''}</td>
    <td width="50%" align="${props.align2 || 'center'}" style="padding:${getInternalPadding(props, '4px')}">${props.link2 ? `<a href="${props.link2}">` : ''}<img src="${props.image2Url}" alt="${props.alt2}" style="display:inline-block;${getImageWidthStyle(props.image2Width, '100%')}"/>${props.link2 ? '</a>' : ''}${props.caption2 ? `<p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption2}</p>` : ''}</td>
  </tr>
</table>`;

    case 'image-caption':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props)}">
  <tr><td align="${props.align || 'center'}" style="padding:${getInternalPadding(props, '0')}">
    <img src="${props.imageUrl}" alt="${props.alt}" style="display:block;${getImageWidthStyle(props.imageWidth, '100%')}"/>
    <p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption}</p>
  </td></tr>
</table>`;

    case 'card-product':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor};border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <tr><td align="center" style="padding:0">
    <img src="${props.imageUrl}" width="100%" style="display:block"/>
  </td></tr>
  <tr><td style="padding:20px">
    <h3 style="margin:0 0 4px;font-size:18px;color:#111827;font-family:sans-serif">${props.title}</h3>
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#4F46E5;font-family:sans-serif">${props.price}</p>
    <p style="margin:0 0 16px;color:#6b7280;font-family:sans-serif">${props.description}</p>
    <a href="${props.buttonLink}" style="background:#4F46E5;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.buttonLabel}</span></a>
  </td></tr>
</table>`;

    case 'card-feature':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    ${(props.cards || []).map(c => `
    <td width="${Math.floor(100 / props.cards.length)}%" style="padding:24px;text-align:center;vertical-align:top">
      <p style="font-size:32px;margin:0 0 8px">${c.icon}</p>
      <h3 style="margin:0 0 6px;font-size:16px;color:#111827;font-family:sans-serif">${c.title}</h3>
      <p style="margin:0;color:#6b7280;font-size:14px;font-family:sans-serif">${c.body}</p>
    </td>`).join('')}
  </tr>
</table>`;

    case 'card-profile':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:32px">
    <img src="${props.avatarUrl}" alt="${props.name}" style="width:80px;height:80px;border-radius:50%;display:block;margin:0 auto 12px"/>
    <h3 style="margin:0 0 4px;font-size:18px;color:#111827;font-family:sans-serif">${props.name}</h3>
    <p style="margin:0 0 8px;color:#4F46E5;font-size:14px;font-family:sans-serif">${props.role}</p>
    <p style="margin:0;color:#6b7280;font-family:sans-serif">${props.bio}</p>
  </td></tr>
</table>`;

    case 'carousel-basic':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  ${(props.slides || []).map((s, i) => `
  <tr style="${i > 0 ? 'display:none' : ''}"><td style="position:relative">
    <img src="${s.imageUrl}" width="100%" style="display:block"/>
    ${s.caption ? `<p style="margin:4px 0 0;text-align:center;color:#6b7280;font-size:14px;font-family:sans-serif">${s.caption}</p>` : ''}
  </td></tr>`).join('')}
  <tr><td align="center" style="padding:12px">
    ${(props.slides || []).map((_, i) => `<a href="#" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${i === 0 ? '#4F46E5' : '#d1d5db'};margin:0 3px"></a>`).join('')}
  </td></tr>
</table>`;

    case 'carousel-product':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    ${(props.slides || []).map(s => `
    <td width="${Math.floor(100 / props.slides.length)}%" style="padding:12px;text-align:center;vertical-align:top">
      <img src="${s.imageUrl}" width="100%" style="display:block;border-radius:6px"/>
      <p style="margin:8px 0 2px;font-weight:600;color:#111827;font-family:sans-serif">${s.title}</p>
      <p style="margin:0;color:#4F46E5;font-weight:700;font-family:sans-serif">${s.price}</p>
    </td>`).join('')}
  </tr>
</table>`;

    case 'survey-rating':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:32px 40px">
    <p style="margin:0 0 16px;font-size:18px;color:#111827;font-family:sans-serif">${props.question}</p>
    <p style="font-size:32px;margin:0 0 20px">
      ${'⭐'.repeat(props.stars || 5)}
    </p>
    <a href="${props.buttonLink}" style="background:#4F46E5;color:#fff;padding:10px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'survey-nps':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:32px 40px">
    <p style="margin:0 0 20px;font-size:18px;color:#111827;font-family:sans-serif">${props.question}</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 8px">
      <tr>
        ${Array.from({length:11},(_,i) => `<td><a href="#" style="display:inline-block;width:36px;height:36px;text-align:center;line-height:36px;border:1px solid #d1d5db;border-radius:4px;text-decoration:none;color:#374151;font-family:sans-serif;margin:2px">${i}</a></td>`).join('')}
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="4"><tr><td style="font-size:12px;color:#6b7280;font-family:sans-serif">${props.lowLabel}</td><td align="right" style="font-size:12px;color:#6b7280;font-family:sans-serif">${props.highLabel}</td></tr></table>
    <a href="${props.buttonLink}" style="background:#4F46E5;color:#fff;padding:10px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;margin-top:16px">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'survey-choice':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:32px 40px">
    <p style="margin:0 0 16px;font-size:18px;color:#111827;font-family:sans-serif">${props.question}</p>
    ${(props.choices || []).map(c => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px">
      <tr><td style="border:1px solid #d1d5db;border-radius:6px;padding:12px 16px;background:#fff">
        <a href="#" style="color:#374151;text-decoration:none;font-family:sans-serif">○ ${c}</a>
      </td></tr>
    </table>`).join('')}
    <a href="${props.buttonLink}" style="background:#4F46E5;color:#fff;padding:10px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;margin-top:8px">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'survey-yesno':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:32px 40px">
    <p style="margin:0 0 24px;font-size:18px;color:#111827;font-family:sans-serif">${props.question}</p>
    <a href="${props.yesLink}" style="background:#16a34a;color:#fff;padding:12px 36px;border-radius:6px;text-decoration:none;font-family:sans-serif;margin-right:12px">Yes</a>
    <a href="${props.noLink}" style="background:#dc2626;color:#fff;padding:12px 36px;border-radius:6px;text-decoration:none;font-family:sans-serif">No</a>
  </td></tr>
</table>`;

    case 'footer-simple':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor};border-top:1px solid #e5e7eb">
  <tr><td align="center" style="padding:24px 40px">
    <p style="margin:0 0 4px;font-weight:600;color:${props.textColor};font-family:sans-serif">${props.companyName}</p>
    <p style="margin:0 0 8px;color:${props.textColor};font-size:13px;font-family:sans-serif">${props.address}</p>
    <a href="${props.unsubscribeLink}" style="color:${props.textColor};font-size:12px;font-family:sans-serif">Unsubscribe</a>
  </td></tr>
</table>`;

    case 'footer-social':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:32px 40px">
    <p style="margin:0 0 4px;font-weight:600;color:${props.textColor};font-family:sans-serif">${props.companyName}</p>
    <p style="margin:0 0 16px;color:${props.textColor};font-size:13px;font-family:sans-serif">${props.address}</p>
    <p style="margin:0 0 16px">
      ${(props.socialLinks || []).map(s => `<a href="${s.link}" style="text-decoration:none;font-size:20px;margin:0 6px">${s.icon}</a>`).join('')}
    </p>
    <a href="${props.unsubscribeLink}" style="color:${props.textColor};font-size:12px;font-family:sans-serif">Unsubscribe</a>
  </td></tr>
</table>`;

    case 'footer-full':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td style="padding:32px 40px;vertical-align:top">
      <p style="margin:0 0 4px;font-weight:600;font-size:18px;color:${props.textColor};font-family:sans-serif">${props.companyName}</p>
      <p style="margin:0;color:${props.textColor};font-size:13px;font-family:sans-serif">${props.address}</p>
    </td>
    ${(props.columns || []).map(col => `
    <td style="padding:32px 16px;vertical-align:top">
      <p style="margin:0 0 8px;font-weight:600;color:${props.textColor};font-family:sans-serif">${col.title}</p>
      ${(col.links || []).map(l => `<p style="margin:0 0 4px"><a href="#" style="color:${props.textColor};font-size:13px;font-family:sans-serif;text-decoration:none">${l}</a></p>`).join('')}
    </td>`).join('')}
  </tr>
  <tr><td colspan="${1 + (props.columns || []).length}" align="center" style="padding:12px 40px 24px;border-top:1px solid rgba(255,255,255,0.1)">
    <a href="${props.unsubscribeLink}" style="color:${props.textColor};font-size:12px;font-family:sans-serif;margin-right:16px">Unsubscribe</a>
    <a href="${props.privacyLink}" style="color:${props.textColor};font-size:12px;font-family:sans-serif">Privacy Policy</a>
  </td></tr>
</table>`;

    // ── NEW HEADERS ──────────────────────────────────────────────────────────
    case 'header-dark':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td style="padding:18px 24px"><img src="${props.logoUrl}" alt="Logo" style="max-height:44px"/></td>
    <td align="right" style="padding:18px 24px;color:${props.textColor};font-family:sans-serif;font-size:14px">${props.tagline}</td>
  </tr>
</table>`;

    case 'footer-logo-links':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:24px 40px">
    <img src="${props.logoUrl}" alt="Logo" style="max-height:42px;display:block;margin:0 auto 10px"/>
    <p style="margin:0;color:${props.textColor};font-size:12px;font-family:sans-serif">${props.address}</p>
  </td></tr>
</table>`;

    case 'raw-html':
      return `${props.html || ''}`;

    case 'header-logo-tagline':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="${props.align || 'center'}" style="padding:20px">
    <img src="${props.logoUrl}" alt="Logo" style="max-height:44px;display:block;margin:0 auto 6px"/>
    <p style="margin:0;color:${props.textColor};font-size:13px;font-family:sans-serif">${props.tagline}</p>
  </td></tr>
</table>`;

    case 'header-gradient':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:32px 24px;background:linear-gradient(135deg,${props.gradientFrom},${props.gradientTo})">
    <h1 style="margin:0 0 6px;font-size:26px;color:${props.textColor};font-family:sans-serif">${props.title}</h1>
    <p style="margin:0;color:${props.textColor};opacity:0.8;font-family:sans-serif">${props.subtitle}</p>
  </td></tr>
</table>`;

    case 'header-announcement':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:10px 24px">
    <p style="margin:0;color:${props.textColor};font-size:14px;font-family:sans-serif">${props.message} <a href="${props.link}" style="color:${props.textColor};font-weight:600">${props.linkLabel}</a></p>
  </td></tr>
</table>`;

    // ── NEW HEROES ───────────────────────────────────────────────────────────
    case 'hero-split-left':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="50%" style="padding:24px"><img src="${props.imageUrl}" alt="Hero" width="100%" style="display:block;border-radius:8px"/></td>
    <td width="50%" style="padding:24px;vertical-align:middle">
      <h2 style="margin:0 0 12px;font-size:22px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
      <p style="margin:0 0 20px;color:#374151;${textStyle(props,'body')}">${props.body}</p>
      ${props.ctaLabel ? `<a href="${props.ctaLink}" style="background:#4F46E5;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.ctaLabel}</span></a>` : ''}
    </td>
  </tr>
</table>`;

    case 'hero-video':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:0;position:relative">
    <a href="${props.videoLink}" style="display:block;position:relative">
      <img src="${props.thumbnailUrl}" width="100%" style="display:block"/>
      <p style="font-size:14px;color:#9ca3af;font-family:sans-serif;margin:8px 0 0">${props.title}</p>
    </a>
  </td></tr>
</table>`;

    case 'hero-centered-text':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:48px 40px">
    <h1 style="margin:0 0 12px;font-size:28px;color:${props.textColor};${textStyle(props,'title')}">${props.title}</h1>
    <p style="margin:0 0 24px;color:${props.textColor};opacity:0.8;${textStyle(props,'subtitle')}">${props.subtitle}</p>
    ${props.ctaLabel ? `<a href="${props.ctaLink}" style="background:#0ea5e9;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.ctaLabel}</span></a>` : ''}
  </td></tr>
</table>`;

    // ── NEW CONTENT ──────────────────────────────────────────────────────────
    case 'content-update':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:32px 40px">
    ${renderTags(props, 'left', '10px')}
    <h2 style="margin:0 0 10px;font-size:22px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
    <img src="${props.imageUrl}" width="100%" style="display:block;border-radius:6px;margin-bottom:16px"/>
    <p style="margin:0 0 16px;color:#374151;line-height:1.6;${textStyle(props,'body')}">${props.body}</p>
    ${renderOptionalLink(props.readMoreLink, props.readMoreLabel, `color:${props.tagColor};text-decoration:none;font-family:sans-serif;font-weight:600`)}
  </td></tr>
</table>`;

    case 'content-blog-two-col':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    ${(props.articles || []).map(a => `
    <td width="50%" style="padding:20px;vertical-align:top">
      <img src="${a.imageUrl}" width="100%" style="display:block;border-radius:6px;margin-bottom:10px"/>
      <span style="font-size:11px;color:#6366f1;font-family:sans-serif">${a.tag}</span>
      <h3 style="margin:4px 0 6px;font-size:16px;color:#111827;font-family:sans-serif">${a.title}</h3>
      <p style="margin:0 0 10px;color:#6b7280;font-size:13px;font-family:sans-serif">${a.date}</p>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;font-family:sans-serif">${a.body}</p>
      ${renderOptionalLink(a.link, 'Read more →', 'color:#6366f1;text-decoration:none;font-size:13px;font-family:sans-serif')}
    </td>`).join('')}
  </tr>
</table>`;

    case 'content-checklist':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="40%" style="padding:24px"><img src="${props.imageUrl}" width="100%" style="display:block;border-radius:8px"/></td>
    <td width="60%" style="padding:24px;vertical-align:middle">
      <h2 style="margin:0 0 16px;font-size:20px;color:#111827;font-family:sans-serif">${props.title}</h2>
      ${(props.items || []).map(item => `<p style="margin:0 0 8px;color:#374151;font-family:sans-serif">✓ ${item}</p>`).join('')}
    </td>
  </tr>
</table>`;

    case 'content-divider':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="padding:${props.marginTop || '16px'} 0 ${props.marginBottom || '16px'};border-bottom:${props.thickness || '1px'} solid ${props.color || '#e5e7eb'}"></td></tr>
</table>`;

    case 'content-spacer':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="height:${props.height || '40px'};font-size:0;line-height:0">&nbsp;</td></tr>
</table>`;

    case 'content-three-col':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    ${(props.cols || []).map(c => `
    <td width="${Math.floor(100 / (props.cols || []).length)}%" style="padding:24px;vertical-align:top">
      <h3 style="margin:0 0 8px;font-size:17px;color:#111827;font-family:sans-serif">${c.title}</h3>
      <p style="margin:0;color:#374151;line-height:1.6;font-family:sans-serif">${c.body}</p>
    </td>`).join('')}
  </tr>
</table>`;

    case 'content-intro':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:32px 40px" align="${props.align || 'left'}">
    ${renderTags(props, 'left', '12px')}
    <h2 style="margin:0 0 12px;font-size:24px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
    <p style="margin:0;color:#374151;line-height:1.6;${textStyle(props,'body')}">${props.body}</p>
  </td></tr>
</table>`;

    // ── NEW IMAGE LAYOUTS ────────────────────────────────────────────────────
    case 'image-three-col':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props)}">
  <tr>
    <td width="33%" align="${props.align1 || 'center'}" style="padding:${getInternalPadding(props, '4px')}">${props.link1 ? `<a href="${props.link1}">` : ''}<img src="${props.image1Url}" alt="${props.alt1}" style="display:inline-block;${getImageWidthStyle(props.image1Width, '100%')}"/>${props.link1 ? '</a>' : ''}${props.caption1 ? `<p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption1}</p>` : ''}</td>
    <td width="33%" align="${props.align2 || 'center'}" style="padding:${getInternalPadding(props, '4px')}">${props.link2 ? `<a href="${props.link2}">` : ''}<img src="${props.image2Url}" alt="${props.alt2}" style="display:inline-block;${getImageWidthStyle(props.image2Width, '100%')}"/>${props.link2 ? '</a>' : ''}${props.caption2 ? `<p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption2}</p>` : ''}</td>
    <td width="34%" align="${props.align3 || 'center'}" style="padding:${getInternalPadding(props, '4px')}">${props.link3 ? `<a href="${props.link3}">` : ''}<img src="${props.image3Url}" alt="${props.alt3}" style="display:inline-block;${getImageWidthStyle(props.image3Width, '100%')}"/>${props.link3 ? '</a>' : ''}${props.caption3 ? `<p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption3}</p>` : ''}</td>
  </tr>
</table>`;

    case 'image-grid-2x2':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props)}">
  <tr>
    ${(props.images || []).slice(0,2).map(img => `<td width="50%" align="center" style="padding:${getInternalPadding(props, '3px')}">${img.link ? `<a href="${img.link}">` : ''}<img src="${img.url}" alt="${img.alt || ''}" style="display:inline-block;${getImageWidthStyle(props.imageWidth, '100%')}"/>${img.link ? '</a>' : ''}${img.caption ? `<p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${img.caption}</p>` : ''}</td>`).join('')}
  </tr>
  <tr>
    ${(props.images || []).slice(2,4).map(img => `<td width="50%" align="center" style="padding:${getInternalPadding(props, '3px')}">${img.link ? `<a href="${img.link}">` : ''}<img src="${img.url}" alt="${img.alt || ''}" style="display:inline-block;${getImageWidthStyle(props.imageWidth, '100%')}"/>${img.link ? '</a>' : ''}${img.caption ? `<p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${img.caption}</p>` : ''}</td>`).join('')}
  </tr>
</table>`;

    case 'image-grid-3-horizontal':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props)}">
  <tr>
    ${(props.images || []).map(img => `<td width="${Math.floor(100 / (props.images || []).length)}%" align="center" style="padding:${getInternalPadding(props, '3px')}">${img.link ? `<a href="${img.link}">` : ''}<img src="${img.url}" alt="${img.alt || ''}" style="display:inline-block;${getImageWidthStyle(props.imageWidth, '100%')}"/>${img.link ? '</a>' : ''}${img.caption ? `<p style="margin:8px 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${img.caption}</p>` : ''}</td>`).join('')}
  </tr>
</table>`;

    case 'image-left-text':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props, props.backgroundColor || '#ffffff')}">
  <tr>
    <td width="${getSplitColumnWidths(props.imageColumnWidth, '42%', '58%').primary}" style="padding:${getInternalPadding(props, '20px')}"><img src="${props.imageUrl}" alt="${props.alt || ''}" style="display:block;${getImageWidthStyle(props.imageWidth, '100%')}"/>${props.caption ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption}</p>` : ''}</td>
    <td width="${getSplitColumnWidths(props.imageColumnWidth, '42%', '58%').secondary}" style="padding:${getInternalPadding(props, '20px 28px')};vertical-align:middle">
      ${renderTags(props, 'left', '10px')}
      <h2 style="margin:0 0 10px;font-size:20px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
      <p style="margin:0 0 14px;color:#374151;line-height:1.6;${textStyle(props,'body')}">${props.body}</p>
      ${renderOptionalLink(props.readMoreLink, 'Read more →', 'color:#6366f1;text-decoration:none;font-family:sans-serif;font-weight:600')}
    </td>
  </tr>
</table>`;

    case 'image-right-text':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props, props.backgroundColor || '#ffffff')}">
  <tr>
    <td width="${getSplitColumnWidths(props.imageColumnWidth, '58%', '42%').primary}" style="padding:${getInternalPadding(props, '20px 28px')};vertical-align:middle">
      ${renderTags(props, 'left', '10px')}
      <h2 style="margin:0 0 10px;font-size:20px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
      <p style="margin:0 0 14px;color:#374151;line-height:1.6;${textStyle(props,'body')}">${props.body}</p>
      ${renderOptionalLink(props.readMoreLink, 'Read more →', 'color:#6366f1;text-decoration:none;font-family:sans-serif;font-weight:600')}
    </td>
    <td width="${getSplitColumnWidths(props.imageColumnWidth, '58%', '42%').secondary}" style="padding:${getInternalPadding(props, '20px')}"><img src="${props.imageUrl}" alt="${props.alt || ''}" style="display:block;${getImageWidthStyle(props.imageWidth, '100%')}"/>${props.caption ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption}</p>` : ''}</td>
  </tr>
</table>`;

    case 'image-big-button':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props, props.backgroundColor || '#ffffff')}">
  <tr><td align="${props.align || 'center'}" style="padding:${getInternalPadding(props, '28px 40px')}">
    ${renderTags(props, 'center', '12px')}
    <img src="${props.imageUrl}" alt="${props.alt || ''}" style="display:inline-block;${getImageWidthStyle(props.imageWidth, '100%')}margin-bottom:16px"/>
    ${props.caption ? `<p style="margin:0 0 16px;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption}</p>` : ''}
    <h2 style="margin:0 0 10px;font-size:22px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
    <p style="margin:0 0 20px;color:#374151;line-height:1.6;${textStyle(props,'body')}">${props.body}</p>
    ${props.buttonLabel ? `<a href="${props.buttonLink}" style="background:#4F46E5;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;line-height:1.5"><span style="position:relative">${props.buttonLabel}</span></a>` : ''}
  </td></tr>
</table>`;

    case 'image-big-col':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props, props.backgroundColor || '#ffffff')}">
  <tr>
    <td width="${getSplitColumnWidths(props.mainColumnWidth, '48%', '52%').primary}" style="padding:${getInternalPadding(props, '20px')};vertical-align:top">
      ${renderTags({ ...props, tagsAlign: props.tagsAlign || 'left' }, 'left', '8px')}
      <img src="${props.mainImage}" alt="${props.alt || ''}" style="display:block;${getImageWidthStyle(props.imageWidth, '100%')}margin:8px 0"/>
      ${props.caption ? `<p style="margin:0 0 16px;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption}</p>` : ''}
      <h2 style="margin:0 0 8px;font-size:18px;color:#111827;font-family:sans-serif">${props.mainTitle}</h2>
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;font-family:sans-serif">${props.mainBody}</p>
    </td>
    <td width="${getSplitColumnWidths(props.mainColumnWidth, '48%', '52%').secondary}" style="padding:${getInternalPadding(props, '20px')};vertical-align:top">
      ${(props.sideArticles || []).map(a => `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
        <tr>
          <td width="44%" style="padding-right:10px"><img src="${a.imageUrl}" alt="${a.alt}" width="100%" style="display:block;border-radius:6px"/></td>
          <td style="vertical-align:top">
            <p style="margin:0 0 2px;font-size:11px;color:#6b7280;font-family:sans-serif">${a.date}</p>
            <h4 style="margin:0 0 4px;font-size:14px;color:#111827;font-family:sans-serif">${a.title}</h4>
            <p style="margin:0 0 6px;font-size:12px;color:#374151;font-family:sans-serif">${a.body}</p>
            ${renderOptionalLink(a.link, 'Read more →', 'color:#6366f1;font-size:12px;text-decoration:none;font-family:sans-serif')}
          </td>
        </tr>
      </table>`).join('')}
    </td>
  </tr>
</table>`;

    case 'image-video':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props, props.backgroundColor || '#ffffff')}">
  <tr><td style="padding:${getInternalPadding(props, '28px 40px')}">
    <a href="${props.videoLink}" style="display:block;position:relative;text-decoration:none">
      <img src="${props.thumbnailUrl}" alt="${props.alt || ''}" style="display:block;${getImageWidthStyle(props.imageWidth, '100%')}"/>
    </a>
    ${props.caption ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption}</p>` : ''}
    <h3 style="margin:12px 0 6px;font-size:18px;color:#111827;font-family:sans-serif">${props.title}</h3>
    <p style="margin:0;color:#374151;font-family:sans-serif">${props.body}</p>
  </td></tr>
</table>`;

    case 'image-panorama':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${getOptionalBackground(props)}">
  <tr><td align="center" style="padding:${getInternalPadding(props, '0')}">
    ${props.link ? `<a href="${props.link}">` : ''}<img src="${props.imageUrl}" alt="${props.alt || ''}" style="display:inline-block;width:100%"/>${props.link ? '</a>' : ''}
    ${props.caption ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280;font-style:italic;font-family:sans-serif">${props.caption}</p>` : ''}
  </td></tr>
</table>`;

    // ── NEW CTA BLOCKS ───────────────────────────────────────────────────────
    case 'cta-image-bg':
      return `<div style="background-color:#000000;width:100%;">
  <!--[if gte mso 9]><!-- -->
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
    <v:fill type="tile" src="${props.imageUrl}" color="#000000"/>
  </v:background>
  <![endif]-->
  <table width="100%" height="300" cellpadding="0" cellspacing="0" border="0">
    <tr><td background="${props.imageUrl}" style="background-image:url('${props.imageUrl}');background-size:cover;background-position:center;text-align:center;vertical-align:middle">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${props.overlayColor || 'rgba(0,0,0,0.45)'}">
        <tr><td align="center" style="padding:56px 40px">
          <h2 style="margin:0 0 10px;font-size:26px;color:${props.textColor};font-family:sans-serif;mso-color-alt:${props.textColor}">${props.title}</h2>
          <p style="margin:0 0 24px;color:${props.textColor};opacity:0.85;font-family:sans-serif;mso-color-alt:${props.textColor}">${props.subtitle}</p>
          <a href="${props.buttonLink}" style="background:#fff;color:#4F46E5;padding:13px 34px;border-radius:7px;text-decoration:none;font-weight:600;font-family:sans-serif">${props.buttonLabel}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;

    case 'cta-countdown':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:40px 40px">
    <h2 style="margin:0 0 8px;font-size:24px;color:${props.textColor};font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 12px;color:${props.textColor};opacity:0.8;font-family:sans-serif">${props.subtitle}</p>
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;color:${props.textColor};font-family:sans-serif">${props.timerLabel}</p>
    <a href="${props.buttonLink}" style="background:${props.buttonColor};color:${props.buttonTextColor};padding:13px 32px;border-radius:7px;text-decoration:none;font-weight:600;font-family:sans-serif">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'cta-referral':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:40px 40px">
    <h2 style="margin:0 0 10px;font-size:24px;color:${props.textColor};font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 24px;color:${props.textColor};opacity:0.8;font-family:sans-serif">${props.body}</p>
    <a href="${props.buttonLink}" style="background:${props.buttonColor};color:${props.buttonTextColor};padding:13px 32px;border-radius:7px;text-decoration:none;font-weight:600;font-family:sans-serif">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'cta-app-store':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:40px 40px">
    <h2 style="margin:0 0 10px;font-size:24px;color:${props.textColor};font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 24px;color:${props.textColor};opacity:0.75;font-family:sans-serif">${props.body}</p>
    <a href="${props.appStoreLink}" style="background:#1d1d1f;color:#fff;padding:11px 24px;border-radius:7px;text-decoration:none;font-family:sans-serif;margin-right:10px;display:inline-block">🍎 App Store</a>
    <a href="${props.playStoreLink}" style="background:#1d1d1f;color:#fff;padding:11px 24px;border-radius:7px;text-decoration:none;font-family:sans-serif;display:inline-block">▶ Google Play</a>
  </td></tr>
</table>`;

    case 'cta-newsletter':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:40px 40px">
    <h2 style="margin:0 0 8px;font-size:22px;color:${props.textColor};font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 20px;color:${props.textColor};opacity:0.8;font-family:sans-serif">${props.body}</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto">
      <tr>
        <td style="padding-right:8px"><span style="display:inline-block;background:#fff;border:1px solid #d1d5db;border-radius:4px;padding:10px 16px;font-family:sans-serif;color:#9ca3af;min-width:200px">${props.inputPlaceholder}</span></td>
        <td><a href="${props.buttonLink}" style="background:#6366f1;color:#fff;padding:11px 22px;border-radius:4px;text-decoration:none;font-family:sans-serif">${props.buttonLabel}</a></td>
      </tr>
    </table>
  </td></tr>
</table>`;

    case 'cta-event':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:40px 40px">
    ${renderTags({ ...props, tagColor: props.tagColor || 'rgba(255,255,255,0.15)' }, 'center', '14px')}
    <h2 style="margin:0 0 10px;font-size:24px;color:${props.textColor};font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 4px;color:${props.textColor};opacity:0.8;font-family:sans-serif">📅 ${props.date}</p>
    <p style="margin:0 0 24px;color:${props.textColor};opacity:0.8;font-family:sans-serif">📍 ${props.location}</p>
    <a href="${props.buttonLink}" style="background:${props.buttonColor};color:${props.buttonTextColor};padding:13px 34px;border-radius:7px;text-decoration:none;font-weight:600;font-family:sans-serif">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    // ── ECOMMERCE ────────────────────────────────────────────────────────────
    case 'ecom-product-single':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="45%" style="padding:24px"><img src="${props.imageUrl}" width="100%" style="display:block;border-radius:8px"/></td>
    <td width="55%" style="padding:24px;vertical-align:middle">
      <h2 style="margin:0 0 8px;font-size:22px;color:#111827;font-family:sans-serif">${props.title}</h2>
      <p style="margin:0 0 4px;font-family:sans-serif"><span style="font-size:22px;font-weight:700;color:#4F46E5">${props.price}</span> <span style="font-size:14px;color:#9ca3af;text-decoration:line-through">${props.originalPrice}</span></p>
      <p style="margin:0 0 20px;color:#6b7280;font-family:sans-serif">${props.description}</p>
      <a href="${props.buttonLink}" style="background:#4F46E5;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600">${props.buttonLabel}</a>
    </td>
  </tr>
</table>`;

    case 'ecom-product-two':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    ${(props.products || []).map(p => `
    <td width="50%" style="padding:20px;vertical-align:top;text-align:center">
      <img src="${p.imageUrl}" width="100%" style="display:block;border-radius:8px;margin-bottom:10px"/>
      <h3 style="margin:0 0 6px;font-size:16px;color:#111827;font-family:sans-serif">${p.title}</h3>
      <p style="margin:0 0 14px;font-size:18px;font-weight:700;color:#4F46E5;font-family:sans-serif">${p.price}</p>
      <a href="${p.link}" style="background:#4F46E5;color:#fff;padding:9px 22px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-size:13px">Shop Now</a>
    </td>`).join('')}
  </tr>
</table>`;

    case 'ecom-product-three':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    ${(props.products || []).map(p => `
    <td width="33%" style="padding:16px;vertical-align:top;text-align:center">
      <img src="${p.imageUrl}" width="100%" style="display:block;border-radius:6px;margin-bottom:8px"/>
      <h3 style="margin:0 0 4px;font-size:14px;color:#111827;font-family:sans-serif">${p.title}</h3>
      <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:#4F46E5;font-family:sans-serif">${p.price}</p>
      <a href="${p.link}" style="background:#4F46E5;color:#fff;padding:7px 18px;border-radius:5px;text-decoration:none;font-size:12px;font-family:sans-serif">Buy</a>
    </td>`).join('')}
  </tr>
</table>`;

    case 'ecom-flash-sale':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:40px 40px">
    <span style="display:inline-block;background:rgba(255,255,255,0.2);color:${props.textColor};font-size:14px;font-weight:700;padding:6px 18px;border-radius:999px;font-family:sans-serif;margin-bottom:14px">${props.badge}</span>
    <h2 style="margin:0 0 10px;font-size:30px;font-weight:900;color:${props.textColor};font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 8px;color:${props.textColor};opacity:0.85;font-family:sans-serif">${props.subtitle}</p>
    <img src="${props.imageUrl}" width="80%" style="display:block;border-radius:8px;margin:16px auto"/>
    <a href="${props.buttonLink}" style="background:#fff;color:${props.backgroundColor};padding:13px 34px;border-radius:7px;text-decoration:none;font-weight:700;font-family:sans-serif">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'ecom-featured':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    ${props.align === 'right' ? `
    <td width="50%" style="padding:28px;vertical-align:middle">
      ${renderTags(props, 'left', '12px')}
      <h2 style="margin:0 0 10px;font-size:22px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
      <p style="margin:0 0 20px;color:#374151;line-height:1.6;${textStyle(props,'body')}">${props.body}</p>
      <a href="${props.buttonLink}" style="background:#4F46E5;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600">${props.buttonLabel}</a>
    </td>
    <td width="50%" style="padding:20px"><img src="${props.imageUrl}" width="100%" style="display:block;border-radius:8px"/></td>
    ` : `
    <td width="50%" style="padding:20px"><img src="${props.imageUrl}" width="100%" style="display:block;border-radius:8px"/></td>
    <td width="50%" style="padding:28px;vertical-align:middle">
      ${renderTags(props, 'left', '12px')}
      <h2 style="margin:0 0 10px;font-size:22px;color:#111827;${textStyle(props,'title')}">${props.title}</h2>
      <p style="margin:0 0 20px;color:#374151;line-height:1.6;${textStyle(props,'body')}">${props.body}</p>
      <a href="${props.buttonLink}" style="background:#4F46E5;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600">${props.buttonLabel}</a>
    </td>
    `}
  </tr>
</table>`;

    case 'ecom-order-confirm':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:32px 40px">
    <h2 style="margin:0 0 6px;font-size:22px;color:#166534;font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-family:sans-serif">Order ${props.orderNumber}</p>
    ${(props.items || []).map(item => `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #e5e7eb;margin-bottom:8px">
      <tr>
        <td style="padding:8px 0;color:#374151;font-family:sans-serif">${item.name} × ${item.qty}</td>
        <td align="right" style="padding:8px 0;color:#111827;font-weight:600;font-family:sans-serif">${item.price}</td>
      </tr>
    </table>`).join('')}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">
      <tr>
        <td style="color:#111827;font-weight:700;font-family:sans-serif">Total</td>
        <td align="right" style="color:#166534;font-size:20px;font-weight:700;font-family:sans-serif">${props.total}</td>
      </tr>
    </table>
    <a href="${props.buttonLink}" style="display:inline-block;margin-top:20px;background:#16a34a;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'ecom-abandoned-cart':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="38%" style="padding:20px"><img src="${props.imageUrl}" width="100%" style="display:block;border-radius:8px"/></td>
    <td width="62%" style="padding:20px;vertical-align:middle">
      <h2 style="margin:0 0 10px;font-size:20px;color:#92400e;font-family:sans-serif">${props.title}</h2>
      <p style="margin:0 0 6px;font-weight:700;color:#111827;font-family:sans-serif">${props.itemName}</p>
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#4F46E5;font-family:sans-serif">${props.itemPrice}</p>
      <p style="margin:0 0 20px;color:#374151;font-family:sans-serif">${props.body}</p>
      <a href="${props.buttonLink}" style="background:#d97706;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600">${props.buttonLabel}</a>
    </td>
  </tr>
</table>`;

    case 'ecom-promo-code':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:40px 40px">
    <h2 style="margin:0 0 8px;font-size:22px;color:#4338ca;font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 20px;color:#6366f1;opacity:0.8;font-family:sans-serif">${props.body}</p>
    <p style="margin:0 0 8px;display:inline-block;background:#fff;border:2px dashed ${props.accentColor};border-radius:8px;padding:10px 28px;font-size:22px;font-weight:800;letter-spacing:4px;color:${props.accentColor};font-family:monospace">${props.code}</p>
    <p style="margin:8px 0 20px;color:#6b7280;font-size:12px;font-family:sans-serif">${props.expiry}</p>
    <a href="${props.buttonLink}" style="background:${props.accentColor};color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'ecom-new-arrivals':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:28px 32px">
    <h2 style="margin:0 0 20px;font-size:20px;color:#111827;font-family:sans-serif">${props.title}</h2>
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      ${(props.products || []).map(p => `
      <td width="33%" style="padding:8px;vertical-align:top;text-align:center">
        <img src="${p.imageUrl}" width="100%" style="display:block;border-radius:6px;margin-bottom:8px"/>
        <span style="display:inline-block;background:#16a34a;color:#fff;font-size:10px;padding:2px 8px;border-radius:999px;font-family:sans-serif;margin-bottom:4px">${p.tag}</span>
        <h4 style="margin:0 0 3px;font-size:14px;color:#111827;font-family:sans-serif">${p.title}</h4>
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#4F46E5;font-family:sans-serif">${p.price}</p>
        <a href="${p.link}" style="background:#4F46E5;color:#fff;padding:7px 16px;border-radius:5px;text-decoration:none;font-size:12px;font-family:sans-serif">Add to cart</a>
      </td>`).join('')}
    </tr></table>
  </td></tr>
</table>`;

    case 'ecom-review':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="38%" style="padding:20px"><img src="${props.imageUrl}" width="100%" style="display:block;border-radius:8px"/></td>
    <td width="62%" style="padding:20px;vertical-align:middle">
      <h3 style="margin:0 0 8px;font-size:16px;color:#92400e;font-family:sans-serif">${props.productName}</h3>
      <p style="margin:0 0 8px;font-size:20px">⭐⭐⭐⭐⭐</p>
      <p style="margin:0 0 16px;font-size:16px;font-style:italic;color:#374151;font-family:sans-serif">${props.reviewText}</p>
      <p style="margin:0 0 20px;color:#6b7280;font-size:13px;font-family:sans-serif">— ${props.reviewer}</p>
      <a href="${props.buttonLink}" style="background:#d97706;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-size:13px">${props.buttonLabel}</a>
    </td>
  </tr>
</table>`;

    case 'ecom-wishlist':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="38%" style="padding:20px"><img src="${props.imageUrl}" width="100%" style="display:block;border-radius:8px"/></td>
    <td width="62%" style="padding:20px;vertical-align:middle">
      <h2 style="margin:0 0 10px;font-size:20px;color:#9d174d;font-family:sans-serif">${props.title}</h2>
      <p style="margin:0 0 20px;color:#374151;font-family:sans-serif">${props.body}</p>
      <a href="${props.buttonLink}" style="background:#db2777;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600">${props.buttonLabel}</a>
    </td>
  </tr>
</table>`;

    case 'ecom-referral':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:40px 40px">
    <h2 style="margin:0 0 8px;font-size:22px;color:#92400e;font-family:sans-serif">${props.title}</h2>
    <p style="margin:0 0 6px;color:#374151;font-family:sans-serif">${props.body}</p>
    <p style="margin:0 0 20px;font-size:28px;font-weight:900;color:${props.accentColor};font-family:monospace">${props.points} <span style="font-size:16px">${props.equivalent}</span></p>
    <a href="${props.buttonLink}" style="background:${props.accentColor};color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    case 'ecom-bundle':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:32px 40px">
    <h2 style="margin:0 0 20px;font-size:22px;color:#0c4a6e;font-family:sans-serif">${props.title}</h2>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 20px"><tr>
      ${(props.products || []).map((p, i) => `
      <td style="padding:0 8px;text-align:center">
        <img src="${p.imageUrl}" width="140" style="display:block;border-radius:8px;margin-bottom:6px"/>
        <p style="margin:0;font-size:13px;color:#374151;font-family:sans-serif">${p.title}</p>
      </td>
      ${i < (props.products || []).length - 1 ? '<td style="font-size:24px;padding:0 4px;color:#0ea5e9">+</td>' : ''}`).join('')}
    </tr></table>
    <p style="margin:0 0 20px;font-family:sans-serif"><span style="font-size:26px;font-weight:900;color:#0ea5e9">${props.bundlePrice}</span> <span style="font-size:14px;color:#94a3b8;text-decoration:line-through">${props.originalPrice}</span></p>
    <a href="${props.buttonLink}" style="background:#0ea5e9;color:#fff;padding:13px 34px;border-radius:7px;text-decoration:none;font-weight:700;font-family:sans-serif">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    // ── NEW CARDS ────────────────────────────────────────────────────────────
    case 'card-blog':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor};border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;max-width:360px;margin:0 auto">
  <tr><td><img src="${props.imageUrl}" width="100%" style="display:block"/></td></tr>
  <tr><td style="padding:18px">
    <span style="font-size:11px;color:#6366f1;font-family:sans-serif">${props.category}</span>
    <h3 style="margin:6px 0 4px;font-size:18px;color:#111827;font-family:sans-serif">${props.title}</h3>
    <p style="margin:0 0 10px;color:#9ca3af;font-size:13px;font-family:sans-serif">${props.date}</p>
    ${renderOptionalLink(props.readMoreLink, 'Read more →', 'color:#4F46E5;text-decoration:none;font-family:sans-serif;font-weight:600')}
  </td></tr>
</table>`;

    case 'card-testimonial':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor};border-radius:8px;padding:24px">
  <tr><td style="padding:24px">
    <p style="margin:0 0 6px;font-size:18px">{'⭐'.repeat(props.stars || 5)}</p>
    <p style="margin:0 0 16px;font-size:16px;font-style:italic;color:#4338ca;font-family:sans-serif">${props.quote}</p>
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:10px"><img src="${props.avatarUrl}" width="40" height="40" style="border-radius:50%;display:block"/></td>
      <td>
        <p style="margin:0;font-weight:600;color:#111827;font-family:sans-serif">${props.name}</p>
        <p style="margin:0;font-size:12px;color:#6b7280;font-family:sans-serif">${props.role}</p>
      </td>
    </tr></table>
  </td></tr>
</table>`;

    case 'card-event':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor};border-radius:8px;overflow:hidden">
  <tr>
    <td width="60" style="background:${props.accentColor};text-align:center;vertical-align:middle;padding:16px">
      <p style="margin:0;font-size:22px;font-weight:900;color:#fff;font-family:sans-serif">${props.date}</p>
    </td>
    <td style="padding:16px 20px;vertical-align:middle">
      <h3 style="margin:0 0 4px;font-size:16px;color:#1e40af;font-family:sans-serif">${props.title}</h3>
      <p style="margin:0 0 10px;color:#6b7280;font-size:13px;font-family:sans-serif">📍 ${props.location}</p>
      <a href="${props.buttonLink}" style="background:${props.accentColor};color:#fff;padding:7px 18px;border-radius:5px;text-decoration:none;font-size:13px;font-family:sans-serif">${props.buttonLabel}</a>
    </td>
  </tr>
</table>`;

    case 'card-stat':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    ${(props.stats || []).map(s => `
    <td width="${Math.floor(100 / (props.stats || []).length)}%" style="padding:28px;text-align:center;vertical-align:top">
      <p style="margin:0 0 4px;font-size:32px;font-weight:900;color:${props.textColor};font-family:sans-serif">${s.value}</p>
      <p style="margin:0;color:${props.textColor};opacity:0.7;font-size:13px;font-family:sans-serif">${s.label}</p>
    </td>`).join('')}
  </tr>
</table>`;

    case 'card-checklist-item':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr>
    <td width="38%" style="padding:20px"><img src="${props.imageUrl}" width="100%" style="display:block;border-radius:8px"/></td>
    <td width="62%" style="padding:20px;vertical-align:middle">
      <h2 style="margin:0 0 14px;font-size:18px;color:#111827;font-family:sans-serif">${props.title}</h2>
      ${(props.items || []).map(item => `<p style="margin:0 0 6px;color:#374151;font-family:sans-serif">✓ ${item}</p>`).join('')}
      <a href="${props.buttonLink}" style="display:inline-block;margin-top:14px;background:#4F46E5;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-family:sans-serif">${props.buttonLabel}</a>
    </td>
  </tr>
</table>`;

    // ── EXTRA BUTTONS ────────────────────────────────────────────────────────
    case 'button-icon-left':
    case 'button-full-width':
      return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="${props.align || 'center'}" style="padding:24px 40px">
    <a href="${props.link}" style="background:${props.backgroundColor};color:${props.textColor};padding:12px ${props.fullWidth ? '100%' : '32px'};border-radius:${props.borderRadius};border:${props.border || 'none'};text-decoration:none;font-size:15px;font-weight:600;font-family:sans-serif;display:${props.fullWidth ? 'block' : 'inline-block'};text-align:center">${props.label}</a>
  </td></tr>
</table>`;

    // ── EXTRA SURVEYS ────────────────────────────────────────────────────────
    case 'survey-csat':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:32px 40px">
    <p style="margin:0 0 20px;font-size:18px;color:#0c4a6e;font-family:sans-serif">${props.question}</p>
    ${(props.emojis || []).map((emoji, i) => `<a href="${(props.links || [])[i] || '#'}" style="text-decoration:none;font-size:28px;margin:0 8px">${emoji}</a>`).join('')}
  </td></tr>
</table>`;

    case 'survey-poll':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td style="padding:32px 40px">
    <p style="margin:0 0 16px;font-size:18px;color:#374151;font-family:sans-serif">${props.question}</p>
    ${(props.choices || []).map(c => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px">
      <tr><td style="border:1px solid #e5e7eb;border-radius:6px;padding:12px 16px;background:#fff">
        <a href="#" style="color:#374151;text-decoration:none;font-family:sans-serif">○ ${c}</a>
      </td></tr>
    </table>`).join('')}
    <a href="${props.buttonLink}" style="background:#334155;color:#fff;padding:10px 28px;border-radius:6px;text-decoration:none;font-family:sans-serif;display:inline-block;margin-top:8px">${props.buttonLabel}</a>
  </td></tr>
</table>`;

    // ── EXTRA CAROUSEL ───────────────────────────────────────────────────────
    case 'carousel-testimonial':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  ${(props.slides || []).map((s, i) => `
  <tr style="${i > 0 ? 'display:none' : ''}"><td align="center" style="padding:36px 48px">
    <p style="margin:0 0 4px;font-size:4px;color:#6366f1">▬▬</p>
    <p style="margin:0 0 14px;font-size:17px;font-style:italic;color:#4338ca;font-family:sans-serif">${s.quote}</p>
    <p style="margin:0;font-weight:600;color:#111827;font-family:sans-serif">${s.name}</p>
    <p style="margin:0;font-size:12px;color:#6b7280;font-family:sans-serif">${s.role}</p>
  </td></tr>`).join('')}
  <tr><td align="center" style="padding:8px 0 20px">
    ${(props.slides || []).map((_, i) => `<a href="#" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${i===0 ? '#6366f1' : '#c4b5fd'};margin:0 3px"></a>`).join('')}
  </td></tr>
</table>`;

    // ── EXTRA FOOTERS ────────────────────────────────────────────────────────
    case 'footer-minimal-dark':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor}">
  <tr><td align="center" style="padding:20px 40px">
    <p style="margin:0 0 6px;color:${props.textColor};font-size:13px;font-family:sans-serif">© ${props.year} ${props.companyName}. All rights reserved.</p>
    <a href="${props.unsubscribeLink}" style="color:${props.textColor};font-size:12px;font-family:sans-serif;margin-right:12px">Unsubscribe</a>
    <a href="${props.privacyLink}" style="color:${props.textColor};font-size:12px;font-family:sans-serif">Privacy</a>
  </td></tr>
</table>`;

    case 'footer-logo-links':
      return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${props.backgroundColor};border-top:1px solid #e5e7eb">
  <tr><td align="center" style="padding:24px 40px">
    <img src="${props.logoUrl}" alt="Logo" style="max-height:36px;display:block;margin:0 auto 12px"/>
    <p style="margin:0 0 12px">
      ${(props.links || []).map(l => `<a href="${l.href}" style="color:${props.textColor};font-size:13px;font-family:sans-serif;margin:0 8px;text-decoration:none">${l.label}</a>`).join('')}
    </p>
    <p style="margin:0;color:${props.textColor};font-size:12px;font-family:sans-serif">${props.address}</p>
  </td></tr>
</table>`;

    default:
      return `<table width="100%"><tr><td style="padding:20px;font-family:sans-serif;color:#6b7280;text-align:center">[Unknown element: ${type}]</td></tr></table>`;
  }
}

export function buildEmailHtml(elements, emailMeta) {
  const body = elements
    .map(el => renderElementHtmlWithPostProcessing(el))
    .join('\n');
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<meta name="supported-color-schemes" content="light"/>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<title>${emailMeta.subject || 'Email'}</title>
<style>
:root { color-scheme: light only; supported-color-schemes: light only; }
@media (prefers-color-scheme: dark) {
  .body-wrapper { background: #f1f5f9 !important; }
  .email-card   { background: #ffffff !important; }
}
</style>
</head>
<body style="margin:0;padding:20px 0;background:#f1f5f9" class="body-wrapper">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9" role="presentation">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)" class="email-card" role="presentation">
<tr><td>
${body}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function renderElementHtmlWithPostProcessing(element) {
  const props = element?.props || {};
  const spacingProps = usesInternalPaddingOverride(element?.type)
    ? { ...props, elementPadding: '' }
    : props;
  return withElementSpacing(cleanupEmptyMarkup(renderElementHtml(element)), spacingProps);
}
