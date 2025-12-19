export const mapCourseLevel = (level: string): string | undefined => {
  const levelMap: Record<string, string> = {
    graduation: 'graduacao',
    postgraduate: 'pos-graduacao',
  };
  return levelMap[level];
};

export const mapModality = (modality: string): string | undefined => {
  const modalityMap: Record<string, string> = {
    presencial: 'presencial',
    semipresencial: 'hibrido',
    ead: 'ead',
  };
  return modalityMap[modality];
};

export const mapDurationRange = (duration: string): string | undefined => {
  const durationMap: Record<string, string> = {
    '1-2': '1-2',
    '2-3': '2-3',
    '3-4': '3-4',
    '4-plus': '4+',
  };
  return durationMap[duration];
};

/**
 * Map shift to period ID
 * Shifts: morning, afternoon, night, fulltime, virtual
 * Periods: manha (1), tarde (2), noite (3), integral (4), virtual (5)
 */
export const mapShiftToPeriodId = (shift: string): number | undefined => {
  const shiftMap: Record<string, number> = {
    manha: 1, // Matutino
    tarde: 2, // Vespertino
    noite: 3, // Noturno
    integral: 4, // Integral
    virtual: 5, // Virtual
  };
  return shiftMap[shift];
};
