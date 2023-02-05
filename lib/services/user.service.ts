import { PrismaClient } from '@prisma/client';
import { UtilService } from './util.service';

const TRIAL_PLAN_NAME = '3 Month Trial';  // TODO - some sort of config.. this will change for every use of the boilerplate

export default class UserService {
  private prisma: PrismaClient;

  constructor( prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getUserBySupabaseId(supabase_uid: string) {
    return this.prisma.user.findFirst({ where: { supabase_uid }, include: { membership: true } });
  }

  async getUserById(id: number) {
    return this.prisma.user.findFirstOrThrow({ where: { id }, include: { membership: true } });
  }

  async createUser( supabase_uid: string, display_name: string ) {
    const trialPlan = await this.prisma.plan.findFirstOrThrow({ where: { name: TRIAL_PLAN_NAME}});
    return this.prisma.user.create({
      data:{
        supabase_uid: supabase_uid,
        display_name: display_name,
        membership: {
          create: {
            account: {
              create: {
                plan_id: trialPlan.id,  
                name: display_name,
                features: trialPlan.features, //copy in features from the plan, plan_id is a loose association and settings can change independently
                current_period_ends: UtilService.addMonths(new Date(),3),                  
              }
            }
          }
        }
      },
      include: { membership: true },
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
