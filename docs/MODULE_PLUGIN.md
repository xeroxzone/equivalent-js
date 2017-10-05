# The Module Plugin

A module plugin is a loose coupled module class and their dependencies which loaded into core framework stack.

The test and doc runner includes all plugin module classes if they are loaded into DIC.

## How to install a plugin for EquivalentJS

A module plugin get installed as package e.g. with [npmjs][npmjs].

The package name pattern is like regular expression 

```regexp
^equivalent-js-plugin-[a-z0-9-]{2,}$
```
 
in lowercase.

After that append the plugin name and enabled state to [*parameters.json*](../src/config/parameters.json).

## How to build a plugin for EquivalentJS

### The plugin directory scaffold

A *plugin.json* file and the following *src* folder structure are the minimum required structure.

    /plugin.json
    /src/lib/
    /src/test/lib/

All other structures and module classes for the plugin are free to organize.

### Plugin config file *plugin.json*

e.g.

```json
{
  "name": "equivalent-js-plugin-my-plugin",
  "type": "EquivalentJS.Plugin.MyPlugin",
  "classPath": "src/lib",
  "testPath": "src/test/lib"
}
```

* Name of the plugin package by above described name pattern
* Type string starts with *EquivalentJS.Plugin.*
* Path to folder of initial plugin module class is defined at *classPath*
* Path to folder of initial plugin module class test case is defined at *testPath*

### Plugin module class

Any module class implements the 
module class interface [{EquivalentJs.Manager.Module.class}](../src/lib/equivalent/Manager/Module/class.js)

[npmjs]: https://www.npmjs.com
