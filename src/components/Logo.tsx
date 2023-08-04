import LogoSVG from "@/components/Logo.svg"
import Image from "next/image"

// LogoProps must have next/image props
type LogoProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt">

const Logo: React.FC<LogoProps> = (props) => <Image {...props} src={LogoSVG} alt="Aurory logo" />

export default Logo
