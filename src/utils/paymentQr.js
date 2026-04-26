const UPI_SCHEME_PREFIX = 'upi://pay?';

export const isUpiDeepLink = (value) => String(value || '').trim().toLowerCase().startsWith(UPI_SCHEME_PREFIX);

const getUpiLinkFromSettings = (settings) => {
  const qrField = String(settings?.qrCodeUrl || '').trim();
  if (isUpiDeepLink(qrField)) return qrField;

  const upiId = String(settings?.upiId || '').trim();
  if (!upiId) return '';

  const payeeName = encodeURIComponent(String(settings?.accountHolderName || settings?.companyName || '').trim());
  return `upi://pay?pa=${encodeURIComponent(upiId)}${payeeName ? `&pn=${payeeName}` : ''}`;
};

const getRemoteQrUrl = (value) => {
  const encodedValue = encodeURIComponent(String(value || '').trim());
  if (!encodedValue) return '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=560x560&data=${encodedValue}`;
};

export const resolvePaymentQr = (settings) => {
  const qrField = String(settings?.qrCodeUrl || '').trim();

  if (qrField && !isUpiDeepLink(qrField)) {
    return {
      imageUrl: qrField,
      upiLink: getUpiLinkFromSettings(settings),
      source: 'image',
    };
  }

  const upiLink = getUpiLinkFromSettings(settings);
  if (!upiLink) {
    return {
      imageUrl: '',
      upiLink: '',
      source: 'none',
    };
  }

  return {
    imageUrl: getRemoteQrUrl(upiLink),
    upiLink,
    source: 'upi',
  };
};
