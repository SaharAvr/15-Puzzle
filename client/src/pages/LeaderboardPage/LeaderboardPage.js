import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import AnimatedButton from 'shared/components/AnimatedButton';
import restUrls from 'shared/rest/restUrls';
import { pathNames } from 'shared/routes/consts';
import { selectUsername } from 'shared/selectors';
import timeUtils from 'shared/utils/timeUtils';

import styles from './LeaderboardPage.scss';

const LeaderboardPage = () => {

  const username = useSelector(selectUsername);
  
  const actionButtonText = (username ? 'Play Again' : 'Play');
  const actionButtonHref = (username ? pathNames.GAME : pathNames.MAIN);

  const [leaderboardStats, setLeaderboardStats] = React.useState();

  const loadLeaderboard = React.useCallback(async () => {

    const response = await fetch(restUrls.LEADERBOARD);
    const { data } = await response.json();

    setLeaderboardStats(data);

  }, []);

  React.useEffect(loadLeaderboard, [loadLeaderboard]);

  return (
    <main
      className={styles.leaderboardPage}
    >

      <h1>{leaderboardStats ? 'Leaderboard' : 'Loading...'}</h1>

      {leaderboardStats && (_.isEmpty(leaderboardStats) ? (
        <h3>No stats yet... Better hurry up and play!</h3>
      ) : (
        <table>

          <thead>
            <tr>
              <th>Username</th>
              <th>Moves</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {_.map(leaderboardStats, stats => (
              <tr key={_.uniqueId(stats.username)}>
                <td>{stats.username}</td>
                <td>{stats.moves}</td>
                <td>{timeUtils.formatTime(stats.time)}</td>
              </tr>
            ))}
          </tbody>

        </table>
      ))}

      {leaderboardStats && (
        <AnimatedButton
          className={styles.actionButton}
          text={actionButtonText}
          href={actionButtonHref}
        />
      )}

    </main>
  );

};

export default LeaderboardPage;
