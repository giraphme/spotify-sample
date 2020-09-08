import { SpotifyResponseInfo } from "./index";
import styled from "styled-components";
import { useState } from "react";

export const ApiResponseRow = ({
  title,
  description,
  url,
  link,
  data,
}: SpotifyResponseInfo) => {
  const [isOpenRawBody, setIsOpenRawBody] = useState(false);

  return (
    <Root>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <ApiUrl>{url}</ApiUrl>
      <DocumentLink href={link} target="_blank">
        {link}
      </DocumentLink>
      <RawBodyWrapper open={isOpenRawBody}>
        <RawBody>{JSON.stringify(data, null, 2)}</RawBody>
        <RawBodyToggler onClick={() => setIsOpenRawBody(!isOpenRawBody)}>
          {isOpenRawBody ? "CLOSE" : "OPEN"}
        </RawBodyToggler>
      </RawBodyWrapper>
    </Root>
  );
};

const Root = styled.div`
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  border-bottom: 1px solid #ccc;
`;

const Title = styled.h2``;
const Description = styled.p``;
const ApiUrl = styled.div``;
const DocumentLink = styled.a``;
const RawBodyWrapper = styled.div<{ open: boolean }>`
  max-height: ${({ open }) => (open ? "auto" : "200px")};
  overflow-y: hidden;
  padding: 1rem;
  background: #fafafa;
  position: relative;
`;

const RawBody = styled.pre`
  font-family: monospace;
`;

const RawBodyToggler = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: blue;
  cursor: pointer;
`;
