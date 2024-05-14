// @types.payment.ts

export interface Cart{
    type : String,
    quantity : Number,
    price? : Number
}

export interface PaymentResponse{
    feedback : String
}