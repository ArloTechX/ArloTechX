const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const toCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return 'INR 0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const isSame = (left, right) => String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase();

const findRelatedProject = (client, projects = []) => {
  if (!client) return null;

  const byName = projects.find((item) => isSame(item.clientName, client.name));
  if (byName) return byName;

  const byCompany = projects.find((item) => isSame(item.company, client.company));
  if (byCompany) return byCompany;

  const byType = projects.find((item) => isSame(item.category, client.projectType));
  return byType || null;
};

const getServiceItems = (client, project) => {
  if (Array.isArray(client?.pricingItems) && client.pricingItems.length) {
    return client.pricingItems
      .map((item, index) => ({
        id: item.id || `line-${index + 1}`,
        description: item.description || item.title || `Service ${index + 1}`,
        quantity: Number(item.quantity) || 1,
        amount: Number(item.amount) || 0,
      }))
      .filter((item) => item.description);
  }

  const fallbackAmount = Number(client?.totalAmount) || 0;
  const derivedTitle = client?.projectType || project?.title || client?.projectName || 'Project Service';
  return [
    {
      id: 'line-1',
      description: derivedTitle,
      quantity: 1,
      amount: fallbackAmount,
    },
  ];
};

const getTotals = (items, client) => {
  const computedTotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.amount) || 0), 0);
  const totalAmount = Number(client?.totalAmount) || computedTotal;
  const advancePaid = Number(client?.advancePaid) || 0;
  const balanceDue = Number(client?.balanceDue) || Math.max(totalAmount - advancePaid, 0);
  return { totalAmount, advancePaid, balanceDue };
};

export const mapDocumentData = ({ type, client, settings, projects, documentNumber }) => {
  const relatedProject = findRelatedProject(client, projects);
  const serviceItems = getServiceItems(client, relatedProject);
  const totals = getTotals(serviceItems, client);
  const companyAddress = settings.companyAddress || settings.address || '-';

  return {
    type,
    documentNumber,
    generatedDate: formatDate(new Date().toISOString()),
    agreementDate: formatDate(new Date().toISOString()),
    client: {
      name: client.name || '-',
      company: client.company || '-',
      email: client.email || '-',
      phone: client.phone || '-',
      status: client.status || '-',
      projectType: client.projectType || '-',
      projectName: client.projectName || relatedProject?.title || client.projectType || '-',
      projectDescription: client.projectDescription || client.notes || relatedProject?.description || '-',
      timeline: client.timeline || '-',
      createdAt: formatDate(client.createdAt),
      convertedAt: formatDate(client.convertedAt),
    },
    company: {
      name: settings.companyName || '-',
      tagline: settings.tagline || '-',
      email: settings.email || '-',
      supportEmail: settings.supportEmail || '-',
      phone: settings.phone || '-',
      website: settings.website || '-',
      whatsapp: settings.whatsapp || '-',
      address: companyAddress,
      footerText: settings.footerText || '',
      upiId: settings.upiId || '-',
      bankName: settings.bankName || '-',
      accountNumber: settings.accountNumber || '-',
    },
    terms: settings.defaultTerms || '-',
    quotationTerms: settings.quotationTerms || '',
    supportDays: settings.supportDays || '-',
    defaultRevisionCount: settings.defaultRevisionCount || '-',
    relatedProject,
    serviceItems,
    totals: {
      ...totals,
      totalLabel: toCurrency(totals.totalAmount),
      advanceLabel: toCurrency(totals.advancePaid),
      balanceLabel: toCurrency(totals.balanceDue),
    },
    currency: {
      total: toCurrency(totals.totalAmount),
      advance: toCurrency(totals.advancePaid),
      balance: toCurrency(totals.balanceDue),
    },
  };
};

export const formatLineAmount = (quantity, amount) => {
  const qty = Number(quantity) || 0;
  const unit = Number(amount) || 0;
  const lineTotal = qty * unit;
  return toCurrency(lineTotal);
};

export const formatCurrency = toCurrency;
