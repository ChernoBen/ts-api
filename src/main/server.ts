import {MongoHelper} from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl).then(async ()=>{
    //garantir a nao importacao de modulos que dependem do banco de dados antes do banco estar conectado
    const app = (await (import('./config/app'))).default
    //garantindo que o server rode apenas apos a conexao com o banco
    app.listen(env.port,()=>console.log(`Server running at http://localhost:${env.port}`))
}).catch(console.error)