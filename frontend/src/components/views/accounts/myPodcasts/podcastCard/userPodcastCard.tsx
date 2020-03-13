import React, { FunctionComponent, useState } from "react";
import { Card, Button } from "react-bootstrap";
import * as Io from "react-icons/io";
import styled from "styled-components";

import { UserPodcast } from "../../../../../state/userPodcastsState/userPodcastsTypes";
import IconWrapper from "../../../../utils/elementWrappers/IconWrapper";
import PodcastValues from "./podcastValues";
import EditForm from "./editForm/editForm";

const HeaderImage = styled.img`
  display: inline-block;
  height: 30px;
  width: 30px;
  border-radius: 25px;
`;

interface PodcastCardProps {
  podcast: UserPodcast;
}

const PodcastCard: FunctionComponent<PodcastCardProps> = ({ podcast }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Card>
      <Card.Header className="bg-white">
        <HeaderImage className="mr-2" src={podcast.image_link} />
        {podcast.title}
      </Card.Header>
      <Card.Body>
        {isEditing === false ? (
          <div>
            <PodcastValues podcast={podcast} />
            <Button onClick={() => setIsEditing(true)}>
              <IconWrapper Icon={Io.IoMdCreate} />
              Edit
            </Button>
          </div>
        ) : (
          <EditForm
            initLinksValues={podcast.publishing_links}
            rssFeed={podcast.rss_url}
            toggleEditMode={setIsEditing}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default PodcastCard;
