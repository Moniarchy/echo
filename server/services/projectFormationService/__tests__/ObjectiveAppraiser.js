/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import ObjectiveAppraiser from '../objectives'

describe(testContext(__filename), function () {
  // NOTE: Most edge cases should be tested in the individual objective modeule's tests
  it('integration test', function () {
    const pool = {
      votes: [
        {playerId: 'A0', votes: ['g1', 'g2']},
        {playerId: 'p0', votes: ['g1', 'g2']},
        {playerId: 'p1', votes: ['g1', 'g2']},
        {playerId: 'A1', votes: ['g2', 'g1']},
        {playerId: 'p2', votes: ['g2', 'g2']},
        {playerId: 'p3', votes: ['g2', 'g1']},
        {playerId: 'p4', votes: ['g2', 'g1']},
        {playerId: 'p5', votes: ['g2', 'g1']},
      ],
      goals: [
        {goalDescriptor: 'g1', teamSize: 3},
        {goalDescriptor: 'g2', teamSize: 3},
      ],
      advancedPlayers: [{id: 'A0'}, {id: 'A1', maxTeams: 1}],
    }

    const teamFormationPlan = {
      seatCount: 9,
      teams: [
        {
          goalDescriptor: 'g1',
          teamSize: 3,
          matchesTeamSizeRecommendation: true,
          playerIds: ['A0', 'p0', 'p1']
        },
        {
          goalDescriptor: 'g1',
          teamSize: 3,
          matchesTeamSizeRecommendation: true,
          playerIds: ['A0', 'p3', 'p4']
        },
        {
          goalDescriptor: 'g2',
          teamSize: 3,
          matchesTeamSizeRecommendation: true,
          playerIds: ['A1', 'p2', 'p5']
        },
      ],
    }

    const objectives = new ObjectiveAppraiser(pool)
    const result = objectives.score(teamFormationPlan)
    expect(result).to.eq(1)
  })
})