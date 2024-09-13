import React from "react";
import { List, ListItem } from "@northlight/ui";
import { UserScoreObject } from "../src/UserScoreObject";

const UserScoreList = ({ selectedUser }: {selectedUser: UserScoreObject}) => {
  return (
    <List border="1px solid #000" maxH="80vh" overflowY="auto">
      {selectedUser?.scores.map((score: number, index) => {
        return (
          <ListItem
            textAlign="center"
            padding="6px"
            _even={{ backgroundColor: "#eee" }}
            fontWeight={index === 0 ? "bold" : ""}
          >
            {score.toString()}
          </ListItem>
        );
      })}
    </List>
  )
};

export default UserScoreList;
