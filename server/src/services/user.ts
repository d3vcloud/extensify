import { Prisma, User } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const createUser = async (user: Prisma.UserCreateInput): Promise<User> => {
  const createUser = await prisma.user.upsert({
    where: {
      gitHubId: user.gitHubId
    },
    update: {
      name: user.name,
      username: user.username,
      photoUrl: user.photoUrl
    },
    create: {
      ...user
    }
  })
  return createUser
}

export const getUser = async (gitHubId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      gitHubId
    },
    select: {
      id: true,
      name: true,
      username: true,
      photoUrl: true,
      gitHubId: true,
      gist: {
        select: {
          id: true,
          identify: true
        }
      }
    }
  })
  return user
}

export const addGist = async (userId: string, gist: Prisma.GistCreateInput): Promise<User> => {
  const res = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      gist: {
        create: {
          ...gist
        }
      }
    }
  })
  return res
}

// Check the documentation out: https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
export const filterUsers = async (query: string, myCursor?: string): Promise<User[]> => {
  const queryObject: any = {
    take: 20,
    where: {
      username: {
        contains: query
      },
      NOT: {
        gist: null
      }
    },
    select: {
      id: true,
      name: true,
      username: true,
      photoUrl: true,
      gitHubId: true,
      gist: {
        select: {
          id: true,
          identify: true
        }
      }
    }
  }

  // If we have cursor, it is mandatory to add it to the query
  if (myCursor) {
    const cursor = {
      id: myCursor
    }
    queryObject.skip = 1 // we want to skip the current cursor result
    queryObject.cursor = cursor
  }

  const results = await prisma.user.findMany(queryObject)
  return results
}

export const follow = async (gitHubId: string, followerGitHubId: string) => {
  const res = await prisma.user.update({
    where: {
      gitHubId
    },
    data: {
      followers: {
        connect: {
          gitHubId: followerGitHubId
        }
      }
    }
  })
  return res
}

export const unfollow = async (gitHubId: string, followerGitHubId: string) => {
  const res = await prisma.user.update({
    where: {
      gitHubId
    },
    data: {
      followers: {
        disconnect: {
          gitHubId: followerGitHubId
        }
      }
    }
  })
  return res
}

export const listFollowers = async (gitHubId: string) => {
  const res = await prisma.user.findMany({
    where: {
      gitHubId
    },
    select: {
      id: true,
      name: true,
      followers: {
        select: {
          id: true,
          name: true,
          username: true,
          photoUrl: true,
          gitHubId: true,
          gist: true
        }
      }
    }
  })
  return res
}
