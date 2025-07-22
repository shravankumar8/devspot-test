// import {Prisma, PrismaClient} from "@prisma/client";

// const prisma = new PrismaClient();

// const initialRoles: Prisma.RoleCreateInput[] = [
//     {
//         role_name: 'hacker'
//     },
//     {
//         role_name: 'mentor'
//     },
//     {
//         role_name: 'organizer'
//     },
// ]

// const initialUsers: Prisma.UserCreateInput[] = [
//     {
//         username: 'therealcarl',
//         email: "wheezer.carl@gmail.com",
//         first_name: "Carl",
//         last_name: "Wheezer",
//         is_open_to_work: true,
//         role: {
//             connectOrCreate: {
//                 where: {
//                     role_name: 'hacker'
//                 },
//                 create: {
//                     role_name: 'hacker'
//                 }
//             }
//         }
//     },
//     {
//         username: 'zezima',
//         email: "runescape@gmail.com",
//         first_name: "Zezima",
//         last_name: "Smith",
//         role: {
//             connectOrCreate: {
//                 where: {
//                     role_name: 'hacker'
//                 },
//                 create: {
//                     role_name: 'hacker'
//                 }
//             }
//         }
//     },
//     {
//         username: 'theyank87',
//         email: "yanky@yahoo.com",
//         first_name: "Mike",
//         last_name: "Yank",
//         role: {
//             connectOrCreate: {
//                 where: {
//                     role_name: 'organizer'
//                 },
//                 create: {
//                     role_name: 'organizer'
//                 }
//             }
//         }
//     },
//     {
//         username: 'smesh',
//         email: "undefeated@hotmail.com",
//         first_name: "Khabib",
//         last_name: "Nurmagomedov",
//         is_open_to_work: false,
//         role: {
//             connectOrCreate: {
//                 where: {
//                     role_name: 'mentor'
//                 },
//                 create: {
//                     role_name: 'mentor'
//                 }
//             }
//         }
//     },

// ]

// async function main() {
//     console.log('Start seeding...');

//     for (const role of initialRoles) {
//         const newRole = await prisma.role.upsert({
//             where: {role_name: role.role_name},
//             update: {},
//             create: role
//         })
//         console.log(`Created role '${newRole.role_name}' with id: ${newRole.id}`)
//     }

//     for (const user of initialUsers) {
//         const newUser = await prisma.user.upsert({
//             where: {username: user.username},
//             update: {},
//             create: user
//         })
//         console.log(`Created user '${newUser.username}' with id: ${newUser.id}`);
//     }

//     console.log('Seeding finished.');
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
