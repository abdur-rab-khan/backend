import prismaClient from "./prismaClient";

const getPosts = async (userId?: string) => {
  if (!userId) {
      throw new Error("userId is required");
  }

    const posts = await prismaClient.post.findMany({
      where: {
            userId: userId,
      },
      // Automatically joins the user to the post
      include: {
        user: true
      },
      omit: {
        userId: true
      }
    });

    return posts;
}

const getUserById = async (userId?: string) => {
  if (!userId) {
      throw new Error("userId is required");
    }

    const user = await prismaClient.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            profile: true,
            posts: true,
        }
    });

    return user;
}


export { getPosts, getUserById }
