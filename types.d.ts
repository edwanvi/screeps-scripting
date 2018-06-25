// type shim for nodejs' `require()` syntax
// for stricter node.js typings, remove this and install `@types/node`
declare const require: (module: string) => any;

// add your custom typings here
declare interface CreepMemory { [name: string]: any };
declare interface FlagMemory { [name: string]: any };
declare interface SpawnMemory { [name: string]: any };
declare interface RoomMemory { [name: string]: any };
