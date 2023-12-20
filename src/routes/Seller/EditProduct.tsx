import HeaderPrevPageBtn from '../../components/HeaderPrevPageBtn';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
// import { BASE_URL } from "../../constant/union";
import { useEffect, useState } from 'react';
import customAxios from '../../apiFetcher/customAxios';
import AWS from 'aws-sdk';
import { useRecoilValue } from 'recoil';
import { userIdState } from '../../store/atom/auth';

interface formValue {
  userId: number;
  productName: string;
  price: number;
  categories: [
    {
      category: string;
    },
    {
      category: string;
    },
  ];
  // imageStoragePath: 'C:/greenjangteo/product';
  images: [
    {
      url: string;
      position: 0;
    },
  ];
  productImage: '';
  description: string;
  inventory: number;
}

const EditProduct = () => {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<formValue>({
    mode: 'onSubmit',
  });

  const userId = useRecoilValue(userIdState);

  const { productId } = useParams();
  const navigate = useNavigate();
  const onReset = () => {
    navigate(-1);
  };

  const [myBucket, setMyBucket] = useState(Object);
  const [selectedFile, setSelectedFile] = useState('');
  const [imgURL, setImgURL] = useState(``);
  console.log(myBucket);

  const location = useLocation();
  const value = [location.state];
  // console.log(...value);

  const onSubmit = (data: formValue) => {
    uploadFile(selectedFile);
    // axios.post(`http://localhost:3000/post`, {
    customAxios
      .put(`/product/${productId}`, {
        // axios.post(`${BASE_URL}/products`, {
        userId: userId,
        productName: data.productName,
        price: data.price,
        categories: [
          {
            category: data.categories[0].category,
          },
          {
            category: data.categories[1].category,
          },
        ],
        productImage: data.productImage,
        description: data.description,
        inventory: data.inventory,
        images: [
          {
            url: imgURL,
            position: 0,
          },
        ],
      })
      .then(response => {
        console.log(response);
        alert(`수정이 완료되었습니다.`);
        navigate(-1);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  useEffect(() => {
    AWS.config.update({
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    });
    const myBucket = new AWS.S3({
      params: { Bucket: `greengangteo` },
      region: import.meta.env.VITE_AWS_DEFAULT_REGION,
    });
    console.log(myBucket);

    setMyBucket(myBucket);
  }, []);

  const handleFileInput = (e: any) => {
    setSelectedFile(e.target.files[0]);
    console.log('e', e);
  };
  const uploadFile = (file: any) => {
    const param = {
      ACL: 'public-read',
      ContentType: `image/*`,
      Body: file,
      Bucket: `greengangteo`,
      Key: `product/${file.name}`,
    };

    myBucket.putObject(param).send((err: any) => {
      if (err) {
        console.log(err);
      } else {
        const url = myBucket.getSignedUrl('getObject', { Key: param.Key });
        console.log(url, 'url');
        setImgURL(url);
      }
    });
  };

  const firstCategory = ['음식', '의류', '생필품'];
  // const secondCategory = ["음식", "의류", "생필품"];
  return (
    <>
      <HeaderPrevPageBtn />
      <Wrapper>
        <UploadForm onSubmit={handleSubmit(onSubmit)}>
          <BtnBox>
            <Button type="reset" onClick={onReset}>
              취소
            </Button>
            <Button type="submit">수정완료</Button>
            {/* <Button type="submit">작성완료</Button> */}
          </BtnBox>
          {value.map((val: any) => (
            <>
              <Box>
                <Label htmlFor="image">이미지</Label>
                <Input
                  type="file"
                  id="image"
                  {...register('productImage', {
                    onChange: e => {
                      handleFileInput(e);
                      // uploadFile(selectedFile);
                    },
                  })}
                ></Input>
              </Box>
              <Box>
                <Label htmlFor="firstCategories">분류1</Label>
                <Select
                  id="firstCategories"
                  value={val.categories[0].category}
                  {...register('categories.0.category', {
                    required: '카테고리를 지정해주세요',
                  })}
                >
                  <Option value="카테고리" disabled>
                    카테고리
                  </Option>
                  {firstCategory.map(category => (
                    <Option value={category} key={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Box>
              <Box className="category">
                <Label htmlFor="SecondCategories">분류2</Label>
                <Select
                  id="SecondCategories"
                  {...register('categories.1.category', {
                    required: '카테고리를 지정해주세요',
                  })}
                >
                  <Option value="카테고리" disabled>
                    카테고리
                  </Option>
                  {firstCategory.map(category => (
                    <Option value={category} key={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Label htmlFor="productName">상품명</Label>
                <Input
                  type="text"
                  id="productName"
                  defaultValue={val.productName}
                  {...register('productName', {
                    required: '상품명을 입력해주세요',
                  })}
                ></Input>
              </Box>
              <Box>
                <Label htmlFor="price">가격</Label>
                <Input
                  type="number"
                  id="price"
                  defaultValue={val.price}
                  {...register('price', { required: '가격을 입력해주세요' })}
                ></Input>
              </Box>
              <Box>
                <Label htmlFor="inventory">수량</Label>
                <Input
                  type="number"
                  id="produectQuantity"
                  defaultValue={val.count}
                  {...register('inventory', {
                    required: '재고 수량을 입력해주세요',
                  })}
                ></Input>
              </Box>
              <Textarea
                rows={20}
                placeholder="제품의 설명을 입력해주세요"
                defaultValue={val.description}
                {...register('description', {
                  required: '제품의 설명을 입력해주세요',
                })}
              ></Textarea>
            </>
          ))}
        </UploadForm>
      </Wrapper>
    </>
  );
};
export default EditProduct;

const Wrapper = styled.div`
  padding: 20px;
`;
const BtnBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px 0;

  &.category {
    margin-bottom: 20px;
  }
`;
const Button = styled.button`
  display: block;
  margin-left: auto;
  padding: 10px 20px;
  background-color: #dedede;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 10px;
`;
const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const Input = styled.input`
  flex: auto;
  padding: 5px;
`;
const Label = styled.label`
  width: 120px;
`;
const Select = styled.select`
  // margin: 20px 0;
  flex: auto;
  padding: 5px;
  fon-tsize: 16px;
`;
const Option = styled.option`
  text-align: center;
  font-size: 16px;
`;
const Textarea = styled.textarea`
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;

  &::placeholder {
    color: #b0b0b0;
  }
`;
