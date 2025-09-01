// Creating multiple Prisma Client instances can lead to connection pool exhaustion
// The globalThis approach prevents Next.js hot reloading from creating multiple Prisma Client instances, 
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
declare global {
    //In simpler terms: ReturnType<typeof prismaClientSingleton> will evaluate to the type that prismaClientSingleton() returns,
    // which is PrismaClient.
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton> // declare globally prisma so that it doesnt 
  // recreates after every hot reload in dev mode.
}

const prismaClient:PrismaClientSingleton = globalThis.prismaGlobal?? prismaClientSingleton();
//t checks if globalThis.prismaGlobal already has a value (i.e., it's not null or undefined).
// if it is null or undefined then it calls singleton() fn to initialze new prismaclient()
// if globalThis have stores prismaClient() then that will be used
export default prismaClient;
