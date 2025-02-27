**Angular angular-school App**

# New Saned Platform docker commands

docker build -t angular-school:v0.0.2 .
docker image tag angular-school:v0.0.2 demo.saned.kitsys.co/registry/saned-demo/angular-school:v0.0.2
docker push demo.saned.kitsys.co/registry/saned-demo/angular-school:v0.0.2

# add saned shared lib

\*\* if you want to add saned library to angular project that has not include the library run the following command

-   `git submodule add https://github.com/KitSysCo/saned-web-fe-shared-lib.git saned-shared-lib`

# if repo cloned with saned shared library

If you already cloned the project and forgot --recurse-submodules, you can combine the git submodule init and git submodule update steps by running git submodule update --init. To also initialize, fetch and checkout any nested submodules, you can use the foolproof

# Run the project

-   clone library repositry `git submodule update --init --recursive`
-   change directory to saned-shared-lib `cd saned-shared-lib`
-   install depandancies via npm `npm install`
-   run angular build command `npm run build`
-   change directory to the root `cd ..`
-   install depandancies in the root `npm install`
-   run angular serve command `ng serve`

Upgrade to 16 version

-   ng update @angular/cli
-   ng update ngx-build-plus
-   ng update @angular/material
-   ng update @angular/cdk
-   ng update @angular-architects/module-federation

Analyze Angular bundels

-   install this package via
-   `npm install webpack-bundle-analyzer -g` only one time globally
    In each Angular app
-   build the application `ng build --configuration production --stats-json`
-   run the following command `npx webpack-bundle-analyzer dist/project-name/stats.json`
