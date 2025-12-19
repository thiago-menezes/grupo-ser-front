export const formatPrice = (price: number): string => {
  if (price === 0) {
    return 'R$ 0,00';
  }

  const formattedPrice = price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formattedPrice;
};
