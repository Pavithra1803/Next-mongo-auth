import Otp from "@/models/Otp";

const OTP_LIMIT_PER_DAY = 5;
const RESEND_COOLDOWN_SECONDS = 60;

export async function canSendOtp(userId:string){
    const today =new Date();
    today.setHours(0,0,0,0); // for counting the number of otp's generated today 
    //we will get the current time ,and we need to check from the day start.

    const count= await Otp.countDocuments({
        userId,
        createdAt :{$gte: today}, //gte-greater than equal to 
    });

    if(count >= OTP_LIMIT_PER_DAY){
        return {
            allowed:false,
            message: "OTP limit reached for today"
        }
    }

    const lastOtp = await Otp.findOne({userId}).sort({createdAt: -1}); // -1 descending order

    if(lastOtp) {
        const diff =(Date.now() - lastOtp.createdAt.getTime())/1000;

    if(diff < RESEND_COOLDOWN_SECONDS ){
        return {
            allowed:false,
            message: `Please wait ${Math.ceil(
                RESEND_COOLDOWN_SECONDS - diff
            )} seconds before resending OTP`,
        };
    }
}
return {allowed: true};
}