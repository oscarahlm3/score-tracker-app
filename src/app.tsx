import React, { useState } from 'react'
import {
  Container,
  Box,
  VStack,
  HStack,
  H1,
  H2,
  List,
  ListItem,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Button
} from '@northlight/ui'
import { palette } from '@northlight/tokens'
import { ExcelDropzone, ExcelRow } from './excel-dropzone.jsx'
import initialScores from "./scores.js"
import users from "./users.js"
import { UserScoreObject } from './UserScoreObject.js'
import UserScoreList from "../components/UserScoreList.tsx"
import TopScoreListItem from '../components/TopScoreListItem.tsx'

const sortScores = (scores: number[]) => {
  return scores.sort((scoreA, scoreB) => scoreB - scoreA)
}

export default function App () {
  const [scores, setScores] = useState(initialScores)
  const [selectedUser, setSelectedUser] = useState<UserScoreObject>()
  const [inputtedName, setInputtedName] = useState<string>("")
  const [inputtedScore, setInputtedScore] = useState<number>(0)
  const [hasInputtedNameError, setHasInputtedNameError] = useState<boolean>(false)
  const [hasInputtedScoreError, setHasInputtedScoreError] = useState<boolean>(false)

  const addNewScore = (name: string, score: number) => {
    let userId = users.find(userObj => userObj.name === name)?._id

    if(!userId) {
      userId = users.length + 1
      users.push({_id: userId, name})
    }

    if(userId === selectedUser?._id) {
      const newScores = sortScores([...selectedUser.scores, score])
      const updatedUserObj = {...selectedUser, scores: newScores}
      setSelectedUser(updatedUserObj)
    }

    setScores(prevState => [...prevState, {userId, score}])
  }

  function handleSheetData (data: ExcelRow[]) {
    data.forEach((dataRow, index) => {
      const { name, score } = dataRow

      if(!name) {
        console.error(`Missing name for row ${index}`)
        return;
      }

      if(!score) {
        console.error(`Missing score for row ${index}`)
        return;
      }

      addNewScore(name, score)
    })
  }

  const userScoreObjList = users.map(userObj => { 
    const userScores = scores
    .filter(scoreObj => scoreObj.userId === userObj._id)
    .map(scoreObj => scoreObj.score)

    const userTopScore = userScores
    .reduce((topScore, score) => {
      if(score > topScore) {
        topScore = score
      }

      return topScore
    }, 0)

    return {
      ...userObj, 
      scores: sortScores(userScores),
      topScore: userTopScore
    }
  })

  const handleAddScore = () => {
    setHasInputtedNameError(!inputtedName)
    setHasInputtedScoreError(!inputtedScore)

    if(inputtedName && inputtedScore) {
      addNewScore(inputtedName, inputtedScore)
    }
  }

  return (
    <Container maxW="6xl" padding="4">
      <H1 marginBottom="4">Score tracker</H1>
      <HStack spacing={10} align="flex-start">
        <VStack>
          <ExcelDropzone
            onSheetDrop={ handleSheetData }
            label="Import excel file here"
          />
          <H2>Or</H2>
          <Text>Add a new score using the form below</Text>
          <FormControl 
            isRequired
            isInvalid={hasInputtedNameError || hasInputtedScoreError}
          >
            <FormLabel>Name</FormLabel>
            <Input 
              type="text"
              isInvalid={hasInputtedNameError}
              onChange={(e) => setInputtedName(e.target.value)}
            />
            {hasInputtedNameError && <FormErrorMessage>Name is required</FormErrorMessage>}
            <FormLabel>Score</FormLabel>
            <Input 
              type="number"
              isInvalid={hasInputtedScoreError}
              onChange={(e) => setInputtedScore(Number(e.target.value))}
            />
            {
              hasInputtedScoreError ? (
                <FormErrorMessage>Score is required</FormErrorMessage> 
              ) : ( 
                <FormHelperText>Score must be a number</FormHelperText>
              )
            }
            <Box display="flex" justifyContent="center" margin="12px">
              <Button type="submit" onClick={handleAddScore}>Add score</Button>
            </Box>
          </FormControl>
        </VStack>
        <VStack align="left">
          <Box>
            <H2>Top scores</H2>
            <List border="1px solid #000" maxH="80vh" overflowY="auto">
              {
                userScoreObjList
                .sort((userA, userB) => userB.topScore - userA.topScore )
                .map(userScoreObj => <TopScoreListItem userScoreObj={userScoreObj} setSelectedUser={setSelectedUser}/>)
              }
            </List>
            </Box>
        </VStack>
        {selectedUser && (
          <VStack align="right">
            <Box minW="300px" textAlign="center">
              <H2>{`Scores for ${selectedUser.name}`}</H2>
                <UserScoreList selectedUser={selectedUser} />
            </Box>
          </VStack>
        )}
      </HStack>
    </Container>
  ) 
}
