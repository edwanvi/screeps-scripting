class ExUt {
    
    private static sources: Source[];

    public static newSource(creep: Creep) {
        if (Math.random() > 0.5) {
            creep.memory["energysource"] = 1;
        } else {
            creep.memory["energysource"] = 0;
        }
        console.log(creep + ' will harvest source ' + creep.memory.energysource + ' for role ' + creep.memory.role);
    }

    public static getSources(spawn: StructureSpawn) {
        if (ExUt.sources == null || ExUt.sources.length == 0) {
            ExUt.sources = spawn.room.find(FIND_SOURCES);
        }
        return ExUt.sources;
    }
}

export { ExUt };
export { ExUt as ExtraUtils };
