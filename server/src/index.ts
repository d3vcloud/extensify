import express, { json, Request, Response } from 'express'
import cors from 'cors'
import { createUser, getUser, addGist, filterUsers, follow, listFollowers } from './services/user'
import { getGistByUser, updateGist } from './services/gist'

require('dotenv').config()

const app = express()

app.use(cors({ origin: '*' }))
app.use(json())

app.get('/', (_, res: Response) => {
  res.send('Hello World from server')
})

app.post('/gist', async (req: Request, res: Response) => {
  const { userId, identify, version, isUpdate } = req.body
  try {
    const user = await getUser(String(userId))
    let resp
    if (!user) return res.json({ ok: false, msg: 'User not found' }).status(404)

    const gistData: any = {
      identify,
      version
    }

    if (!isUpdate) resp = await addGist(user.id, gistData)
    else resp = await updateGist(user.id, gistData)

    if (!resp)
      return res.json({ ok: false, msg: 'Your gist could not be saved. Try again.' }).status(404)

    return res.json({ ok: true }).status(201)
  } catch (error) {
    console.error(error)
    return res.json({ ok: false }).status(501)
  }
})

app.get('/filter', async (req: Request, res: Response) => {
  try {
    const { q, cursor } = req.query
    const query = q as string
    const newCursor = cursor as string
    const results = await filterUsers(query, newCursor)
    return res.json({ ok: true, data: results }).status(201)
  } catch (error) {
    console.error(error)
    return res.json({ ok: false, msg: 'An error has ocurred in the server' }).status(501)
  }
})

app.post('/user', async (req: Request, res: Response) => {
  try {
    const userData = req.body
    const userCreated = await createUser(userData)
    if (!userCreated) {
      return res.json({ ok: false, msg: 'Error during user creation.' }).status(501)
    }

    return res.json({ ok: true, data: userCreated }).status(201)
  } catch (error) {
    console.log(error)
    return res.json({ ok: false, msg: 'An error has ocurred in the server.' }).status(501)
  }
})

app.get('/gist/:gitHubId', async (req: Request, res: Response) => {
  try {
    const { gitHubId } = req.params
    const user = await getUser(gitHubId)
    if (!user) return res.json({ ok: false, msg: 'User not found' }).status(404)

    const { id } = user
    const gist = await getGistByUser(id)

    return res.json({ ok: true, data: gist }).status(200)
  } catch (error) {
    console.error(error)
    return res.json({ ok: false }).status(501)
  }
})

app.post('/follow', async (req: Request, res: Response) => {
  const { followerId, gitHubId } = req.body
  try {
    const user = await getUser(String(gitHubId))

    if (!user) return res.json({ ok: false, msg: 'User not found' }).status(404)

    const follower = await getUser(String(followerId))
    const resp = await follow(user.id, follower?.id!)

    if (!resp)
      return res.json({ ok: false, msg: 'Your follow could not be saved. Try again.' }).status(404)

    return res.json({ ok: true, data: follower }).status(201)
  } catch (error) {
    console.error(error)
    return res.json({ ok: false }).status(501)
  }
})

app.get('/followers', async (req: Request, res: Response) => {
  const { q } = req.query
  try {
    const user = await getUser(String(q))

    if (!user) return res.json({ ok: false, msg: 'User not found' }).status(404)
    const followers = await listFollowers(String(q))

    return res.json({ ok: true, data: followers }).status(200)
  } catch (error) {
    console.error(error)
    return res.json({ ok: false, msg: 'An error has ocurred in the server' }).status(501)
  }
})

app.listen(process.env.PORT, () => {
  console.log('Listen on port 3001')
})
