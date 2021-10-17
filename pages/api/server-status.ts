import type { NextApiRequest, NextApiResponse } from 'next'
import mcUtils from 'minecraft-server-util'

const MC_SERVER_HOST = process.env.MC_SERVER_HOST
const MC_SERVER_PORT = process.env.MC_SERVER_PORT

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mcUtils.status(MC_SERVER_HOST!, {
    port: MC_SERVER_PORT ? parseInt(MC_SERVER_PORT) : 25565,
  })
    .then(serverStatus => {
      res.status(200).json(serverStatus)
    })
    .catch((error) => {
      console.error(error)
      res.status(204).json(null)
    })
}
