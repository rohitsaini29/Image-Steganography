import './App.css';
import React, { useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { Card } from 'antd';
import { Button, Space } from 'antd';
import { Typography } from 'antd';
import { Input } from 'antd';
import { Tooltip } from 'antd';
import { Image as Img } from 'antd';
import steg from "./steganography"
const { Title } = Typography;
const { TextArea } = Input;

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};


const App = () => {
  const [fileList, setFileList] = useState([]);
  const [imgUrl, setImgUrl] = useState(undefined);
  const [encodedImgUrl, setEncodedImgUrl] = useState(undefined);
  const [message, setMessage] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [encoding, setEncoding] = useState(false);
  const [decoding, setDecoding] = useState(false);

  const handleMessageChange = event => {

    setMessage(event.target.value);
  };

  const onEncode = async (e) => {
    
   
    setEncoding(true);
    let src = null;
    try {
      src = steg.encode(message, imgUrl);
      setEncodedImgUrl(src);
      console.log("Done!!");
    } catch (error) {
      console.log("Error Encoding Img", error);

    }

    setEncoding(false);
  }

  const onDecode = (e) => {
    e.preventDefault();
    console.log('Decode');
    setDecoding(true);
    let msg = steg.decode(imgUrl);
    setDecodedMessage(msg);
    setDecoding(false);
    console.log(msg);
  }

  const onClear = (e) => {
    e.preventDefault();
    console.log('Clear');

    setImgUrl(null);
    setEncodedImgUrl(null);
    setMessage(null);
    setDecodedMessage('')


  }



  const onChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(fileList);

    const file = newFileList[0];
    let src = null;
    if (file) {
      src = file.url;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
    }
    setImgUrl(src);
    setEncodedImgUrl(null);
    setDecodedMessage('')

  };



  const onPreview = async (file) => {

    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;

    const imgWindow = window.open(src, "Preview");
    imgWindow.document.title = "Preview";
    imgWindow?.document.write(image.outerHTML);
  };



  return (
    <div >
      <Title className='title' style={{ textAlign: "center" }}>Image Steganography</Title>
      <div className='App'>

        <div className='main' style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}  >
          <div className="input-data" style={{ display: "flex", flexDirection: "column" }}>
            <Tooltip title="Enter text to encode!">
              <TextArea
                className='inputText'
                maxLength={1000}
                allowClear
                showCount
                rows={4}
                style={{ marginBottom: "12%", resize: "none", maxHeight: 100, maxWidth: 300 }}
                onChange={handleMessageChange}
                value={message}


              />
            </Tooltip>
            <Card

              style={{
                width: 300
              }}
              actions={[
                <Space wrap align='center' >

                  <Button type="primary" onClick={onEncode} loading={encoding}>Encode</Button>
                  <Button type="primary" onClick={onDecode} loading={decoding}>Decode</Button>
                  <Button type="primary" onClick={onClear}>Clear</Button>

                </Space>

              ]}
            >

              <Upload

                customRequest={dummyRequest}
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                maxCount={1}
              >
                {fileList.length < 5 && '+ Upload'}
              </Upload>

            </Card >
          </div>


          <div className='output-data'>
            <div className='cards' >
              <Tooltip title="Original Image">
                <Card
                  hoverable
                  style={{ width: "240px", height: "180px", marginLeft: "5%" }}
                  cover={
                    <Img
                      alt="Original Image"
                      src={imgUrl ? imgUrl : "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"}
                      style={{ width: "100%", height: "180px", objectFit: "contain" }}


                    />
                  }

                >

                </Card>
              </Tooltip>
              <Tooltip title="Stego Image">
                <Card
                  hoverable
                  style={{ width: "240px", height: "180px", marginLeft: "5%" }}
                  cover={
                    <Img
                      alt="Stego Image"
                      src={encodedImgUrl ? encodedImgUrl : "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"}
                      style={{ width: "100%", height: "180px", objectFit: "contain" }}


                    />
                  }
                >
                </Card>
              </Tooltip>
            </div>
            <Tooltip title="Decoded Message">
              <TextArea
                className='outputText'
                maxLength={1000}
                allowClear
                showCount
                rows={5}
                style={{ marginTop: "6%", marginLeft: "5%", resize: "none", maxHeight: "100%", maxWidth: "100%" }}
                value={decodedMessage}


              />
            </Tooltip>

          </div>

        </div>
      </div >
    </div>
  );
};
export default App;