interface User {
    profile : {
        username : String,
        name : String,
        lastname : String,
        country : String,
        address : String,
    },
    wallet : [
        {
            coin : String,
            quantity : Number
        }
    ]
}

export function toUser(profile : any, wallet : any) : User{
    return {profile: profile, wallet: wallet}
}