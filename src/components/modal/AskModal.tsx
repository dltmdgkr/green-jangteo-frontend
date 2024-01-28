import styled from 'styled-components';

interface AskModalProps {
  onConfirm: () => void;
  onClose: () => void;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

export default function AskModal({
  onConfirm,
  onClose,
  message,
  confirmButtonText,
  cancelButtonText,
}: AskModalProps) {
  return (
    <Overlay>
      <Wrapper>
        <Text>{message}</Text>
        <ButtonContainer>
          <Button onClick={onConfirm}>{confirmButtonText}</Button>
          <Button onClick={onClose}>{cancelButtonText}</Button>
        </ButtonContainer>
      </Wrapper>
    </Overlay>
  );
}

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 320px;
  height: 190px;
  background-color: #ffffff;
  margin: 0 auto;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

const Text = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  flex-grow: 1;
  height: 50px;
  background-color: #16a113;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
`;
