const path = require('node:path');
const fs = require('node:fs');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const { parseFile } = require('fast-csv');

dotenv.config();

const dumpDir = path.resolve(__dirname, 'dump');

(async () => {
  const sqlStatements = [];

  const metrics = await processMetricsDataFile();
  const diagnostics = await processDiagnosticsDataFile(metrics.idMap);
  const conditions = await processConditionsDataFile(metrics.idMap);

  sqlStatements.push(getInitDatabaseSQL());
  sqlStatements.push('SET FOREIGN_KEY_CHECKS=0;');
  sqlStatements.push(metrics.sql);
  sqlStatements.push(diagnostics.sql);
  sqlStatements.push(conditions.sql);
  sqlStatements.push('SET FOREIGN_KEY_CHECKS=1;');
  const connection = await getConnection();
  await connection.query(sqlStatements.join(''));
  console.log('===========\nTHE DATA WAS SUCCESSFULLY IMPORTED INTO THE DATABASE\n===========')
})();

async function getConnection() {
  return new Promise(async (resolve, reject) => {
    await tryConnect();

    async function tryConnect() {
      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT, 10) || 3306,
          user: process.env.MYSQL_USER || 'root',
          password: process.env.MYSQL_ROOT_PASSWORD || 'root',
          database: process.env.DB_NAME,
          multipleStatements: true
        });
        resolve(connection);
      } catch (e) {
        console.log('Waiting for a database connection,', e.message)
        setTimeout(tryConnect, 10000);
      }
    }
  });
}

function processMetricsDataFile() {
  return new Promise((resolve, reject) => {
    const tableName = 'metrics';

    const sqlStatements = [];
    const idMap = {};
    let idCounter = 1;

    sqlStatements.push(`
      DROP TABLE IF EXISTS ${ tableName };
      CREATE TABLE ${ tableName } (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        unit VARCHAR(50),
        min_age SMALLINT,
        max_age SMALLINT,
        gender VARCHAR(50),
        standard_lower FLOAT,
        standard_higher FLOAT,
        everlab_lower FLOAT,
        everlab_higher FLOAT
      );
    `);

    const valuesToInsert = [];

    parseFile(path.resolve(dumpDir, 'diagnostic_metrics.csv'), { headers: true })
      .on('error', error => {
        reject(error);
      })
      .on('data', row => {
        const metricName = escapeSingleQuotes(row.name);
        const unit = escapeSingleQuotes(row.units);

        let minAge = parseInt(row.min_age, 10);
        if (isNaN(minAge)) {
          minAge = 0;
        }

        let maxAge = parseInt(row.max_age, 10);
        if (isNaN(maxAge)) {
          maxAge = 200;
        }

        const gender = escapeSingleQuotes(row.gender);

        let standardLower = parseFloat(row.standard_lower);
        if (isNaN(standardLower)) {
          standardLower = 0;
        }

        let standardHigher = parseFloat(row.standard_higher);
        if (isNaN(standardHigher)) {
          standardHigher = 0;
        }

        let everlabLower = parseFloat(row.everlab_lower);
        if (isNaN(everlabLower)) {
          everlabLower = 0;
        }

        let everlabHigher = parseFloat(row.everlab_higher);
        if (isNaN(everlabHigher)) {
          everlabHigher = 0;
        }

        valuesToInsert.push(`(
          ${ idCounter },
          '${ metricName }',
          '${ unit }',
          ${ minAge },
          ${ maxAge },
          '${ gender }',
          ${ standardLower },
          ${ standardHigher },
          ${ everlabLower },
          ${ everlabHigher }
        )`);

        idMap[metricName] = idCounter;
        idCounter++;
      })
      .on('end', () => {
        sqlStatements.push(`
          INSERT INTO ${ tableName }
          VALUES
            ${ valuesToInsert.join(',') }
          ;
        `);

        resolve({
          sql: sqlStatements.join(''),
          idMap
        });
      });
  });
}

