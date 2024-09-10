import logo from "../assets/logo.png"
import './Header.css';

const Header = () => {
    return(
       <div className="header">
        <img src={logo}></img>
       </div>
    )
}

export default Header;