import { Request, Response, Router } from 'express';
import multer from 'multer';
import * as Buffer from 'buffer';
import { RowDataPacket } from 'mysql2';
import * as hl7Parser from '../../hl7-parser';
import type { Hl7Message } from '../../hl7-parser';
import * as db from '../../db';

export const create = () => {
  const router = Router();

  const upload = multer();

  router.post('/', upload.any(), async (req: Request, res: Response) => {
    const connection = await db.getConnection();

    const files = req.files as { buffer: Buffer }[];
    if (!files) {
      res.send('');
      return;
    }

    const oruMessages: Hl7Message[] = await hl7Parser.parse(files[0].buffer.toString());
    const oruObservationsWithResult = oruMessages
      .reduce((acc: { [key: string]: number }, msg) => {
        msg.observationResults
          .filter((result) => !isNaN(parseFloat(result.observationValue)))
          .forEach((result) => {
            const key = result.observationId[1];
            acc[key] = parseFloat(result.observationValue);
          });
        return acc;
      }, {});

    try {
      let query;
      let where;
      let queryResult: [RowDataPacket[], { [key: string]: any }];
      let rows: { [key: string]: any }[];

      // ==============
      // find abnormal observations and appropriate diagnostics
      // ==============
      where = Object.keys(oruObservationsWithResult)
        .map((name: string) => {
          const value: number = oruObservationsWithResult[name];
          return `
            metrics.name='${name}'
            AND (
              metrics.standard_lower > ${value}
              OR
              metrics.standard_higher < ${value}
              OR
              metrics.everlab_lower > ${value}
              OR
              metrics.everlab_higher < ${value}
            )
          `;
        })
        .join(' OR ');

      query = `
        select
          metrics.id as metricId,
          metrics.name as metricName,
          metrics.unit as unit,
          metrics.gender as gender,
          metrics.standard_lower as standardLower,
          metrics.standard_higher as standardHigher,
          metrics.everlab_lower as everlabLower,
          metrics.everlab_higher as everlabHigher,
          metrics.min_age as minAge,
          metrics.max_age as maxAge,
          diagnostics.name as diagnosticName
        from
          diagnostics_metrics junctionTable
        join
          diagnostics
        on
          diagnostics.id = junctionTable.diagnostic_id
        join
          metrics
        on
          junctionTable.metric_id = metrics.id
        where
          ${where}
        ;
      `;

      queryResult = await connection.query(query);
      rows = queryResult[0];

      const abnormalObservations = rows.reduce((acc, row) => {
        if (typeof acc[row.metricName] === 'undefined') {
          acc[row.metricName] = {
            value: findValueByCaseInsensitiveKey(
              oruObservationsWithResult as { [key: string]: any },
              row.metricName
            ),
            metricId: row.metricId,
            unit: row.unit,
            gender: row.gender,
            diagnostics: [],
            conditions: [],
            standardLower: row.standardLower,
            standardHigher: row.standardHigher,
            everlabLower: row.everlabLower,
            everlabHigher: row.everlabHigher,
            minAge: row.minAge,
            maxAge: row.maxAge
          };

          acc[row.metricName].diagnostics.push(row.diagnosticName);
        }

        return acc;
      }, {});

      // ==============
      // find conditions for abnormal conditions
      // ==============
      where = Object.keys(abnormalObservations)
        .map((observationName) => {
          return `metrics.name='${observationName}'`
        })
        .join(' OR ');

      query = `
        select
          metrics.name as metricName,
          conditions.name as conditionName
        from
          conditions_metrics junctionTable
        join
          conditions
        on
          conditions.id = junctionTable.condition_id
        join
          metrics
        on
          junctionTable.metric_id = metrics.id
        where
          ${where}
      `;

      queryResult = await connection.query(query);
      rows = queryResult[0];
      rows.forEach(({ metricName, conditionName }) => {
        abnormalObservations[metricName].conditions.push(conditionName);
      });

      const observations = Object.keys(abnormalObservations)
        .reduce((acc: { [key: string]: any }[], metricName) => {
          const {
            value,
            unit,
            gender,
            diagnostics,
            conditions,
            standardLower,
            standardHigher,
            everlabLower,
            everlabHigher,
            minAge,
            maxAge
          } = abnormalObservations[metricName];

          acc.push({
            name: metricName,
            value,
            unit,
            gender,
            diagnostics,
            conditions,
            standardLower,
            standardHigher,
            everlabLower,
            everlabHigher,
            minAge,
            maxAge
          });

          return acc;
        }, []);

      res.json({
        observations
      });
    } catch (e) {
      console.log(e);
    }
  });

  return router;
};

function findValueByCaseInsensitiveKey(obj: { [key: string]: any }, key: string) {
  const keyInLowerCase = key.toLowerCase();

  let result: any = undefined;

  Object.keys(obj).forEach((k) => {
    if (k.toLowerCase() !== keyInLowerCase) {
      return;
    }
    result = obj[k];
  });

  return result;
}
