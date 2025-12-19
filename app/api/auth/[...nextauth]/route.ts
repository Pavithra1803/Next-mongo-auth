import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        const email = user.email?.toLowerCase();
        if (!email) return false;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          await User.create({
            email,
            name: user.name,
            authProvider: "google",
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
