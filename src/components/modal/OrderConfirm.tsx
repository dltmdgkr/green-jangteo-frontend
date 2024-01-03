import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { userIdState } from '../../store/atom/auth';

const OrderConfirm = ({ setModalOpen }: any) => {
  const userId = useRecoilValue(userIdState);
  const closeModal = () => {
    setModalOpen(false);
  };
  const navigate = useNavigate();
  const sucess = () => {
    navigate(`/users/${userId}/profile`);
  };

  return (
    <Modal>
      <ModalBox>
        <Content>주문이 완료되었습니다.</Content>
        <BtnBox>
          <Btn onClick={sucess} className="confirm">
            확인
          </Btn>
          <Btn onClick={closeModal}>취소</Btn>
        </BtnBox>
      </ModalBox>
    </Modal>
  );
};

export default OrderConfirm;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

const ModalBox = styled.div`
  width: 80%;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  overflow: hidden;
`;
const Content = styled.p`
  display: flex;
  height: 150px;
  align-items: center;
  justify-content: center;
  line-height: 2rem;
`;
const Btn = styled.button`
  flex: 1;
  padding: 15px 0;
  border: none;
  background-color: #dedede;
  font-size: inherit;
  cursor: pointer;

  &.confirm {
    background-color: var(--maincolor);
    color: #ffffff;
  }
`;
const BtnBox = styled.div`
  display: flex;
`;
