# A express middleware to create restful api for typeORM entities.

usage:

```
import createTypeORMAPI from "@xy/typeorm-rest-middleware";
const app = express();
app.use(
  createTypeORMAPI(connection, {
    disable: {
      Permission: ["ADD", "REMOVE", "UPDATE"]
      // entityName: ["disabled function in LIST,ADD,REMOVE,UPDATE,REMOVE"]
    }
  })
);
```
