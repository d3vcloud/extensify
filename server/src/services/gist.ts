import { Gist, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const updateGist = async (userId: string, data: Prisma.GistCreateInput): Promise<Gist> => {
  const res = await prisma.gist.update({
    where: {
      userId
    },
    data: {
      ...data
    }
  })
  return res
}

export const getGistByUser = async (userId: string) => {
  const gist = await prisma.gist.findUnique({
    where: {
      userId
    },
    select: {
      id: true,
      identify: true,
      version: true
    }
  })
  return gist
}
