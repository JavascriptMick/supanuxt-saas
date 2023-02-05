import { PrismaClient } from '@prisma/client';
import type { inferAsyncReturnType } from '@trpc/server'
import { H3Event } from 'h3';
import { serverSupabaseClient } from '#supabase/server';
import SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';
import { User } from '@supabase/supabase-js';
import UserService from '~~/lib/services/user.service';

let prisma: PrismaClient | undefined
let supabase: SupabaseClient | undefined
let user: User | null = null;
let dbUser: any | undefined

export async function createContext(event: H3Event){
  if (!supabase) {
    supabase = serverSupabaseClient(event)
  }
  if (!user) {
    ({data: { user }} = await supabase.auth.getUser());
  }
  if (!prisma) {
    prisma = new PrismaClient()
  }
  if (!dbUser && user) {
    const userService = new UserService(prisma);
    dbUser = await userService.getUserBySupabaseId(user.id);
    
    if (!dbUser && user) {
      dbUser = await userService.createUser( user.id, user.user_metadata.full_name );
      console.log(`\n Created user \n ${JSON.stringify(dbUser)}\n`);
    }
  }

  // TODO - This seems excessive, trim context when I have figured out what I actually need
  return {
    supabase,
    user,
    prisma,
    dbUser,
  }  
};

export type Context = inferAsyncReturnType<typeof createContext>