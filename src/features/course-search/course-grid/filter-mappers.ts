export function mapModalityToBFF(modality: string): string {
  const modalityMap: Record<string, string> = {
    presencial: 'presencial',
    semipresencial: 'semipresencial',
    ead: 'ead',
  };

  return modalityMap[modality] ?? modality;
}

export function mapShiftToBFF(shift: string): string {
  const shiftMap: Record<string, string> = {
    manha: 'manha',
    tarde: 'tarde',
    noite: 'noite',
    integral: 'integral',
    virtual: 'virtual',
  };

  return shiftMap[shift] ?? shift;
}

export function mapDurationToBFF(duration: string): string {
  const durationMap: Record<string, string> = {
    '1-2': '1-2',
    '2-3': '2-3',
    '3-4': '3-4',
    '4-plus': '4+',
  };

  return durationMap[duration] ?? duration;
}

export function mapLevelToBFF(level: string): 'undergraduate' | 'graduate' {
  if (level === 'postgraduate') return 'graduate';
  return 'undergraduate';
}
