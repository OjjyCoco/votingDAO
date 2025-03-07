import Link from "next/link"
import { ConnectButton } from '@rainbow-me/rainbowkit'

// pour le logo
import Image from "next/image";

// navbar
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"


const Header = () => {

  
  return (
    <nav className="navbar">
        <Image
          className="dark:invert"
          src="/votingDAOlogoBlack.svg"
          alt="Livret+ logomark"
          width={200}
          // height is useless but necessary
          height={1}
        />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>DAO</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        {/* <Icons.logo className="h-6 w-6" /> */}
                        <div className="mb-2 mt-4 text-lg font-medium">
                          DAO
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Un peu de blabla pour décrire les protocols du DAO
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {/* <ListItem href="/docs" title="Introduction">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem> */}
                    <Link href="/docs" className="block p-2 text-sm font-medium hover:underline">
                      <strong>Voting</strong>
                      <p>Description</p>
                    </Link>
                    <Link href="/docs" className="block p-2 text-sm font-medium hover:underline">
                      <strong>DeFi Wars</strong>
                      <p>Description</p>
                    </Link>
                    <Link href="/docs" className="block p-2 text-sm font-medium hover:underline">
                      <strong>Pas d'inspi</strong>
                      <p>Description</p>
                    </Link>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Doc
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/uni" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Uni
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <ConnectButton />
    </nav>
  )
}

export default Header