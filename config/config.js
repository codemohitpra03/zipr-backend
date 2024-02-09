const config={
    production :{
        JWT_SECRET: process.env.JWT_SECRET,
        DATABASE: `${process.env.MONGO_URI}/shortner`
    },
    default : {
        JWT_SECRET: process.env.JWT_SECRET,
        DATABASE: `${process.env.MONGO_URI}/shortner`
    }
}


exports.get = function get(env){
    return config[env] || config.default
}