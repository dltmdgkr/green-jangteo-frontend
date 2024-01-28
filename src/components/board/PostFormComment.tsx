import { useRecoilValue } from 'recoil';
import customAxios from '../../apiFetcher/customAxios';
import useGetComment from '../../hooks/useGetComment';
import { userIdState } from '../../store/atom/auth';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { userDataState } from '../../store/atom/userDataState';
import AskModal from '../modal/AskModal';

export default function PostFormComment() {
  const { postId } = useParams();
  const userId = useRecoilValue(userIdState);
  const { addComment, comments, setPage, refreshComments } = useGetComment();
  const ref = useRef<HTMLInputElement>(null);
  const myInfo = useRecoilValue(userDataState);
  const [showModal, setShowModal] = useState(false);
  const [editedContent, setEditedContent] = useState<string>('');
  const [toggleStates, setToggleStates] = useState(
    Array(comments.length).fill(false),
  );

  const handleToggle = (index: number) => {
    setToggleStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!userId || !postId) return;
    e.preventDefault();
    const newComment = ref.current?.value || '';

    try {
      const data = { userId, content: newComment, postId };
      const response = await customAxios.post(`/comments`, data);
      const newCommentData = {
        commentId: response.data.commentId,
        userId: response.data.userId,
        username: response.data.username,
        content: response.data.content,
        createdAt: response.data.createdAt,
      };

      addComment(newCommentData);
      setShowModal(false);
    } catch (e) {
      console.error('Comment Error:', e);
      throw e;
    }

    ref.current!.value = '';
  };

  const handlePreviousPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleCommentEdit = async (commentId: string) => {
    try {
      if (!editedContent) {
        return;
      }

      await customAxios.put(`/comments/${commentId}`, {
        userId,
        content: editedContent,
        postId,
      });

      refreshComments();
      setEditedContent('');
      handleToggle(comments.findIndex(c => c.commentId === commentId));
    } catch (error) {
      console.error('댓글 수정 중 에러가 발생했습니다.', error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await customAxios.delete(`/comments/${commentId}`, {
        data: { userId: userId },
      });
      refreshComments();
    } catch (error) {
      console.error('댓글 삭제 중 에러가 발생했습니다.', error);
    }
  };

  return (
    <>
      <CommentSection>
        {comments.map((comment, index) => (
          <CommentContainer key={comment.commentId}>
            <span>{comment.username}</span>
            <p>{comment.content}</p>
            {toggleStates[index] && (
              <>
                <Input
                  type="text"
                  placeholder="수정 댓글을 입력하세요."
                  value={editedContent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditedContent(e.currentTarget.value)
                  }
                />
                <div className="edit-buttons">
                  <button onClick={() => handleCommentEdit(comment.commentId)}>
                    수정완료
                  </button>
                  <button onClick={() => handleToggle(index)}>취소</button>
                </div>
              </>
            )}
            {myInfo?.username == comment.username ? (
              <>
                {!toggleStates[index] && (
                  <div className="edit-buttons">
                    <button onClick={() => handleToggle(index)}>
                      수정하기
                    </button>
                    <button onClick={() => setShowModal(true)}>삭제하기</button>
                  </div>
                )}
              </>
            ) : null}
            {showModal && (
              <AskModal
                message="댓글을 삭제 하시겠습니까?"
                confirmButtonText="확인"
                cancelButtonText="취소"
                onConfirm={() => handleCommentDelete(comment.commentId)}
                onClose={() => setShowModal(false)}
              />
            )}
          </CommentContainer>
        ))}
        <div className="pagination">
          <button onClick={handlePreviousPage}>이전 페이지</button>
          <button onClick={handleNextPage}>다음 페이지</button>
        </div>
      </CommentSection>
      <CommentWrapper onSubmit={onSubmit}>
        <Input type="text" placeholder="댓글을 남겨보세요." ref={ref} />
        <Button type="submit">등록</Button>
      </CommentWrapper>
    </>
  );
}

const CommentWrapper = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Input = styled.input`
  flex: 1;
  height: 45px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 15px;
  outline: none;
`;

const Button = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 70px;
  height: 35px;
  padding: 0 15px;
  font-size: 16px;
  border: 1px solid #007bff;
  border-radius: 10px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
`;

const CommentContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 10px;
  }

  .edit-buttons {
    display: flex;
    gap: 5px;
    margin-top: 10px;

    button {
      padding: 6px 10px;
      font-size: 14px;
      cursor: pointer;
      background-color: #f0f0f0;
      color: #555;
      border: none;
      border-radius: 5px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
`;

const CommentSection = styled.div`
  margin-top: 20px;
  .pagination {
    display: flex;
    gap: 5px;
    justify-content: center;
    margin-top: 10px;

    button {
      padding: 6px 10px;
      font-size: 14px;
      cursor: pointer;
      background-color: #f0f0f0;
      color: #555;
      border: none;
      border-radius: 5px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
`;
