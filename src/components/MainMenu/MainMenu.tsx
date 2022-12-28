import React, { useState } from "react";
import styled from "styled-components";
import { MainDiv } from "../../styles/globalStyles";
import MyCubes from "./MyCubes/MyCubes";
import PublicCubes from "./PublicCubes/PublicCubes";
import mainLogo from "../../assets/MiniCube.png"
import Profile from "./Profile/Profile";
 
type Props = {
    userId: string;
    authToken: string;
}

const MainMenu = (props: Props): JSX.Element => {
    const [menu, setMenu] = useState<boolean[]>([true, false, false])
    return(
        <CustomMain>
            <LeftDiv>
                <Img src={mainLogo}/>
                <Button state={menu[0]} onClick={() => setMenu([true, false, false])}>My Cubes</Button>
                <Button state={menu[1]} onClick={() => setMenu([false, true, false])}>Find Cubes</Button>
                <Button state={menu[2]} onClick={() => setMenu([false, false, true])}>Profile</Button>
            </LeftDiv>
            <RightDiv>
                {menu[0] ? 
                    <MyCubes authToken={props.authToken} creator={props.userId}/>
                    :
                    menu[1] ? <PublicCubes creator={props.userId} authToken={props.authToken}/> : <Profile/>
                }
            </RightDiv>
        </CustomMain>
    )
}

export default MainMenu

const CustomMain = styled.div`
    display: flex;
    flex-direction: row;
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
const RightDiv = styled.div`
    width: 80%;
`
const Img = styled.img`
    width: 100px;
    height: 100px;
    margin-bottom: 30px;
`
const Button = styled.button<{state: boolean}>`
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