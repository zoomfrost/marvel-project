import ErrorMessage from "../errorMessage/ErrorMessage";
import {Link, useLocation} from 'react-router-dom';


const Page404 = () => {
    let location = useLocation();
    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page {location.pathname} doesn't exist</p>
            <Link to='/' style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}}>Back to home page</Link>
        </div>
    )
}

export default Page404;