function processDiagnosticsDataFile(metricsIdMap) {
  return new Promise((resolve, reject) => {
    const tableName = 'diagnostics';
    const junctionTableName = 'diagnostics_metrics';

    const sqlStatements = [];
    const valuesToInsertIntoMainTable = [];
    const valuesToInsertIntoJunctionTable = [];
    const idMap = {};
    let idCounter = 1;

    sqlStatements.push(`
      DROP TABLE IF EXISTS ${ tableName };
      CREATE TABLE ${ tableName } (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name varchar(255)
      );
      
      DROP TABLE IF EXISTS ${ junctionTableName };
      CREATE TABLE ${ junctionTableName } (
        diagnostic_id INT,
        metric_id INT,
        CONSTRAINT PK_DiagnosticMetric PRIMARY KEY (
          diagnostic_id,
          metric_id
        ),
        FOREIGN KEY (diagnostic_id) REFERENCES diagnostics (id),
        FOREIGN KEY (metric_id) REFERENCES metrics (id)
      );
    `);

    parseFile(path.resolve(dumpDir, 'diagnostics.csv'), { headers: true })
      .on('error', error => {
        reject(error);
      })
      .on('data', row => {
        const diagnosticName = escapeSingleQuotes(row.name);

        valuesToInsertIntoMainTable.push(`(
          ${ idCounter },
          '${ diagnosticName }'
        )`);

        row.diagnostic_metrics.split(',').forEach((metricName) => {
          const metricId = metricsIdMap[metricName];
          if (typeof metricId === 'undefined') {
            return;
          }

          valuesToInsertIntoJunctionTable.push(`(
            ${ idCounter },
            ${ metricId }
          )`);
        });

        idMap[diagnosticName] = idCounter;
        idCounter++;
      })
      .on('end', () => {
        sqlStatements.push(`
          INSERT INTO ${ tableName }
          VALUES
            ${ valuesToInsertIntoMainTable.join(',') }
          ;
        `);

        sqlStatements.push(`
          INSERT INTO ${ junctionTableName }
          VALUES
            ${ valuesToInsertIntoJunctionTable.join(',') }
          ;
        `);

        resolve({
          sql: sqlStatements.join(''),
          idMap
        });
      });
  });
}

function processConditionsDataFile(metricsIdMap) {
  return new Promise((resolve, reject) => {
    const tableName = 'conditions';
    const junctionTableName = 'conditions_metrics';

    const sqlStatements = [];
    const valuesToInsertIntoMainTable = [];
    const valuesToInsertIntoJunctionTable = [];
    const idMap = {};
    let idCounter = 1;

    sqlStatements.push(`
      DROP TABLE IF EXISTS ${ tableName };
      CREATE TABLE ${ tableName } (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name varchar(255)
      );
      
      DROP TABLE IF EXISTS ${ junctionTableName };
      CREATE TABLE ${ junctionTableName } (
        condition_id int,
        metric_id int,
        constraint PK_DiagnosticMetric primary key (
          condition_id,
          metric_id
        ),
        foreign key (condition_id) references conditions (id),
        foreign key (metric_id) references metrics (id)
      );
    `);

    parseFile(path.resolve(dumpDir, 'conditions.csv'), { headers: true })
      .on('error', error => {
        reject(error);
      })
      .on('data', row => {
        const conditionName = escapeSingleQuotes(row.name);

        valuesToInsertIntoMainTable.push(`(
          ${ idCounter },
          '${ conditionName }'
        )`);

        row.diagnostic_metrics.split(',').forEach((metricName) => {
          const metricId = metricsIdMap[metricName];
          if (typeof metricId === 'undefined') {
            return;
          }

          valuesToInsertIntoJunctionTable.push(`(
            ${ idCounter },
            ${ metricId }
          )`);
        });

        idMap[conditionName] = idCounter;
        idCounter++;
      })
      .on('end', () => {
        sqlStatements.push(`
          INSERT INTO ${ tableName }
          VALUES
            ${ valuesToInsertIntoMainTable.join(',') }
          ;
        `);

        sqlStatements.push(`
          INSERT INTO ${ junctionTableName }
          VALUES
            ${ valuesToInsertIntoJunctionTable.join(',') }
          ;
        `);

        resolve({
          sql: sqlStatements.join(''),
          idMap
        });
      });
  });
}

function getInitDatabaseSQL() {
  return 'use everlab;';
}

function escapeSingleQuotes(str) {
  return str.replace(/'/g, "\\'");
}
