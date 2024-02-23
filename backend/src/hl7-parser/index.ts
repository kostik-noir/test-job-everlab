import fs from 'node:fs/promises';
import path from 'node:path';
import * as obxSegment from './segments/obx';
import * as obrSegment from './segments/obr';

export interface Hl7Message {
  observationResults: any[],
  observationRequests: any[]
}

const parseMsg = (msg: string): Hl7Message => {
  const result: Hl7Message = {
    observationResults: [],
    observationRequests: []
  };

  const lines = msg.split('\r').filter(line => line.trim() !== '');
  lines.forEach((line: string) => {
    const code = line.substring(0, 3);

    switch (code) {
      case obxSegment.code:
        result.observationResults.push(obxSegment.parse(line));
        break;
      case obrSegment.code:
        result.observationRequests.push(obrSegment.parse(line));
        break;
    }
  });

  return result;
}

export const parse = async (hl7StrData: string): Promise<Hl7Message[]> => {
  let nextStartingSearchIndex = 0;
  let previousIndex = 0;

  const messages = [];

  do {
    const index = hl7StrData.indexOf('MSH|', nextStartingSearchIndex);
    if (index === -1) {
      break;
    }

    let msg;
    if (index !== -1) {
      msg = hl7StrData.substring(previousIndex, index);
    } else {
      msg = hl7StrData.substring(previousIndex);
    }

    if (msg !== '') {
      messages.push(parseMsg(msg));
    }

    if (index === -1) {
      break;
    }

    nextStartingSearchIndex = index + 1;
    previousIndex = index;
  } while (true);

  return messages;
};

