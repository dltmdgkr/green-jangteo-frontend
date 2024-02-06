import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userIdState } from '../../store/atom/auth';
import customAxios from '../../apiFetcher/customAxios';
import useGetPost from '../../hooks/useGetPost';
import PostFormComment from './PostFormComment';
import { userDataState } from '../../store/atom/userDataState';
import { useState } from 'react';
import ConfirmModal from '../modal/ConfirmModal';

export default function MyBoardDetail() {
  const { subject, content, username } = useGetPost();
  const { date } = useGetPost();
  const { postId } = useParams();
  const userId = useRecoilValue(userIdState);
  const myInfo = useRecoilValue(userDataState);
  const [showModal, setShowModal] = useState(false);

  const onDeleteClick = async () => {
    try {
      await customAxios.delete(`/posts/${postId}`, {
        data: { userId },
      });

      setShowModal(true);
    } catch (error) {
      alert('게시물 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Wrapper>
      <ContentWrapper>
        {myInfo?.username === username ? (
          <ButtonContainer>
            <Link to={`/posts/${postId}/edit`} state={{ subject, content }}>
              <EditButton>수정</EditButton>
            </Link>
            <DeleteButton onClick={onDeleteClick}>삭제</DeleteButton>
          </ButtonContainer>
        ) : null}
        <Title>{subject}</Title>
        <Username>유저명: {username}</Username>
        <CreatedAt>등록일: {date.slice(0, 10)}</CreatedAt>
        <Content>{content}</Content>
        <hr />
        <PostFormComment />
      </ContentWrapper>
      {showModal && (
        <ConfirmModal
          message="게시물이 삭제되었습니다"
          linkPath={'/posts/my'}
          onClose={() => setShowModal(false)}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: #e7e7e7;
  height: 100%;
`;

const ContentWrapper = styled.div`
  height: 80vh;
  padding: 20px;
  background-color: #ffffff;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const EditButton = styled.button`
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const Title = styled.p`
  width: 100%;
  height: 60px;
  font-size: 20px;
  padding-top: 20px;
`;

const Username = styled.p`
  font-size: 14px;
  padding-bottom: 5px;
`;

const CreatedAt = styled.p`
  font-size: 14px;
  color: #999999;
`;

const Content = styled.div`
  width: 100%;
  height: 200px;
  padding-top: 20px;
  margin-top: 20px;
  font-size: 16px;
  white-space: pre;
`;
