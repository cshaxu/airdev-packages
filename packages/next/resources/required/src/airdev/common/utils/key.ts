/* "@airdev/next": "managed" */

export const getObjectTypeFrom =
  <T>(objectKey: string) =>
  () =>
    getObjectType<T>(objectKey);

export const getObjectType = <T>(objectKey: string) =>
  objectKey.split(':')[0] as T;

export const getObjectIdFrom = (objectKey: string) => () =>
  getObjectId(objectKey);

export const getObjectId = (objectKey: string) => objectKey.split(':')[1];

export const buildObjectKeyWith =
  <T>(objectType: T, objectId: string) =>
  () =>
    buildObjectKey(objectType, objectId);

export const buildObjectKey = <T>(objectType: T, objectId: string) =>
  `${objectType}:${objectId}`;
