import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";

import {MainDivRe} from "../../../styles/globalStyles";
import TextArea from "../../others/TextArea";

import { UserRedux } from "../../../types/reduxTypes";
import {useDispatch, useSelector} from "react-redux"
import {logOut} from "../../../redux/userReducer"


const SET_LOGOUT: DocumentNode = gql`
    mutation LogOut($authToken: String!){
        logOut(authToken: $authToken)
    }
`

const Profile = (): JSX.Element => {
    const dispatch = useDispatch()

    const onLogOut = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
        e.preventDefault()
        dispatch(logOut({authToken: "", creator: ""}))
    }

    return (
        <div>
            <button onClick={onLogOut}>Log out</button>
        </div>
    )
}

export default Profile