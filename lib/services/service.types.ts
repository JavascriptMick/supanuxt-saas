import { User, Membership, Account } from '@prisma/client';
export type MembershipWithAccount = (Membership & {account: Account});
export type FullDBUser = (User & { memberships: MembershipWithAccount[]; });
export type MembershipWithUser = (Membership & { user: User});
export type AccountWithMembers = (Account & {members: MembershipWithUser[]});