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
          `tables/${userTableId}/records?where=(email,eq,${credentials.email})`
        );

        if (!usersData?.list || usersData.list.length === 0)
          throw new Error("Invalid email or password");

        const user = usersData.list[0];
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid email or password");
        if (user.isDeleted)
          throw new Error("Account has been deleted.");
        if (!user.active)
          throw new Error("Account is not active");
        if (user.role == "Agent") {
          if (user.agent_status == "Rejected") {
            throw new Error("Account is Rejected by Admin");
          }
          if (!user.admin_confirm)
            throw new Error("Account is not confirmed");
        }

        return {
          id: user.Id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          agent: user.Agent,
          company: user.Company,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).role = token.role;
        (session.user as any).agent = token.agent;
        (session.user as any).company = token.company;
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