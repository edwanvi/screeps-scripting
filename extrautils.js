var newsource = {
	run: function(creep) {
        if(Math.random() > 0.5){
           	creep.memory.energysource = 1;
        }
        else {
           	creep.memory.energysource = 0;
        }
        console.log(creep + ' will harvest source ' + creep.memory.energysource + ' for role ' + creep.memory.role);
	}
}
module.exports.newsource = newsource;