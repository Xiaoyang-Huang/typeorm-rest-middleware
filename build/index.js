"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var express_1 = require("express");
var class_validator_1 = require("class-validator");
function createAPI(routers, method, repository, pathname, primayKeys) {
    var _this = this;
    switch (method) {
        case "LIST":
            routers.get("/" + pathname, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, page, _c, size, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.size, size = _c === void 0 ? 0 : _c;
                            _e = (_d = res).json;
                            return [4 /*yield*/, repository.findAndCount({ skip: Math.max((page - 1) * size, 0), take: Math.max(size, 0) || undefined })];
                        case 1:
                            _e.apply(_d, [_f.sent()]);
                            next();
                            return [2 /*return*/];
                    }
                });
            }); });
            break;
        case "READ":
            routers.get("/" + pathname + "/:id", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var id, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            id = req.params.id;
                            _b = (_a = res).json;
                            return [4 /*yield*/, repository.findOne((_c = {}, _c[primayKeys[0].propertyName] = id, _c))];
                        case 1:
                            _b.apply(_a, [_d.sent()]);
                            next();
                            return [2 /*return*/];
                    }
                });
            }); });
            break;
        case "ADD":
            routers.post("/" + pathname, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var instance, errors, savedRecord;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            instance = repository.create();
                            Object.keys(req.body).reduce(function (result, key) {
                                result[key] = req.body[key];
                                return result;
                            }, instance);
                            return [4 /*yield*/, class_validator_1.validate(instance)];
                        case 1:
                            errors = _a.sent();
                            if (!errors.length) return [3 /*break*/, 2];
                            res.status(400).json(errors);
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, repository.save(instance)];
                        case 3:
                            savedRecord = _a.sent();
                            res.json(savedRecord);
                            _a.label = 4;
                        case 4:
                            next();
                            return [2 /*return*/];
                    }
                });
            }); });
            break;
        case "UPDATE":
            routers.patch("/" + pathname + "/:id", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var id, originalRecord, savedRecord, errors;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = req.params.id;
                            return [4 /*yield*/, repository.findOne((_a = {}, _a[primayKeys[0].propertyName] = id, _a))];
                        case 1:
                            originalRecord = _b.sent();
                            savedRecord = Object.keys(req.body).reduce(function (result, key) {
                                result[key] = req.body[key];
                                return result;
                            }, originalRecord);
                            return [4 /*yield*/, class_validator_1.validate(savedRecord)];
                        case 2:
                            errors = _b.sent();
                            if (!errors.length) return [3 /*break*/, 3];
                            res.status(400).json(errors);
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, repository.save(savedRecord)];
                        case 4:
                            _b.sent();
                            res.json(savedRecord);
                            _b.label = 5;
                        case 5:
                            next();
                            return [2 /*return*/];
                    }
                });
            }); });
            break;
        case "REMOVE":
            routers.delete("/" + pathname + "/:id", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var id, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            id = req.params.id;
                            _b = (_a = res).json;
                            return [4 /*yield*/, repository.delete(id)];
                        case 1:
                            _b.apply(_a, [_c.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); });
            break;
    }
}
function getColumns(metadata) {
    var result = {};
    metadata.ownColumns.reduce(function (innerResult, column) {
        innerResult[column.propertyName] = {
            type: column.type.name
        };
        return innerResult;
    }, result);
    metadata.ownRelations.reduce(function (innerResult, relation) {
        innerResult[relation.propertyName] = {
            relationType: relation.relationType,
            type: relation.type.name
        };
        return innerResult;
    }, result);
    return result;
}
function createTypeORMMiddleware(connection, option) {
    var _this = this;
    var routers = express_1.Router();
    var scheme = {};
    typeorm_1.getMetadataArgsStorage().tables.map(function (table) {
        var target = table.target;
        var metadata = connection.getMetadata(table.target);
        var name = metadata.name;
        var pathname = name.replace(/\B([A-Z])/g, "-$&").toLowerCase();
        var primayKeys = metadata.primaryColumns;
        var repository = connection.getRepository(target);
        var hasDisableMethod = (option && option.disable && option.disable[name]) || [];
        var paths = [];
        console.log("create API for " + name);
        hasDisableMethod.indexOf("LIST") > -1 || createAPI(routers, "LIST", repository, pathname, primayKeys) || paths.push({ method: "GET", path: "/" + pathname });
        hasDisableMethod.indexOf("READ") > -1 || createAPI(routers, "READ", repository, pathname, primayKeys) || paths.push({ method: "GET", path: "/" + pathname + "/:id" });
        hasDisableMethod.indexOf("ADD") > -1 || createAPI(routers, "ADD", repository, pathname, primayKeys) || paths.push({ method: "POST", path: "/" + pathname });
        hasDisableMethod.indexOf("UPDATE") > -1 || createAPI(routers, "UPDATE", repository, pathname, primayKeys) || paths.push({ method: "PATCH", path: "/" + pathname + "/:id" });
        hasDisableMethod.indexOf("REMOVE") > -1 || createAPI(routers, "REMOVE", repository, pathname, primayKeys) || paths.push({ method: "DELETE", path: "/" + pathname + "/:id" });
        console.log("create scheme for " + name);
        scheme[name] = {
            paths: paths,
            metadata: {
                columns: getColumns(metadata)
            }
        };
    });
    routers.get("/scheme", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.json(scheme);
            next();
            return [2 /*return*/];
        });
    }); });
    return routers;
}
exports.default = createTypeORMMiddleware;
//# sourceMappingURL=index.js.map