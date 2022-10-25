import styled, { StyledComponent } from "styled-components";

const MainDiv: StyledComponent<"div", any, {}, never> = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    min-height: 100vh;
    width: 100%;
    min-width: 100vw;
    background-color: #F5F5F5;
`
export default MainDiv