import { Prisma } from "../../prisma/generated/client"
import prismaClient from "./prismaClient"

const randomFirstName = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Abraham",
    "Jacob",
]

const randomLastName = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
]

const randomEmail = (firstName: string, lastName: string) => {
    const randomNumber = Math.floor(Math.random() * 1000)
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${
        randomNumber > 0 ? randomNumber : ""
    }@example.com`
}

const createUser = async () => {
    const firstName = randomFirstName[Math.floor(Math.random() * randomFirstName.length)] ?? "John"
    const lastName = randomLastName[Math.floor(Math.random() * randomLastName.length)] ?? "Doe"
    const email = randomEmail(firstName, lastName)

    const response = await prismaClient.user.create({
     data: {
         firstName,
         lastName,
         email,
         role: "USER",
         // Also creates profile along with the user
         profile: {
             create: {
                 bio: `Hello, my name is ${firstName} ${lastName}. I am a random user.`,
             }
         }
     }
    });

    return response;
}

const randomTitle = [
    "My First Post",
    "A Day in the Life",
    "Thoughts on TypeScript",
    "Exploring Prisma",
    "Hello World",
    "Random Musings",
    "Adventures in Coding",
    "The Joy of Programming",
    "Reflections on Life",
    "Tech Trends 2024",
]

const randomContent = [
    "This is a random post content.",
    "I love programming and technology.",
    "TypeScript is a powerful language for building scalable applications.",
    "Prisma makes database access easy and efficient.",
    "Hello, world! This is my first post.",
    "Random thoughts and musings on various topics.",
    "Exploring new technologies and frameworks is always exciting.",
    "Sharing my experiences and insights on software development.",
    "The journey of learning never ends.",
    "Staying updated with the latest trends in tech is essential.",
]

const createPost = async (userId?: string) => {
    if (!userId) {
      throw new Error("userId is required");
    }

    const title = randomTitle[Math.floor(Math.random() * randomTitle.length)] ?? "Untitled Post"
    const content = randomContent[Math.floor(Math.random() * randomContent.length)] ?? "No content available."

    const response = await prismaClient.post.create({
        data: {
            title,
            userId,
            content
        }
    });

    return response;
}

export {
    createUser,
    createPost,
}
