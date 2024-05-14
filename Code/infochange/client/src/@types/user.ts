export interface User {
    profile : Profile,
    wallet : WalletItem[]
}

export interface Profile {
    ID: Number,
    username : String,
    password : String,
    name : String,
    surname : String,
    email : String,
    phone : String,
    document : String,
    address: String,
    postalCode: Number,
    country: String,
    balance : Number
}

export interface WalletItem {
    coin: String,
    quantity: Number
}

export function toUser(profile : Profile, wallet : WalletItem[]) : User{
    return {profile: profile, wallet: wallet}
}