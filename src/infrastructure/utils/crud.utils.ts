import { createQueryBuilder, getConnection, ObjectLiteral } from 'typeorm';

/**
 * Basic CRUD Utils using querybuilder
 */

export class CrudUtils {
  /**
   * @function store to save given payload into given entity
   * @param payload
   * @param entity
   */
  public async store(payload: any, entity: any) {
    return await createQueryBuilder()
      .insert()
      .into(entity)
      .values(payload)
      .execute();
  }

  /**
   * @function update to update given payload into given entity by id or where
   * @param payload
   * @param entity
   * @param id
   */
  public async update(payload: any, entity: any, id?: number, where?: any) {
    if (where) {
      return await createQueryBuilder()
        .update(entity)
        .set(payload)
        .where(where)
        .execute();
    }
    return await createQueryBuilder()
      .update(entity)
      .set(payload)
      .where('id = :id', { id })
      .execute();
  }

  /**
   * @function delete to delete given entity by given id or where
   * @param id
   * @param entity
   */
  public async delete(id?: number, entity?: any, where?: any) {
    if (where) {
      return await createQueryBuilder()
        .delete()
        .from(entity)
        .where(where)
        .execute();
    }
    return await createQueryBuilder()
      .delete()
      .from(entity)
      .where(' id = :id', { id })
      .execute();
  }

  /**
   * @function read to get given entity by given id or where
   *
   * @param key first argument of where queryBuilder method
   * @param value
   * @param entity -
   *
   * delete data not by id
   */
  public async customDelete(key: string, value: ObjectLiteral, entity: any) {
    return await getConnection('write')
      .createQueryBuilder()
      .delete()
      .from(entity)
      .where(key, value)
      .execute();
  }

  /**
   * @function read to get given entity by given id
   * @param id
   * @param entity
   * @param alias
   */
  public async read(
    column?: any,
    value?: any,
    entity?: any,
    alias?: string,
    where?: string,
  ) {
    if (where) {
      return await getConnection('default')
        .createQueryBuilder(entity, alias)
        .where(where)
        .getOne();
    }
    return await getConnection('default')
      .createQueryBuilder(entity, alias)
      .where(`${alias}.${column} = ${value}`)
      .getOne();
  }
}
