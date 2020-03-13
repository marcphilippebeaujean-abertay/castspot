import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { API_GUEST_POST_LIST } from "../../../../constants/apiUrl";
import GuestPost, { GuestPostData } from "./post";
import { setLoadingAlertVisibility } from "../../../../state/alertsState/alertActions";
import {
  useUserAuthSelector,
  useRouterSelector
} from "../../../../state/typedSelectors";
import * as QueryString from "query-string";
import Loader from "../../../utils/loader";
import Pagination from "./pagination";

interface GuestListResponse {
  results: Array<GuestPostData>;
  total_pages: number;
}

interface Props {
  posts: Array<GuestPostData> | undefined;
  setPosts: Function;
}

const PostGrid: React.SFC<Props> = ({ posts, setPosts }) => {
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState<string | undefined>(undefined);
  const [dataFetched, setDataFetched] = useState(false);

  const dispatch = useDispatch();

  const urlParams = useRouterSelector(state => state.router.location.search);
  const { authToken } = useUserAuthSelector(state => state.userAuthReducer);

  const queryParams = QueryString.parse(urlParams);
  const currentQueryPage =
    "page" in queryParams ? `${queryParams["page"]}` : undefined;

  if (!dataFetched) {
    dispatch(setLoadingAlertVisibility("loading"));
    const config =
      authToken === null
        ? {}
        : { headers: { Authorization: "Token " + authToken } };
    axios
      .get(
        API_GUEST_POST_LIST(
          currentQueryPage === undefined ? "1" : currentQueryPage
        ),
        config
      )
      .then(response => {
        setDataFetched(true);
        const data: GuestListResponse = response.data;
        setPosts(data.results);
        setTotalPages(data.total_pages);
      })
      .catch(e => console.log(e))
      .finally(() => {
        if (!dataFetched) {
          setDataFetched(true);
          dispatch(setLoadingAlertVisibility("finishing"));
        }
        if (page !== currentQueryPage) {
          setPage(currentQueryPage);
        }
      });
  }

  return dataFetched === false ? (
    <Loader />
  ) : (
    <div>
      {posts !== undefined
        ? posts.map((postData, postIndex) => (
            <GuestPost
              guestPostData={postData}
              key={`guest-post-${postIndex}`}
            />
          ))
        : null}
      <Pagination
        resetDataFetch={() => setDataFetched(false)}
        page={page === undefined ? "1" : page}
        maxPages={totalPages}
      />
    </div>
  );
};

export default PostGrid;
