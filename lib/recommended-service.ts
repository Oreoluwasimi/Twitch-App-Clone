import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export const getRecommended = async () => {

    // await new Promise(resolve => setTimeout(resolve, 3000));

    let userId;

    try {
      const self = await getSelf();
      userId = self.id;
    } catch {
      userId = null;
    }

    let users = [];

    if(userId) {
        users = await db.user.findMany({
            where: {
              AND: [
                {
                  NOT:{
                    id: userId,
                },
              },
              {
                NOT:{
                  followedBy: {
                    some: {
                      followerId: userId,
                    },
                  },
              },
              },   
              {
                NOT:{
                  blocking: {
                    some: {
                      blockedId: userId,
                    },
                  },
              },
              },      

              ],          
            },
            include: {
              stream: {
                select: {
                  isLive: true,
                }
              },
            },
            orderBy: {
                createdAt: "desc"
            },
        });
    } else { 
        users = await db.user.findMany({
          include: {
            stream: {
              select: {
                isLive: true,
              },
            },
          },
          orderBy: {
              createdAt: "desc"
          },
        });
    }
 /*  let userId;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let users = [];

  if (userId) {
    users = await db.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: userId,
            },
          },
          {
            NOT: {
              followedBy: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          {
            NOT: {
              blocking: {
                some: {
                  blockedId: userId,
                },
              },
            },
          },
        ],
      },
      include: {
        stream: {
          select: {
            isLive: true,
          },
        },
      },
      orderBy: [
        {
          stream: {
            isLive: "desc",
          }
        },
        {
          createdAt: "desc"
        },
      ]
    })
  } else {
    users = await db.user.findMany({
      include: {
        stream: {
          select: {
            isLive: true,
          },
        },
      },
      orderBy: [
        {
          stream: {
            isLive: "desc",
          }
        },
        {
          createdAt: "desc"
        },
      ]
    });
  } */

  return users;
};