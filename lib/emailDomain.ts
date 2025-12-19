import dns from 'dns/promises';

export async function isEmailDomainValid(email:string): Promise<boolean>{
    try{
        const domain =email.split("@")[1];
        if(!domain){
            return false;
        }

        const records = await dns.resolveMx(domain);

        return records && records.length >0;

    }catch(error){
        return false;
    }

}