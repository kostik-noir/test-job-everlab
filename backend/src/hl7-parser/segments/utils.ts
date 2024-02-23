export const segmentStringToFields = (str: string): string[] => {
  return str.split('|');
}

export const splitFieldToSubComponents = (str: string): string[] => {
  return str.split('^');
}
