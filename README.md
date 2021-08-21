<h1 align="center">Angular Template by mogree.</h1>

## Overview

- [Commands](#commands)
- [Enviroments](#enviroments)
- [Packages](#packages)

# Commands

| Command | Info |
| --- | --- |
| *start* | Start local development  |
| *build:dev* | Builds project with development mode enabled  |
| *build:prod* | Builds project for production  |
| *i18n:init* | Creates an empty template JSON for translations  |
| *i18n:extract* | Creates and merge JSON translation files for EN,DA,DE,FI,NB,NL,SV |
| *i18n:x:en* | Creates and merge JSON translation files for EN |

# Enviroments
1. For local development use the following file `src/assets/app-config.json`.
2. For deployment use the provided `app-configs` folder in the project root.

# Packages
| Package | Version | Info |
| --- | --- | --- |
| Angular | 10.1.5 |
| Material | 10.2.4 | 
| SubSink | 1.0.1 | Unsubsscribe all subscriptions with only one line of code [(Docs)](https://github.com/wardbell/subsink) [(John Papa/ng-conf Talk)](https://youtu.be/2ZFgcTOcnUg?t=161)
| MDI | 5.6.55 | [Material design icons library](https://materialdesignicons.com/)
| ngx-translate | 13.0.0 | To provide multilang support
| ngx-translate-extract | 7.0.3 | For easier extracting and creating translation files 
| ng-skeleton | 1.0.3 | Skeleton loading component [(Docs)](https://www.npmjs.com/package/ng-skeleton)
