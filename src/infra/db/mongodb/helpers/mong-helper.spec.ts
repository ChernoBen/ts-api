import { MongoHelper as sut } from "./mongo-helper"

describe('Mongo helper',()=>{
    beforeAll(async()=>{
        await sut.connect(process.env.MONGO_URL)    
    })
    afterAll(async()=>{
        await sut.disconnect()
    })

    test('shoul reconnect if mongodb is down',async()=>{
        let accountCollection = sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
    })
})