import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import categoryRouter from './routes/category.js'

const app = express()
app.use(express.json())
app.use(cors())

async function main() {
  await mongoose.connect('mongodb://localhost:27017/zxm')
  
}

main()


app.use('/api/category', categoryRouter)

app.listen(3000, () => {
  console.log('server on')
})