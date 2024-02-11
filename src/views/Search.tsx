import styled from 'styled-components';
import HeaderPrevPageBtn from '../components/HeaderPrevPageBtn';
import { useEffect, useState } from 'react';
import customAxios from '../apiFetcher/customAxios';
import { Link } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import useDebounce from '../hooks/useDebounce';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [currentValue, setCurrentValue] = useState([]);
  const debouncedValue = useDebounce(currentValue, 300);

  useEffect(() => {
    customAxios
      .get('/products/auto-complete', { params: { keyword: debouncedValue } })
      .then(response => {
        setProducts(response.data);
      })
      .catch(err => console.log(err.message));
  }, [debouncedValue]);

  const autoComplete = (e: any) => {
    setCurrentValue(e.target.value);
  };

  return (
    <>
      <HeaderPrevPageBtn />
      <Wrapper>
        <Input
          placeholder="검색어를 입력해주세요"
          type="text"
          onChange={e => autoComplete(e)}
        />

        <ItemList>
          {products.map((product: any, idx) => (
            <>
              <Link
                to={`/product?keyword=${product.productName}`}
                state={product.productName}
              >
                <Item key={idx}>{product.productName}</Item>
              </Link>
            </>
          ))}
        </ItemList>
        <Link to={`/product?keyword=${currentValue}`} state={currentValue}>
          <SearchBtn>
            <IoSearch />
          </SearchBtn>
        </Link>
      </Wrapper>
    </>
  );
};

export default Search;

const Wrapper = styled.div`
  min-height: inherit;
  box-sizing: border-box;
  background-color: #f1f1f1;
  position: relative;
`;
const Input = styled.input`
  width: 100%;
  height: 60px;
  font-size: 18px;
  border: none;
  text-indent: 10px;
  border-bottom: 1px solid #cccccc;
  &:focus {
    outline: none;
  }
`;

const ItemList = styled.ul`
  background-color: #ffffff;
  padding: 10px 0;
`;
const Item = styled.li`
  height: 50px;
  line-height: 50px;
  text-indent: 10px;
  font-size: 18px;
`;

const SearchBtn = styled.button`
  background-color: transparent;
  color: #b0b0b0;
  width: 60px;
  height: 60px;
  font-size: 30px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 900;
  border: none;

  &:hover {
    color: var(--maincolor);
  }
`;
