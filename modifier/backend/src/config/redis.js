const {createClient} = require('redis')

const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.on('error',(err)=>{
    console.log('error redis',err.message);
})

const connectRedis= async()=>{
    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log('redis connected');
        
    }
}

module.exports = {
    redisClient,connectRedis
}