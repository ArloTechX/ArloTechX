export const sanitizePhoneNumber = (phone) => {
  const raw = String(phone || '').trim();
  if (!raw) return '';
  return raw.replace(/[^\d]/g, '');
};

export const buildWhatsAppUrl = (phone, message) => {
  const sanitizedPhone = sanitizePhoneNumber(phone);
  const normalizedMessage = String(message || '').trim();

  if (!sanitizedPhone) {
    return { ok: false, reason: 'Valid phone number is required to open WhatsApp.' };
  }

  if (!normalizedMessage) {
    return { ok: false, reason: 'Message content is missing. Cannot open WhatsApp.' };
  }

  const url = `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(normalizedMessage)}`;
  return { ok: true, url, sanitizedPhone, normalizedMessage };
};

const formatSubmittedDate = (iso) => {
  if (!iso) return '-';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const buildRequestSummary = (request) => {
  const safeName = request?.name || 'Client';
  const safeCompany = request?.company || 'No company provided';
  const safeProjectType = request?.projectType || '-';
  const safeSubmittedDate = formatSubmittedDate(request?.createdAt);

  return {
    safeName,
    safeCompany,
    safeProjectType,
    safeSubmittedDate,
  };
};

const buildContactDetailsSection = (settings = {}) => {
  const email = String(settings?.email || '').trim();
  const phone = String(settings?.phone || '').trim();
  if (!email && !phone) return '';

  const details = ['Contact Details:'];
  if (email) details.push(`Email: ${email}`);
  if (phone) details.push(`Phone: ${phone}`);
  return `\n\n${details.join('\n')}`;
};

export const buildCancelMessage = (request, settings = {}) => {
  const { safeName, safeCompany, safeProjectType, safeSubmittedDate } = buildRequestSummary(request);
  const companyName = String(settings?.companyName || '').trim() || 'ArloTechX';
  const contactDetails = buildContactDetailsSection(settings);

  return `Hello ${safeName},

Thank you for contacting ${companyName} regarding your ${safeProjectType} request.

After reviewing your request, we are unable to proceed with this inquiry at this time.

Request Details:
- Name: ${safeName}
- Company: ${safeCompany}
- Project Type: ${safeProjectType}
- Submitted On: ${safeSubmittedDate}

Status: Cancelled

For any clarification, you may contact ${companyName} again in the future.

Regards,
${companyName}
Global Innovation & Software Solutions${contactDetails}`;
};

export const buildAcceptedMessage = (request, settings = {}) => {
  const { safeName, safeCompany, safeProjectType, safeSubmittedDate } = buildRequestSummary(request);
  const companyName = String(settings?.companyName || '').trim() || 'ArloTechX';
  const contactDetails = buildContactDetailsSection(settings);

  return `Hello ${safeName},

Thank you for contacting ${companyName}.

We are happy to inform you that your request has been accepted and moved to our active client process.

Request Details:
- Name: ${safeName}
- Company: ${safeCompany}
- Project Type: ${safeProjectType}
- Submitted On: ${safeSubmittedDate}

Status: Accepted

Our team will connect with you for the next steps regarding project discussion, quotation, agreement, and delivery process.

Regards,
${companyName}
Global Innovation & Software Solutions${contactDetails}`;
};

export const buildDocumentShareMessage = (type, clientName, documentNumber, companyName = 'ArloTechX') => {
  const safeName = clientName || 'Client';
  const safeNumber = documentNumber || '-';
  const safeCompany = companyName || 'ArloTechX';
  const normalizedType = String(type || '').toLowerCase();

  if (normalizedType === 'quotation') {
    return `Hello ${safeName}, your quotation (${safeNumber}) from ${safeCompany} is ready. Please review it. I will share the PDF with you here.`;
  }

  if (normalizedType === 'agreement') {
    return `Hello ${safeName}, your client service agreement (${safeNumber}) from ${safeCompany} is ready. Please review it. I will share the PDF with you here.`;
  }

  if (normalizedType === 'invoice') {
    return `Hello ${safeName}, your invoice (${safeNumber}) from ${safeCompany} is ready. Please review it. I will share the PDF with you here.`;
  }

  return `Hello ${safeName}, your document (${safeNumber}) from ${safeCompany} is ready. Please review it. I will share the PDF with you here.`;
};

export const openWhatsAppChat = (phone, message) => {
  const prepared = buildWhatsAppUrl(phone, message);
  if (!prepared.ok) {
    return { ok: false, reason: prepared.reason };
  }

  const { url } = prepared;

  const popup = window.open(url, '_blank');

  if (!popup) {
    window.location.href = url;
    return { ok: true, fallback: 'same-tab' };
  }

  try {
    popup.opener = null;
  } catch {
    // noop
  }

  return { ok: true, fallback: 'new-tab' };
};
