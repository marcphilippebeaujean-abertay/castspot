import React, { FunctionComponent } from "react";

import IconWrapper from "./elementWrappers/IconWrapper";
import EllipsedText, { EllipsedLink } from "./ellipsedText";

interface Props {
  Icon: any;
  Header: string;
  Value: string;
  Ellipsed?: boolean;
}

export const marginBottom = "mb-2";

export const LabelledText: FunctionComponent<Props> = props => {
  return (
    <div className={marginBottom}>
      <small>
        <IconWrapper Icon={props.Icon} />
        {props.Header}
      </small>
      {props.Ellipsed === true || props.Ellipsed === undefined ? (
        <EllipsedText>
          {props.Value.length === 0 ? "-" : props.Value}
        </EllipsedText>
      ) : (
        <p> {props.Value.length === 0 ? "-" : props.Value}</p>
      )}
    </div>
  );
};

export const LabelledLink: FunctionComponent<Props> = props => (
  <div className={marginBottom}>
    <small>
      <IconWrapper Icon={props.Icon} />
      {props.Header}
    </small>
    {props.Value.length === 0 ? (
      <EllipsedText>-</EllipsedText>
    ) : (
      <div>
        <EllipsedLink href={props.Value}>{props.Value}</EllipsedLink>
      </div>
    )}
  </div>
);
