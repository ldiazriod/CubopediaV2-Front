import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MyCubes from "./MyCubes/MyCubes";
import PublicCubes from "./PublicCubes/PublicCubes";
import mainLogo from "../../assets/MiniCube.png"
import Profile from "./Profile/Profile";
import { DocumentNode } from "graphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { logOut } from "../../redux/userReducer";
import { useDispatch } from "react-redux";
import { Default, Desktop, Mobile } from "../../mediaQueries/queriesComponents";
import { isMobile } from "../../mediaQueries/queriesStates";

type Props = {
    userId: string;
    authToken: string;
}

type UserInfo = {
    email: string,
    verified: boolean
}

const GET_USER: DocumentNode = gql`
    query getUser($authToken: String!){
        getUser(authToken: $authToken){
            email,
            verified
        }
    }
`
const SEND_MAIL: DocumentNode = gql`
    mutation sendMail($authToken: String!){
        sendMail(authToken: $authToken)
    }
`

const MainMenu = (props: Props): JSX.Element => {
    const dispatch = useDispatch()
    const isMobileState = isMobile()
    const [menu, setMenu] = useState<boolean[]>([true, false, false])
    const { data, error, loading } = useQuery<{ getUser: UserInfo }>(GET_USER, {
        variables: {
            authToken: props.authToken
        }
    })
    const [sendMail] = useMutation(SEND_MAIL, {
        variables: {
            authToken: props.authToken
        }
    })
    if (error) console.log(error)

    useEffect(() => {

        if (data && !data.getUser.verified) {
            sendMail()
        }
    }, [data])
    if (data && !data.getUser) {
        dispatch(logOut({ authToken: "", creator: "" }))
    }
    const onClickMenuButton = (index: number) => {
        setMenu(menu.map((_, i) => i === index ? true : false))
    }

    return (
        <>
            {data && (data.getUser.verified ?
                <>
                    <Mobile>
                        <TopDiv>
                            <Button style={{width: "30%"}} state={menu[0]} onClick={() => onClickMenuButton(0)}>My Cubes</Button>
                            <Button style={{width: "30%"}} state={menu[1]} onClick={() => onClickMenuButton(1)}>Find Cubes</Button>
                            <Button style={{width: "30%"}} state={menu[2]} onClick={() => onClickMenuButton(2)}>Profile</Button>
                        </TopDiv>
                    </Mobile>
                    <CustomMain screenSize={isMobileState}>
                        <Default>
                            <LeftDiv>
                                <Img src={mainLogo} />
                                <Button state={menu[0]} onClick={() => onClickMenuButton(0)}>My Cubes</Button>
                                <Button state={menu[1]} onClick={() => onClickMenuButton(1)}>Find Cubes</Button>
                                <Button state={menu[2]} onClick={() => onClickMenuButton(2)}>Profile</Button>
                            </LeftDiv>
                        </Default>
                        <RightDiv screenSize={isMobileState}>
                            {menu[0] ?
                                <MyCubes authToken={props.authToken} creator={props.userId} />
                                :
                                menu[1] ? <PublicCubes creator={props.userId} authToken={props.authToken} /> : <Profile authToken={props.authToken} creator={props.userId} />}
                        </RightDiv>
                    </CustomMain>
                </>
                : <div>Verify Your Email</div>)}
        </>
    )
}

export default MainMenu

const CustomMain = styled.div<{ screenSize: boolean }>`
    display: flex;
    flex-direction: ${props => props.screenSize ? "column" : "row"};
    width: 100%;
    height: 100%;
    min-height: 100vh;
    padding-bottom: 10px;
    padding-top: 20px;
`
const LeftDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 15%;
`
const TopDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 0px;
    left: 5%;
    width: 100%;
    background: #f4f4f4;
    z-index: 1;
`
const RightDiv = styled.div<{screenSize: boolean}>`
    width: ${props => props.screenSize ? 100 : 80}%;
`
const Img = styled.img`
    width: 100px;
    height: 100px;
    margin-bottom: 30px;
`
const Button = styled.button<{ state: boolean }>`
    background: ${props => props.state ? "#b31860" : "transparent"};
    color: ${props => props.state ? "white" : "black"};
    border-radius: 10px;
    font-size: 17px;
    font-weight: 700;
    border: transparent;
    width: 90%;
    height: auto;
    padding: 15px;
    box-shadow: ${props => props.state ? "0px 5px 5px #07070794;" : "none"};
    margin-bottom: 20px;
    margin-top: 20px;
`