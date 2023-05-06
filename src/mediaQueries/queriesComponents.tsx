/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { useMediaQuery } from "react-responsive"

export const Desktop = ({ children }: any) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}
export const Tablet = ({ children }: any) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
}
export const Mobile = ({ children }: any) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
export const Default = ({ children }: any) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
}
