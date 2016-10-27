import {normalize, Schema} from 'normalizr'

import {getGraphQLFetcher} from 'src/common/util'
import loadUsers from './loadUsers'

export const LOAD_CYCLE_VOTING_RESULTS_REQUEST = 'LOAD_CYCLE_VOTING_RESULTS_REQUEST'
export const LOAD_CYCLE_VOTING_RESULTS_SUCCESS = 'LOAD_CYCLE_VOTING_RESULTS_SUCCESS'
export const LOAD_CYCLE_VOTING_RESULTS_FAILURE = 'LOAD_CYCLE_VOTING_RESULTS_FAILURE'
export const RECEIVED_CYCLE_VOTING_RESULTS = 'RECEIVED_CYCLE_VOTING_RESULTS'

const chapterSchema = new Schema('chapters')
const cycleSchema = new Schema('cycles')
cycleSchema.define({chapter: chapterSchema})
const cycleVotingResultsSchema = new Schema('cycleVotingResults')
cycleVotingResultsSchema.define({cycle: cycleSchema})

function receivedCycleVotingResultsWithoutLoadingUsers(cycleVotingResults) {
  const response = normalize(cycleVotingResults, cycleVotingResultsSchema)
  return {type: RECEIVED_CYCLE_VOTING_RESULTS, response}
}

function loadCycleVotingResultsWithoutCorrespondingUsers() {
  return {
    types: [
      LOAD_CYCLE_VOTING_RESULTS_REQUEST,
      LOAD_CYCLE_VOTING_RESULTS_SUCCESS,
      LOAD_CYCLE_VOTING_RESULTS_FAILURE,
    ],
    shouldCallAPI: () => true,
    callAPI: (dispatch, getState) => {
      const query = {
        query: `
query {
  getCycleVotingResults {
    id
    cycle {
      id
      cycleNumber
      startTimestamp
      state
      chapter {
        id
        name
        channelName
        timezone
        goalRepositoryURL
        githubTeamId
        cycleDuration
        cycleEpoch
      }
    }
    numEligiblePlayers
    numVotes
    candidateGoals {
  		goal {
  			url
        title
      }
      playerGoalRanks {
        playerId
        goalRank
      }
    }
  }
}
        `,
      }
      const {auth} = getState()

      return getGraphQLFetcher(dispatch, auth)(query)
        .then(graphQLResponse => graphQLResponse.data.getCycleVotingResults)
        .then(cycleVotingResults => normalize(cycleVotingResults, cycleVotingResultsSchema))
    },
  }
}

function _getPlayerIdsFromCandidateGoals(candidateGoals) {
  const playerIds = candidateGoals ? Array.from(
    candidateGoals.reduce((playerIdSet, candidateGoal) => {
      const newPlayerIds = Array.from(
        candidateGoal.playerGoalRanks.reduce((newPlayerIdSet, rank) => {
          newPlayerIdSet.add(rank.playerId)
          return newPlayerIdSet
        }, new Set())
      )
      newPlayerIds.forEach(playerId => playerIdSet.add(playerId))
      return playerIdSet
    }, new Set())
  ) : []
  return playerIds
}

function loadUsersForCycleVotingResults(dispatch, getState) {
  return () => {
    const {cycleVotingResults} = getState().cycleVotingResults.cycleVotingResults
    const playerIds = _getPlayerIdsFromCandidateGoals(cycleVotingResults.candidateGoals)
    return dispatch(loadUsers(playerIds))
  }
}

export function receivedCycleVotingResults(cycleVotingResults) {
  return (dispatch, getState) => {
    return dispatch(receivedCycleVotingResultsWithoutLoadingUsers(cycleVotingResults))
      .then(loadUsersForCycleVotingResults(dispatch, getState))
  }
}

export default function loadCycleVotingResults() {
  return (dispatch, getState) => {
    return dispatch(loadCycleVotingResultsWithoutCorrespondingUsers())
      .then(loadUsersForCycleVotingResults(dispatch, getState))
  }
}
