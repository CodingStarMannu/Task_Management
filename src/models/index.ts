// import fs from "fs";
// import path from "path";
// import { Sequelize, Model, ModelStatic } from "sequelize";
// import sequelize from "../config/database";

// export interface Database {
//   sequelize: Sequelize;
//   Sequelize: typeof Sequelize;
//   models: {
//     [key: string]: ModelStatic<Model>;
//   };
// }

// // database object
// const db: Database = {
//   sequelize,
//   Sequelize,
//   models: {},
// };

// // Model loading and initialization
// const initializeModels = () => {
//   const modelPath = __dirname;
//   const basename = path.basename(__filename);

//   fs.readdirSync(modelPath)
//     .filter((file) => {
//       return (
//         file.indexOf(".") !== 0 &&
//         file !== basename &&
//         (file.endsWith(".ts") || file.endsWith(".js")) &&
//         file.indexOf(".test.") === -1
//       );
//     })
//     .forEach((file) => {
//       const modelModule = require(path.join(modelPath, file)).default;

//       // Check if the model has an initModel method
//       if (typeof modelModule.initModel === "function") {
//         const model = modelModule.initModel(sequelize);
//         db.models[model.name] = model;
//       }
//     });

//   Object.keys(db.models).forEach((modelName) => {
//     const model = db.models[modelName];
//     if ((model as any).associate) {
//       (model as any).associate(db.models);
//     }
//   });
// };

// initializeModels();

// export default db;



import fs from "fs";
import path from "path";
import { Sequelize, Model, ModelStatic } from "sequelize";
import sequelize from "../config/database";

interface Database {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  models: {
    [key: string]: any;
  };
}

const db: Database = {
  sequelize,
  Sequelize,
  models: {},
};

const modelPath = __dirname;
const basename = path.basename(__filename);

fs.readdirSync(modelPath)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.endsWith(".ts") || file.endsWith(".js")) &&
      file.indexOf(".test.") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(modelPath, file)).default;
    if (model.initModel) {
      db.models[model.name] = model.initModel(sequelize);
    }
  });

Object.keys(db.models).forEach((modelName) => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

export default db;
