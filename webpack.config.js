const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
const shareAll = mf.shareAll;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "financeRemote",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
        library: { type: "module" },

        // For remotes (please adjust)
        name: "financeRemote",
        filename: "financeModule.js",
        exposes: {
        //   './EmptyDemoModule':'.//src/app/modules/empty/emptydemo.module.ts',
       
          
        },

        shared:
        share({
          "@angular/core": { singleton: true, strictVersion: true, requiredVersion: false },
          "@angular/common": { singleton: true, strictVersion: true, requiredVersion: false },
          "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: false },
          "@angular/router": { singleton: true, strictVersion: true, requiredVersion: false },
          "@angular/forms": { singleton: true, strictVersion: true, requiredVersion: false },
          "rxjs": { singleton: true, strictVersion: true, requiredVersion: false },
          "primeng": { singleton: true, strictVersion: true, requiredVersion: false },
          "primeicons": { singleton: true, strictVersion: true, requiredVersion: false },
          "saned-shared-lib": { singleton: true, strictVersion: false, requiredVersion: false },
          "@ngx-translate/core": { singleton: true, strictVersion: true, requiredVersion: false },
          ...sharedMappings.getDescriptors()
        })
        // {
        //   ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
        // }


    }),
    sharedMappings.getPlugin()
  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
};
