import { Link } from "react-router-dom";
import styled from "styled-components";

const NotFoundWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 30px;
  h1 {
    font-size: 50px;
    margin: 20px 0;
  }
  p {
    margin: 10px 0;
  }
  a {
    color: coral;
    &:hover{
      color: ${(props) => props.theme.black.lighter}
    }
  }
`;

function NotFound() {
  return (
    <NotFoundWrapper>
      <h1>404 Not Found</h1>
      <p>Can not find page</p>
      <Link to="/">Go Back Home</Link>
    </NotFoundWrapper>
  );
}

export default NotFound;