// https://hl7-definition.caristix.com/v2/HL7v2.5/Segments/OBX
// https://hl7-definition.caristix.com/v2/HL7v2.5/Tables/0085

import { segmentStringToFields, splitFieldToSubComponents } from './utils';

export const code = 'OBX';

export const parse = (str: string): object => {
  const fields = segmentStringToFields(str);

  const observationIdParts = splitFieldToSubComponents(fields[3]).map(v => v.replace(/:$/, ''));

  return {
    setId: fields[1],
    valueType: fields[2],
    observationId: observationIdParts,
    observationSubId: fields[4],
    observationValue: fields[5],
    units: fields[6],
    referencesRange: fields[7],
    abnormalFlags: fields[8],
    probability: fields[9],
    natureOfAbnormalTest: fields[10],
    observationResultStatus: fields[11],
    effectiveDateOfReferenceRange: fields[12],
    userDefinedAccessChecks: fields[13],
    dateTimeOfObservation: fields[14],
    producerId: fields[15],
    responsibleObserver: fields[16],
    observationMethod: fields[17],
    equipmentInstanceId: fields[18],
    dateTimeOfAnalysis: fields[19]
  };
}
