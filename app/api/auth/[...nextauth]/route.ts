import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
        name:"Credentials",

        credentials:{
            email:{label:"Email", type:"text"},
            password:{label:"Password", type:"password"}
        },

        async authorize(credentials){
            if(!credentials?.email ||!credentials?.password){
                return null;
            }
            await connectDB();

            const user = await User.findOne({
            email: credentials.email.toLowerCase(),
            }).select("+password");

            if (!user) return null;

            if (!user.isVerified) {
                throw new Error("ACCOUNT_NOT_VERIFIED");
            }

            const isMatch = await bcrypt.compare(
                credentials.password,
                user.password
            )

            if(!isMatch) return null;

            return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
    }

    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {

    async signIn({ user, account }) {
      if (account?.provider === "google" || "github") {
        await connectDB();

        const email = user.email?.toLowerCase();
        if (!email) return false;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          await User.create({
            email,
            name: user.name,
            authProvider: `${account?.provider}`,
            isVerified: true,
          });
        }

        return true;
      }

      return false;
    },


    async redirect({ url, baseUrl }) {

      return `${baseUrl}/oauth-callback`;
    },
  },
});

export { handler as GET, handler as POST };
