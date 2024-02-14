import styled from 'styled-components';
import { Link } from 'react-router-dom';
import BannerSlick from './bannerSlick';

const BannerContainer = styled.div`
  height: 450px;
  background-color: #ededed;
`;
const Container = styled.div`
  height: 450px;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;
const Img = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: cover;

  @media screen and (max-width: 768px) {
    width: auto;
    height: 120%;
  }
`;
const TextBox = styled.span`
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 60px;
  font-family: 'Black Han Sans', sans-serif;
  white-space: nowrap;
  span {
    font-size: 50px;
    color: gold;
  }
  @media screen and (max-width: 768px) {
    font-size: 46px;
    span {
      font-size: 36px;
    }
  }
`;

const Banner = () => {
  return (
    <>
      <BannerContainer>
        <BannerSlick>
          <Container>
            <Img
              src={`https://cdn.pixabay.com/photo/2023/06/13/09/27/ai-generated-8060484_1280.jpg`}
            />
            <TextBox>
              환경 보호의 날 기념 <br /> <span>EVENT</span>
            </TextBox>
          </Container>
          {/* <Link to={`/categorySetting`}>
            <Container>
              <Img
                src={`https://cdn.pixabay.com/photo/2023/06/13/09/27/ai-generated-8060484_1280.jpg`}
              />
              <TextBox>나</TextBox>
            </Container>
          </Link> */}
          <Link to={`/createCoupon`}>
            <Container>
              <Img
                src={`https://vrthumb.imagetoday.co.kr/2023/04/03/tid277t001541.jpg`}
              />
            </Container>
          </Link>
        </BannerSlick>
      </BannerContainer>
    </>
  );
};

export default Banner;
