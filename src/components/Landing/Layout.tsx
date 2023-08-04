import Footer from "./Footer"
import { HeaderMenu } from "./HeaderMenu"

const LandingLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <>
        <HeaderMenu />
        {children}
        <Footer />
    </>
}

export default LandingLayout
