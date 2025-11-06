import { APIRequest } from "@/components/api/apirequest";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "process";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tableId: { label: "tableId", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Please enter email and password");

        const userTableId = credentials?.tableId;
        if (!userTableId) throw new Error("User table not found");

        const usersData = await APIRequest(
          "GET",
          `tables/${userTableId}/records?where=(email,eq,${credentials.email})&nested[Agent][fields]=company_VAT,agent_country,Id,agent_name,company_name,location,phone_number,pseudo_name,identity_proof&nested[Company][fields]=contactPersonName`
        );

        if (!usersData?.list || usersData.list.length === 0)
          throw new Error("Invalid email or password");

        const user = usersData.list[0];

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid email or password");

        if (user.isDeleted) throw new Error("Account has been deleted.");
        if (!user.active) throw new Error("Account is not active");

        if (user.role === "Agent" || user.role === "GovernmentBody") {
          if (user.agent_status === "Rejected")
            throw new Error("Account is rejected by admin");

          if (!user.admin_confirm)
            throw new Error("Account is not confirmed");
        }

        if (user.isFirstLogin === 1) {
          throw new Error(
            JSON.stringify({
              requirePasswordChange: true,
              token: user.resetToken,
            })
          );
        }

        return {
          id: user.Id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          agent: user.Agent,
          company: user.Company,
          pseudo_name: user?.Agent?.pseudo_name,
          contactPersonName: user?.Company?.contactPersonName || null,
          stripeAccountId: user?.stripeAccountId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role;
        token.agent = (user as any).agent;
        token.company = (user as any).company;
        token.pseudo_name = (user as any).pseudo_name;
        token.contactPersonName = (user as any).contactPersonName;
        token.stripeAccountId = (user as any).stripeAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).agent = token.agent;
        (session.user as any).company = token.company;
        (session.user as any).pseudo_name = token.pseudo_name;
        (session.user as any).contactPersonName = token.contactPersonName;
        (session.user as any).stripeAccountId = token.stripeAccountId;
      }
      return session;
    },

    async signIn({ user }) {
      const cookieStore = cookies();
      (await cookieStore).set("user_role", (user as any).role || "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 2 * 24 * 60 * 60,
        path: "/",
      });
      return true;
    },
  },

  events: {
    async signOut() {
      const cookieStore = cookies();
      (await cookieStore).delete("user_role");
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
