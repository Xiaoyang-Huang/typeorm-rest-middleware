import { Connection, getMetadataArgsStorage, Repository, EntityMetadata } from "typeorm";
import { NextFunction, Response, Request, Router } from "express";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { validate } from "class-validator";

type ApiMethod = "LIST" | "READ" | "ADD" | "UPDATE" | "REMOVE";

function createAPI(routers: Router, method: ApiMethod, repository: Repository<any>, pathname: String, primayKeys: ColumnMetadata[]) {
  switch (method) {
    case "LIST":
      routers.get(`/${pathname}`, async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, size = 0 } = req.query;
        res.json(await repository.findAndCount({ skip: Math.max((page - 1) * size, 0), take: Math.max(size, 0) || undefined }));
        next();
      });
      break;
    case "READ":
      routers.get(`/${pathname}/:id`, async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        res.json(await repository.findOne({ [primayKeys[0].propertyName]: id }));
        next();
      });
      break;
    case "ADD":
      routers.post(`/${pathname}`, async (req: Request, res: Response, next: NextFunction) => {
        const instance = repository.create();
        Object.keys(req.body).reduce((result, key) => {
          result[key] = req.body[key];
          return result;
        }, instance);
        const errors = await validate(instance);
        if (errors.length) {
          res.status(400).json(errors);
        } else {
          const savedRecord = await repository.save(instance);
          res.json(savedRecord);
        }
        next();
      });
      break;
    case "UPDATE":
      routers.patch(`/${pathname}/:id`, async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const originalRecord = await repository.findOne({ [primayKeys[0].propertyName]: id });
        const savedRecord = Object.keys(req.body).reduce((result, key) => {
          result[key] = req.body[key];
          return result;
        }, originalRecord);
        const errors = await validate(savedRecord);
        if (errors.length) {
          res.status(400).json(errors);
        } else {
          await repository.save(savedRecord);
          res.json(savedRecord);
        }
        next();
      });
      break;
    case "REMOVE":
      routers.delete(`/${pathname}/:id`, async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        res.json(await repository.delete(id));
      });
      break;
  }
}

function getColumns(metadata: EntityMetadata) {
  const result = {};
  metadata.ownColumns.reduce((innerResult, column) => {
    innerResult[column.propertyName] = {
      type: (column.type as Function).name
    };
    return innerResult;
  }, result);
  metadata.ownRelations.reduce((innerResult, relation) => {
    innerResult[relation.propertyName] = {
      relationType: relation.relationType,
      type: (relation.type as Function).name
    };
    return innerResult;
  }, result);
  return result;
}

function createTypeORMMiddleware(connection: Connection, option?: { disable?: { [key: string]: Array<ApiMethod> } }) {
  const routers = Router();
  const scheme = {};
  getMetadataArgsStorage().tables.map(table => {
    const target = table.target;
    const metadata = connection.getMetadata(table.target);
    const name = metadata.name;
    const pathname = name.replace(/\B([A-Z])/g, "-$&").toLowerCase();
    const primayKeys = metadata.primaryColumns;
    const repository = connection.getRepository(target);
    const hasDisableMethod = (option && option.disable && option.disable[name]) || [];
    const paths = [];

    console.log(`create API for ${name}`);
    hasDisableMethod.indexOf("LIST") > -1 || createAPI(routers, "LIST", repository, pathname, primayKeys) || paths.push({ method: "GET", path: `/${pathname}` });
    hasDisableMethod.indexOf("READ") > -1 || createAPI(routers, "READ", repository, pathname, primayKeys) || paths.push({ method: "GET", path: `/${pathname}/:id` });
    hasDisableMethod.indexOf("ADD") > -1 || createAPI(routers, "ADD", repository, pathname, primayKeys) || paths.push({ method: "POST", path: `/${pathname}` });
    hasDisableMethod.indexOf("UPDATE") > -1 || createAPI(routers, "UPDATE", repository, pathname, primayKeys) || paths.push({ method: "PATCH", path: `/${pathname}/:id` });
    hasDisableMethod.indexOf("REMOVE") > -1 || createAPI(routers, "REMOVE", repository, pathname, primayKeys) || paths.push({ method: "DELETE", path: `/${pathname}/:id` });

    console.log(`create schema for ${name}`);
    scheme[name] = {
      paths,
      metadata: {
        columns: getColumns(metadata)
      }
    };
  });

  routers.get("/schema", async (req: Request, res: Response, next: NextFunction) => {
    res.json(scheme);
    next();
  });

  return routers;
}

export default createTypeORMMiddleware;
