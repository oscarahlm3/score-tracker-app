import React from "react"
import {
    ListItem,
    Text,
  } from '@northlight/ui'
import { palette } from '@northlight/tokens'
import { UserScoreObject } from "../src/UserScoreObject";

const TopScoreListItem = ({userScoreObj, setSelectedUser}:
{userScoreObj: UserScoreObject, setSelectedUser: Function}) => {
    const {name, topScore} = userScoreObj

    return (
      <ListItem padding="6px" _even={{backgroundColor: "#eee"}}>
        <Text>
          <Text 
            as="span"
            sx={ {color: palette.blue['500'], textDecoration: 'underline'} }
            _hover={{ cursor: "pointer", color: "#77aafc" }}
            onClick={() => setSelectedUser(userScoreObj)}
            >
              {name}
            </Text>
          : {topScore}
        </Text>
      </ListItem>
    )
  }

  export default TopScoreListItem