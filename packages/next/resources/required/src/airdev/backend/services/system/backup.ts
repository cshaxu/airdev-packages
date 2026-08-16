/* "@airdev/next": "managed" */

import * as AwsSdk from '@/airdev/backend/sdks/aws';
import { toDs } from '@/airdev/common/utils/date';
import { logError } from '@/airdev/common/utils/logging';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { airdevPublicConfig } from '@/airdev/config/public';
import { prismaModels } from '@/generated/prisma-models';
import { CommonResponse, logInfo, queryStringify } from '@airent/api';
import { sequential } from 'airent';
import { Client } from 'pg';

const BACKUP_ROOT_PATH = 'db-exports';

export async function backupToS3(time: Date): Promise<CommonResponse> {
  const { csv, retention } = airdevPrivateConfig.database.backup;
  if (retention === 'none') {
    return {
      code: 200,
      result: { backup: null, restore: null, exports: null, drop: null },
    };
  }

  // configurations
  const awsCredentials = {
    AWS_ACCESS_KEY_ID: airdevPrivateConfig.aws.accessKeyId,
    AWS_SECRET_ACCESS_KEY: airdevPrivateConfig.aws.secretAccessKey,
  };
  const awsCredentialsString = queryStringify(awsCredentials);
  const awsParamsString = queryStringify({
    ...awsCredentials,
    S3_STORAGE_CLASS: 'INTELLIGENT_TIERING',
  });
  const databaseName = airdevPrivateConfig.database.url
    .replace('postgresql://', '')
    .split('/')[1]
    .split('?')[0];

  // time variables
  const ds = toDs(time);
  const hh = time.getUTCHours().toString().padStart(2, '0');
  const mm = time.getUTCMinutes().toString().padStart(2, '0');
  const ss = time.getUTCSeconds().toString().padStart(2, '0');
  const snapshotId = `${ds}${hh}${mm}${ss}`.replaceAll('-', '');
  const systemTime = `${ds} ${hh}:${mm}:${ss}`;

  // restore variables
  const restoreSubdirectory = `${ds.replaceAll('-', '/')}-${hh}${mm}${ss}.00`;
  const restoredDatabaseName = `${databaseName}_${snapshotId}`;

  // s3 variables
  const s3PathPrefix = `${BACKUP_ROOT_PATH}/${snapshotId}`;
  const s3BackupPath = `${s3PathPrefix}-backup`;
  const s3CsvPath = `${s3PathPrefix}-csv`;
  const s3UriPrefix = `s3://${airdevPublicConfig.aws.s3Bucket}`;
  const s3BackupUri = `${s3UriPrefix}/${s3BackupPath}`;
  const s3CsvUri = `${s3UriPrefix}/${s3CsvPath}`;

  const logParams = {
    snapshotId,
    database: databaseName,
    systemTime,
    s3BackupUri,
    s3CsvUri,
    restorePath: `${s3BackupUri}/${restoreSubdirectory}`,
  };
  logInfo({ name: 'backupToS3.start', ...logParams });

  // go!
  const client = new Client({
    connectionString: airdevPrivateConfig.database.url,
    ssl: { rejectUnauthorized: true },
  });

  let backup: any = undefined;
  let restore: any = undefined;
  let exports: any = undefined;
  let drop: any = undefined;
  let cleanups: any = undefined;

  try {
    await client.connect();

    const backupStatement = `BACKUP DATABASE ${databaseName} INTO '${s3BackupUri}?${awsParamsString}' AS OF SYSTEM TIME '${systemTime}';`;
    backup = await querySafe('backup', logParams, client, backupStatement);
    if (hasQueryError(backup)) {
      return {
        code: 500,
        result: { backup, restore, exports, drop },
        error: backup.error,
      };
    } else {
      logInfo({ name: 'backupToS3.backup', snapshotId, backup });
    }

    if (csv) {
      const restoreStatement = `RESTORE DATABASE ${databaseName} FROM '${restoreSubdirectory}' IN '${s3BackupUri}?${awsParamsString}' WITH new_db_name='${restoredDatabaseName}';`;
      restore = await querySafe('restore', logParams, client, restoreStatement);
      if (hasQueryError(restore)) {
        return {
          code: 500,
          result: { backup, restore, exports, drop },
          error: restore.error,
        };
      } else {
        logInfo({ name: 'backupToS3.restore', snapshotId, restore });
      }

      try {
        exports = await exportTables(
          awsCredentialsString,
          s3CsvPath,
          s3CsvUri,
          restoredDatabaseName,
          logParams,
          client
        );
        const exportFailure = (exports as any[]).find(hasQueryError);
        if (exportFailure) {
          return {
            code: 500,
            result: { backup, restore, exports, drop },
            error: exportFailure.error,
          };
        } else {
          logInfo({ name: 'backupToS3.exports', snapshotId, exports });
        }
      } catch (error) {
        const redactedError = redactError(error);
        return {
          code: 500,
          result: { backup, restore, exports, drop },
          error: redactedError,
        };
      } finally {
        const dropStatement = `DROP DATABASE IF EXISTS ${restoredDatabaseName};`;
        drop = await querySafe('drop', logParams, client, dropStatement);
        if (hasQueryError(drop)) {
          return {
            code: 500,
            result: { backup, restore, exports, drop },
            error: drop.error,
          };
        } else {
          logInfo({ name: 'backupToS3.drop', snapshotId, drop });
        }
      }
    }

    if (retention === 'latest') {
      cleanups = await deleteOtherSnapshots(snapshotId);
      logInfo({ name: 'backupToS3.cleanups', snapshotId, cleanups });
    }

    return {
      code: 200,
      result: { snapshotId, backup, restore, exports, drop, cleanups },
    };
  } catch (error) {
    const redactedError = redactError(error);
    return {
      code: 500,
      result: { backup, restore, exports, drop, cleanups },
      error: { ...redactedError, context: logParams },
    };
  } finally {
    await client.end();
  }
}

