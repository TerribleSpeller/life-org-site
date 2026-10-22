import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";
import NavBar from '../components/navbar';


export default function App({ Component, pageProps }) {
  return (
    <>
      <div className="newBodyColor">

        <NavBar />
        <div id="content" className="container ">
          <Component {...pageProps} />

        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />


      </div>

    </>
  )
}
