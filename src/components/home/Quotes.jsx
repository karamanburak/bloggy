
import { useState } from 'react';
import axios from 'axios';
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import { useEffect } from 'react';


const Quotes = () => {
    const [quote, setQuote] = useState('')

    const getQuote = async () => {
        try {
            const { data } = await axios('https://api.quotable.io/random')
            console.log(data);
            setQuote(data)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getQuote()
    }, [])



    return (
            <MDBContainer style={{color:"primary.main"}}>
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="9" xl="7">
                        <MDBCard style={{ borderRadius: "15px",color:"maroon"}}>
                            <MDBCardBody className="p-5">
                                    <MDBTypography blockquote>
                                        <p className="pb-3">
                                            <MDBIcon fas icon="quote-left text-primary" size="xs" />
                                            <span>
                                            {quote.content}
                                            </span>
                                            <MDBIcon fas icon="quote-right text-primary" size="xs" />
                                        </p>
                                    </MDBTypography>
                                    <figcaption className="blockquote-footer mb-0">
                                        {quote.author}
                                    </figcaption>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
    );
};

export default Quotes;
