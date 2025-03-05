import Link from "next/link"
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <nav className="navbar">
        <div>Logo</div>
        {/* <div className="flex-between w-1/4">
            <Link href="/">Home</Link>
            <Link href="/VoterRegistration">VoterRegistrals</Link>
            <Link href="/ProposalRegistration">ProposalRegistration</Link>
            <Link href="/VoteStage">VoteStage</Link>
        </div> */}
        <div>Voting DAO</div>
        <ConnectButton />
    </nav>
  )
}

export default Header