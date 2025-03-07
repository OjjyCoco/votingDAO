// pour le logo
import Image from "next/image";

const Footer = () => {
    return (
      <footer className="footer">
        <Image
          className="dark:invert"
          src="/votingDAOlogoWhite.svg"
          alt="Livret+ logomark"
          width={300}
          // height is useless but necessary
          height={1}
        />
        <p>-- All rights reserved &copy; VotingDAO {new Date().getFullYear()} --</p>
      </footer>
    )
  }
  
  export default Footer