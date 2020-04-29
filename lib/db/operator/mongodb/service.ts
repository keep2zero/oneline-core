import Dao from "./dao";
import { ObjectID } from "bson";
import { Component, parsePage } from "../../../";
export interface Service<T> {
  findList(index: number, size: number, filter?: any, sort?: any, fields?: any);
  save(object: T | T[]);
  update(object: T, filter: Object);
  updateMany(object: T, filter: Object);
  delete(id: string);
}


export abstract class DefaultService<T> implements Service<T> {
  abstract dao: Dao<T>;
  async findList(index: number, size: number, filter: any = {}, sort: any = {}) {

    const total = await this.dao.findCount(filter);
    const page = parsePage(total, index, size);

    return {
      rows: await this.dao.findList(index, size, filter, sort),
      page: page
    };
  }

  async findListBy(join: any, index: number, size: number, filter: any = {}, sort: any = {}) {
    return await this.dao.findListForeign(join, index, size, filter, 0, sort)
  }

  async findCount(filter: any = {}) {
    return await this.dao.findCount(filter);
  }

  async findSum(field, filter, privateData: boolean = false) {
    return await this.dao.findSum(field, filter, privateData);
  }


  async findListAll(filter: any = {}, fields: any = {}, sort: any = {}) {
    return await this.dao.findListAll(filter, fields, sort);
  }

  async findListAllBy(filter: any, foreign: boolean = false, join: any[] = []) {
    if (foreign) {
      return await this.dao.findListForeign(join, 1, 1000, filter)
    }
    return this.findListAll(filter, {}, {});
  }

  async findItem(id: string) {
    return await this.dao.findItem({ _id: id });
  }

  async findItemBy(filter: any, foreign: boolean = false, join: any[] = []) {
    if (foreign) {
      return await this.dao.findItemForeign(join, filter);
    }
    return await this.dao.findItem(filter);
  }

  async save(object: T | T[]) {
    return await this.dao.save(object);
  }

  async update(object: T, filter: Object) {
    return await this.dao.update(object, filter);
  }

  async updateMany(object: T, filter: Object) {
    return await this.dao.updateMany(object, filter);
  }

  async delete(id: string) {
    return await this.dao.delete({ _id: new ObjectID(id) });
  }

  async deleteBy(filter: Object, multi: boolean = false) {
    log.debug("--------->delete ", filter, multi);
    return await this.dao.delete(filter, multi);
  }
}
