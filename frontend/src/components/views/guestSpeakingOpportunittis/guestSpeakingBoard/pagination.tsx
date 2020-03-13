import React from "react";
import { Pagination } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import styled from "styled-components";

import { guestBoard } from "../links";

const PaginationWrapper = styled.div`
  border-width: 1px 0px 0px 0px;
  border-style: solid;
  border-color: lightgrey;
  margin: 0 auto;
`;

interface Props {
  page: string | undefined;
  maxPages: number;
  resetDataFetch: Function;
}

export default (props: Props) => {
  const dispatch = useDispatch();

  const items = [];
  for (let number = 1; number < props.maxPages + 1; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={
          number === parseInt(props.page === undefined ? "1" : props.page)
        }
        onClick={() => {
          dispatch(push(`${guestBoard.link}/?page=${number}`));
          props.resetDataFetch();
        }}
      >
        {number}
      </Pagination.Item>
    );
  }
  return (
    <PaginationWrapper className="pt-2">
      <Pagination className="justify-content-center">{items}</Pagination>
    </PaginationWrapper>
  );
};
