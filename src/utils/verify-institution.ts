const INSTITUTIONS = [
  'grupo-ser',
  'uninassau',
  'ung',
  'unama',
  'uninorte',
  'unifael',
  'uni7',
];

export const isValidInstitution = (institution: string) => {
  return INSTITUTIONS.includes(institution);
};