async function exportTables(
  awsCredentialsString: string,
  s3CsvPath: string,
  s3CsvUri: string,
  restoredDatabase: string,
  logParams: any,
  client: Client
): Promise<any> {
  const tables = Object.entries(prismaModels);
  const exportPromises = tables.map((table) =>
    exportOneTable(
      table[0],
      table[1],
      awsCredentialsString,
      s3CsvPath,
      s3CsvUri,
      restoredDatabase,
      logParams,
      client
    )
  );
  return await Promise.all(exportPromises);
}

async function exportOneTable(
  tableName: string,
  tableFields: string[],
  awsCredentialsString: string,
  s3CsvPath: string,
  s3CsvUri: string,
  restoredDatabase: string,
  logParams: any,
  client: Client
): Promise<any> {
  const exportStatement = `EXPORT INTO CSV '${s3CsvUri}?${awsCredentialsString}' WITH nullas='null' FROM TABLE ${restoredDatabase}."${tableName}";`;
  const exportResult = await querySafe(
    `export.${tableName}`,
    logParams,
    client,
    exportStatement
  );
  if (hasQueryError(exportResult)) {
    return exportResult;
  }
  const { response } = exportResult;

  const filenames = ((response.rows ?? []) as any[]).map(
    (row) => row.filename as string
  );
  const renameFunctions = filenames.map(
    (filename, index) => () =>
      renameS3Object(
        `${s3CsvPath}/${filename}`,
        `${s3CsvPath}/${tableName}/${index}.csv`
      )
  );
  await sequential(renameFunctions);

  await AwsSdk.uploadS3Object(
    `${s3CsvPath}/${tableName}/schema.csv`,
    Buffer.from(tableFields.join(','), 'utf-8')
  );
  return response;
}

async function querySafe(
  name: string,
  logParams: any,
  client: Client,
  statement: string
): Promise<any> {
  try {
    const { command, rowCount, rows } = await client.query(statement);
    const response = { command, rowCount, rows };
    return { name, response };
  } catch (error) {
    const redactedError = redactError(error);
    const data = { name, ...logParams };
    logError(redactedError, data);
    return { error: redactedError, context: data };
  }
}

const hasQueryError = (result: any): result is { error: any; context: any } =>
  !!result?.error;

const redactError = (error: any) => ({
  name: error.name,
  message: error.message,
  stack: error.stack
    .replaceAll(airdevPrivateConfig.aws.accessKeyId, 'AWS_ACCESS_KEY_ID')
    .replaceAll(
      airdevPrivateConfig.aws.secretAccessKey,
      'AWS_SECRET_ACCESS_KEY'
    ),
});

async function renameS3Object(oldKey: string, newKey: string): Promise<void> {
  await AwsSdk.copyS3Object(oldKey, newKey);
  await AwsSdk.deleteS3Object(oldKey);
}

async function deleteOtherSnapshots(snapshotId: string): Promise<string[]> {
  const allKeys = await AwsSdk.listS3ObjectKeys(`${BACKUP_ROOT_PATH}/`);
  const folders = new Set<string>();
  for (const key of allKeys) {
    const suffix = key.slice(BACKUP_ROOT_PATH.length + 1);
    if (!suffix) {
      continue;
    }
    const folder = suffix.split('/')[0];
    if (folder) {
      folders.add(folder);
    }
  }

  const keep = new Set([`${snapshotId}-backup`, `${snapshotId}-csv`]);
  const prefixes = Array.from(folders).filter((folder) => !keep.has(folder));
  for (const prefix of prefixes) {
    const keys = await AwsSdk.listS3ObjectKeys(
      `${BACKUP_ROOT_PATH}/${prefix}/`
    );
    const chunks = chunk(keys, 100);
    for (const chunkKeys of chunks) {
      await AwsSdk.deleteS3Objects(chunkKeys);
    }
  }
  return prefixes;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
