"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth";
import { toast } from "@/hooks/use-toast";
import prisma from "@repo/db/client";
import { redirect } from "next/navigation";

export async function createOnRampTransaction( provider: string, amount: number){
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
        toast({
            title: "Unauthenticated request. Please sign in again.",
        });
        redirect("/api/auth/signin");
    }
    const token = (Math.random()*1000).toString();
    try {
        await prisma.onRampTransaction.create({
            data: {
                provider,
                status: 'Processing',
                startTime: new Date(),
                token: token,
                userId: Number(session?.user?.id),
                amount: amount*100
            }
        })
        return ({
            message: "onRampTransaction successfull"
        })
    } catch (error) {
        return ({
            error: "onRampTransaction failed"
        })
    }
}