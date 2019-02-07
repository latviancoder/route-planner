import styled from 'styled-components';

export const Container = styled.div`
  flex: 0 0 300px;
  background: #383838;
  color: #fff;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const RouteBuilder = styled.div`
  padding-bottom: 10px;
  border-bottom: 2px solid #4c4c4c;
  margin-bottom: 50px;
`;

export const DownloadButton = styled.button`
  border: 0;
  border-radius: 5px;
  display: block;
  text-align: center;
  height: 50px;
  padding: 0 15px;
  background: #C7E162;
  color: #383838;
  font-size: 18px;
  margin-top: auto;
  cursor: pointer;
  font-weight: bold;
`;
