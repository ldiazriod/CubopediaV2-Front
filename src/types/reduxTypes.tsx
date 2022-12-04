import React from "react";

export type UserRedux = {
    user: {
        authToken: string,
        creator: string
    }
    isLoggedIn: boolean
}