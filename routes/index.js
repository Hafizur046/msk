//import all routes
const Home = require('./home.js')


//Routes Class
class RoutesConstructor{
    //construct the index route
    constructor(indexRoute){
        this.index = indexRoute;
    }

    //add route
    add(name, Route){
        this[name] = Route;
    }
}

const Routes = new RoutesConstructor(Home);

module.exports = Routes;