# packi | Maybe the easiest Project initializer

[![Npm Package Info](https://badge.fury.io/js/packi.svg)](https://www.npmjs.com/package/packi) [![Downloads](https://img.shields.io/npm/dw/packi.svg?style=flat)](https://www.npmjs.com/package/packi)

## Abstract

If yeoman is too complicated for you, try packi.

If you use @xxx/cli but want a custom project scaffold, try packi.

## Install

``` shell
npm install packi -save
```

## Usage

To create a project, there are only 3 steps.

### Step 1: Add a gihub archive or release URL as project template.

``` shell
pki add tslib https://github.com/yusangeng/packi-template-tslib/archive/master.zip
```

### Step 2: Make an empty dir.

``` shell
mkdir foobar && cd foobar
```

### Step 3: Create scaffold with a template name and a project name.

``` shell
pki init tslib foobar
```

Witout a project name, `pki init` takes dir name as project name.

## Note

* Packi uses ejs as template engine of project template.
* Packi only takes js/jsx/ts/tsx/md/json/css/less/sass/html/vue files as ejs template files.
