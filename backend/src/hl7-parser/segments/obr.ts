// https://hl7-definition.caristix.com/v2/HL7v2.5/Segments/OBR

import { segmentStringToFields } from './utils';

export const code = 'OBR';

export const parse = (str: string): object => {
  const fields = segmentStringToFields(str);

  return {
    setId: fields[1],
    placerOrderNumber: fields[2],
    fillerOrderNumber: fields[3],
    universalServiceId: fields[4],
    priority: fields[5],
    requestedDateTime: fields[6],
    observationDateTime: fields[7],
    observationEndDateTime: fields[8],
    collectionVolume: fields[9],
    collectorId: fields[10],
    specimenActionCode: fields[11],
    dangerCode: fields[12],
    relevantClinicalInformation: fields[13],
    specimenReceivedDateTime: fields[14],
    specimenSource: fields[15],
    orderingProvider: fields[16],
    orderCallbackPhoneNumber: fields[17],
    placerField1: fields[18],
    placerField2: fields[19],
    fillerField1: fields[20],
    fillerField2: fields[21],
    resultsRptOrStatusChngDateTime: fields[22],
    chargeToPractice: fields[23],
    diagnosticServSectId: fields[24],
    resultStatus: fields[25],
    parentResult: fields[26],
    quantityOrTiming: fields[27],
    resultCopiesTo: fields[28],
    parent: fields[29],
    transportationMode: fields[30],
    reasonForStudy: fields[31],
    principalResultInterpreter: fields[32],
    assistantResultInterpreter: fields[33],
    technician: fields[34],
    transcriptionist: fields[35],
    scheduledDateTime: fields[36],
    numberOfSampleContainers: fields[37],
    transportLogisticsOfCollectedSample: fields[38],
    commentOfCollector: fields[39],
    transportArrangementResponsibility: fields[40],
    transportArranged: fields[41],
    escortRequired: fields[42],
    plannedPatientTransportComment: fields[43],
    procedureCode: fields[44],
    procedureCodeModifier: fields[45],
    placerSupplementalServiceInformation: fields[46],
    fillerSupplementalServiceInformation: fields[47],
    medicallyNecessaryDuplicateProcedureReason: fields[48],
    resultHandling: fields[49]
  };
}
